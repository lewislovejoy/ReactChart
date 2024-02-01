import {
  getColor, animateFC, getPlotter
} from '../../utils/ChartUtils';

class Funnel {
  constructor(d, patternX, patternY, otherProps) {
    this.d = d;
    this.patternX = patternX;
    this.patternY = patternY;
    this.width = otherProps.width || 10;
    this.color = otherProps.color || '#6271eb';
    this.disableInteractions = otherProps.disableInteractions;
    this.colorScheme = otherProps.colorScheme;
    this.isHorizontal = otherProps.isHorizontal;
  }

  getWidth() {
    return this.width;
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

  render(ctx, frameCount, canvasProps, hover, clicked) {
    this.canvasProps = canvasProps;
    const {
      h, paddingBottom, paddingLeft, offsetY = 0, paddingX = 0, groupStart
    } = canvasProps;
    const paddingY = offsetY || 0;

    ctx.save();
    ctx.lineWidth = 2;

    // clip(ctx, canvasProps);

    const bot = paddingY + h - paddingBottom;
    const plotter = getPlotter(this.plotters, this.patternX);

    let oldX1;
    let oldX2;
    let oldY;
    this.d.forEach((datum, i) => {
      if (clicked?.datum === datum) {
        ctx.strokeStyle = '#172fe8';
      } else {
        if (canvasProps.colorScheme) {
          ctx.strokeStyle = getColor(datum.color, this.color, canvasProps.colorScheme, canvasProps.colorSchemeId);
        } else {
          ctx.strokeStyle = getColor(datum.color, this.color, this.colorScheme, i);
        }
      }
      ctx.fillStyle = `${ctx.strokeStyle}5c`;
      if (hover?.datum === datum) {
        ctx.strokeStyle = '#000000';
      }

      const x1 = plotter.valToPixels(-datum[this.patternX]);
      const x2 = plotter.valToPixels(datum[this.patternX]);
      const y = getPlotter(this.plotters, this.patternY).valToPixels(datum[this.patternY]);

      // todo: * frameCount/50


      // const y = animateFC(frameCount, y);
      if (i !== 0) {
        // todo: plot Isosceles Trapezoid
        //ctx.fillRect(paddingX + paddingLeft + x, bot - y2b, this.width, y2b);
        //ctx.strokeRect(paddingX + paddingLeft + x, bot - y2b, this.width, y2b);
        ctx.beginPath();
        ctx.moveTo(paddingLeft + x1, bot - y);
        ctx.lineTo(paddingLeft + x2, bot - y);
        ctx.lineTo(paddingLeft + oldX2, bot - oldY);
        ctx.lineTo(paddingLeft + oldX1, bot - oldY);
        ctx.lineTo(paddingLeft + x1, bot - y);
        ctx.stroke();
        ctx.fill();
      }

      oldX1 = x1;
      oldX2 = x2;
      oldY = y;
    });

    ctx.restore();
  }
}

export default Funnel;
