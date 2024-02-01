import {
  animateFC, getPlotter
} from '../../utils/ChartUtils';
import {
  clip
} from './utils';

class Scatter {
  constructor(d, patternX, patternY, otherProps) {
    this.d = d;
    this.patternX = patternX;
    this.patternY = patternY;
    this.patternSize = otherProps.patternSize;
    this.size = otherProps.size || 4;
    this.color = otherProps.color || '#6271eb';
    this.isHorizontal = otherProps.isHorizontal;
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
      const x = paddingX + paddingLeft + getPlotter(this.plotters, this.patternX).valToPixels(
        datum[this.patternX],
        this.canvasProps?.scrollX,
        this.canvasProps?.scaleX
      );
      const y = getPlotter(this.plotters, this.patternY).valToPixels(datum[this.patternY]);

      if (xLoc > (x - 10) && xLoc < (x + 10) && yLoc > ((bot - y) - 10) && yLoc < ((bot - y) + 10)) {
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

  render(ctx, frameCount, canvasProps, hover, selected) {
    this.canvasProps = canvasProps;
    const {
      h, paddingBottom, paddingLeft, offsetY = 0, paddingX = 0, groupStart
    } = canvasProps;
    const paddingY = offsetY || 0;

    ctx.save();

    ctx.lineWidth = 2;
    clip(ctx, canvasProps);

    const bot = paddingY + h - paddingBottom;
    this.d.forEach((datum) => {
      ctx.fillStyle = `${datum.color || this.color}5c`;
      ctx.strokeStyle = datum.color || this.color;

      const x = getPlotter(this.plotters, this.patternX).valToPixels(datum[this.patternX]);
      const y = getPlotter(this.plotters, this.patternY).valToPixels(datum[this.patternY]);

      const s = datum[this.patternSize] || this.size;

      const y2 = animateFC(frameCount, y);
      ctx.beginPath();
      if (this.isHorizontal) {
        ctx.arc(paddingX + paddingLeft + y2, bot - x, s, 0, 2 * Math.PI);
      } else {
        ctx.arc(paddingX + paddingLeft + x, bot - y2, s, 0, 2 * Math.PI);
      }
      ctx.stroke();
      ctx.fill();

      if (hover && hover?.patternY === this.patternY && hover.datum === datum) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        if (this.isHorizontal) {
          ctx.arc(paddingX + paddingLeft + y2, bot - x, 8, 0, 2 * Math.PI);
        } else {
          ctx.arc(paddingX + paddingLeft + x, bot - y2, 8, 0, 2 * Math.PI);
        }
        ctx.stroke();
      }

      if (selected && selected?.patternY === this.patternY && selected.datum === datum) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        if (this.isHorizontal) {
          ctx.arc(paddingX + paddingLeft + y2, bot - x, 8, 0, 2 * Math.PI);
        } else {
          ctx.arc(paddingX + paddingLeft + x, bot - y2, 8, 0, 2 * Math.PI);
        }
        ctx.stroke();
      }
    });

    ctx.restore();
  }
}

export default Scatter;
