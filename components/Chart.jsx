import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';

const getBound = (x, width) => {
  if (!x) {
    return 0;
  }
  if (x > 0) {
    return x;
  }
  return width + x;
};

const getBound2 = (y, y2, height) => {
  if (!y) {
    return height - y2;
  }
  if (y > 0) {
    return height - y2 - y;
  }
  return -y2 - y;
};

const getBounds = (bounds, width, height) => {
  const x = getBound(bounds?.left, width);
  const y = getBound(bounds?.top, height);
  const w = getBound2(bounds?.right, x, width);
  const h = getBound2(bounds?.bottom, y, height);
  return {
    x,
    y,
    w: w < 0 ? 100 : w,
    h: h < 0 ? 100 : h
  };
};

let isMouseDown = false;

function Chart({
  charts, onClick, width, height,
  disableAnimation
}) {
  const canvasRef = useRef(null);
  let selected;

  const draw = (ctx, frameCount, hoverObj, clickedObj) => {
    ctx.clearRect(-1, -1, width + 1, height + 1);
    charts.forEach((chart) => {
      const {
        x, y, w, h
      } = getBounds(chart.bounds, width, height);

      const padding = chart?.padding || {
        left: 40,
        right: 0,
        bottom: 35,
        top: 0
      };

      const canvasProps = {
        w,
        h,
        offsetX: x,
        offsetY: y,
        scrollX: chart.scrollX,
        scaleX: chart.scaleX,
        paddingLeft: padding?.left,
        paddingRight: padding?.right,
        paddingBottom: padding?.bottom,
        paddingTop: padding?.top
      };

      chart.lineObjs.forEach((line) => line.render(
        ctx,
        frameCount,
        canvasProps,
        hoverObj,
        clickedObj
      ));
    });
  };

  useEffect(() => {
    let frameCount = 0;
    let animationFrameId;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const ratio = window.devicePixelRatio || 1.0;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(ratio, ratio);

    const render = () => {
      if (disableAnimation) {
        draw(context, 50);
      } else {
        frameCount += 1;
        draw(context, frameCount);
        if (frameCount < 50) { // animate for 100 frames
          animationFrameId = window.requestAnimationFrame(render);
        }
      }
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  const repaint = (clickedObj, hoverObj) => {
    if (clickedObj) {
      selected = clickedObj;
      const newObj = {
        ...clickedObj,
        dateClicked: dayjs(clickedObj.datum[clickedObj.patternX]).format('YYYY-MM-DD')
      };
      onClick && onClick(newObj);
    }
    const render = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      draw(context, 50, hoverObj, selected);
    };
    window.requestAnimationFrame(render);
  };

  const scaleMove = (chartNum, newScroll, newScale) => {
    charts[chartNum].scrollX = newScroll;
    charts[chartNum].scaleX = newScale;
  };

  const onMouse = (isClick) => (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let newSelected;
    let newHover;
    let shouldRepaint;
    charts.forEach((chart) => {
      chart.lineObjs.forEach((line) => {
        const newData = line.mouseMove(
          (e.pageX - rect.x),
          (e.pageY - rect.y),
          isClick,
          isMouseDown,
          scaleMove,
          { x: e.movementX, y: e.movementY }
        );
        if (newData?.selected) {
          newSelected = newData.selected;
          shouldRepaint = true;
        }
        if (newData?.hover) {
          newHover = newData.hover;
          shouldRepaint = true;
        }
        if (newData?.repaint) {
          shouldRepaint = true;
        }
      });
    });

    if (shouldRepaint) {
      repaint(newSelected, newHover);
    }
  };

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onMouseLeave={() => { repaint(null, null); isMouseDown = false; }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={parseInt(height || '100', 10)}
        onClick={onMouse(true)}
        onMouseDown={() => {
          isMouseDown = true;
        }}
        onMouseUp={() => { isMouseDown = false; }}
        onMouseMove={onMouse(false)}
      />
    </div>
  );
}

export default Chart;
