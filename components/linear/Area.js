import {
  animateFC, getPlotter
} from '../../utils/ChartUtils';
import {
  clip
} from './utils';

class Area {
  constructor(d, patternX, patternY, otherProps) {
    this.d = d;
    this.patternX = patternX;
    this.patternY = patternY;
    this.width = otherProps.width || 10;
    this.color = otherProps.color || '#6271eb';
    this.isHorizontal = otherProps.isHorizontal;

    this.isSmooth = otherProps.isSmooth;
  }

  getWidth() {
    return 0;
  }

  setPlotters(plotters) {
    this.plotters = plotters;
  }

  mouseMove(xLoc, yLoc, isClick, button) {
    if (this.disableInteractions) {
      return {};
    }

    const {
      h,
      w,
      offsetX = 0,
      offsetY = 0,
      scrollX,
      scaleX,
      paddingY = 0,
      paddingLeft = 0,
      paddingBottom = 0,
      paddingTop = 0,
      paddingX = 0
    } = this.canvasProps;
    const bot = paddingY + h - paddingBottom;

    let selected;
    let hover;
    this.d.forEach((datum) => {
      const x = paddingX + paddingLeft + getPlotter(this.plotters, this.patternX).valToPixels(datum[this.patternX]);
      const y = getPlotter(this.plotters, this.patternY).valToPixels(datum[this.patternY]);

      if (xLoc > (x - 10) && xLoc < (x + this.width) /*&& yLoc < ((bot - y) + 10)*/) {
        if (isClick) {
          selected = {
            datum,
            patternY: this.patternY,
            patternX: this.patternX,
            x,
            y: yLoc
          };
        }
        hover = {
          datum,
          patternY: this.patternY,
          patternX: this.patternX,
          x,
          y: yLoc
        };
      }
    });

    return {
      hover,
      selected
    };
  }

  render(ctx, frameCount, canvasProps) {
    this.canvasProps = canvasProps;
    const {
      h, paddingBottom, paddingLeft, offsetY = 0, paddingX = 0, groupStart
    } = canvasProps;
    const paddingY = offsetY || 0;

    ctx.save();
    ctx.lineWidth = 2;
    let startX;
    let oldX;

    clip(ctx, canvasProps);

    ctx.beginPath();
    const bot = paddingY + h - paddingBottom;
    this.d.forEach((datum, i) => {
      ctx.fillStyle = `${datum.color || this.color}5c`;
      ctx.strokeStyle = datum.color || this.color;

      const x = getPlotter(this.plotters, this.patternX).valToPixels(
        datum[this.patternX],
        canvasProps?.scrollX,
        canvasProps?.scaleX
      );
      const y = getPlotter(this.plotters, this.patternY).valToPixels(datum[this.patternY]);

      const y2 = animateFC(frameCount, y);
      if (this.isHorizontal) {
        if (i === 0) {
          startX = bot;
          ctx.moveTo(paddingX + paddingLeft + y2, bot);
        }

        if (this.isSmooth) {
          const pDatum = this.d[i - 1];
          const yP = getPlotter(this.plotters, this.patternY).valToPixels(pDatum[this.patternY]);
          const xP = getPlotter(this.plotters, this.patternX).valToPixels(
            pDatum[this.patternX],
            canvasProps?.scrollX,
            canvasProps?.scaleX
          );
          const yP2 = animateFC(frameCount, yP);
          const pointPrev = { x: paddingX + paddingLeft + yP2, y: bot - xP };
          const point = { x: paddingX + paddingLeft + y2, y: bot - x };
          const xMid = (pointPrev.x + point.x) / 2;
          const yMid = (pointPrev.y + point.y) / 2;
          const cpX1 = (xMid + pointPrev.x) / 2;
          const cpX2 = (xMid + point.x) / 2;
          ctx.quadraticCurveTo(cpX1, pointPrev.y, xMid, yMid);
          ctx.quadraticCurveTo(cpX2, point.y, point.x, point.y);
        } else {
          ctx.lineTo(paddingX + paddingLeft + y2, bot - x);
        }
        oldX = bot - x;
      } else {
        if (i === 0) {
          startX = paddingX + paddingLeft + x;
          ctx.moveTo(paddingX + paddingLeft + x, bot);
        }

        if (this.isSmooth && i > 0) {
          const pDatum = this.d[i - 1];
          const yP = getPlotter(this.plotters, this.patternY).valToPixels(pDatum[this.patternY]);
          const xP = getPlotter(this.plotters, this.patternX).valToPixels(
            pDatum[this.patternX],
            canvasProps?.scrollX,
            canvasProps?.scaleX
          );
          const yP2 = animateFC(frameCount, yP);
          const pointPrev = { x: paddingX + paddingLeft + xP, y: bot - yP2 };
          const point = { x: paddingX + paddingLeft + x, y: bot - y2 };
          const xMid = (pointPrev.x + point.x) / 2;
          const yMid = (pointPrev.y + point.y) / 2;
          const cpX1 = (xMid + pointPrev.x) / 2;
          const cpX2 = (xMid + point.x) / 2;
          ctx.quadraticCurveTo(cpX1, pointPrev.y, xMid, yMid);
          ctx.quadraticCurveTo(cpX2, point.y, point.x, point.y);
        } else {
          ctx.lineTo(paddingX + paddingLeft + x, bot - y2);
        }

        oldX = paddingX + paddingLeft + x;
      }
    });

    if (this.isHorizontal) {
      ctx.lineTo(paddingLeft, oldX);
      ctx.lineTo(paddingLeft, bot);
    } else {
      ctx.lineTo(oldX, bot);
      ctx.lineTo(startX, bot);
    }
    ctx.fill();

    ctx.restore();
  }
}

export default Area;
