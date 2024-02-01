import {
  getColor, animateFC, getPlotter
} from '../../utils/ChartUtils';
import {
  clip, getBarMaxWidth, getBarActualWidth
} from './utils';

class Bar {
  constructor(d, patternX, patternY, otherProps) {
    this.d = d;
    this.patternX = patternX;
    this.patternY = patternY;
    this.width = otherProps.width || 10;
    this.color = otherProps.color || '#6271eb';
    this.disableInteractions = otherProps.disableInteractions;
    this.colorScheme = otherProps.colorScheme;
    this.isHorizontal = otherProps.isHorizontal;

    if (!otherProps.barAlign || otherProps.barAlign === 'center') {
      this.barAlign = -0.5;
    } else if (otherProps.barAlign === 'right') {
      this.barAlign = 0.5;
    } else {
      this.barAlign = 0;
    }

    this.disableOutline = otherProps.disableOutline;
  }

  getWidth(canvasProps) {
    if (this.isHorizontal) {
      return getBarActualWidth(this.width, this.d.length, canvasProps.h - canvasProps.paddingBottom - canvasProps.paddingTop);
    }
    return getBarActualWidth(this.width, this.d.length, canvasProps.w - canvasProps.paddingLeft - canvasProps.paddingRight);
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
    const barWidth = this.getWidth(this.canvasProps);

    let selected;
    let hover;
    this.d.forEach((datum) => {

      //const y = getPlotter(this.plotters, this.patternY).valToPixels(datum[this.patternY]);

      if (this.isHorizontal) {
        const y = bot - getPlotter(this.plotters, this.patternX).valToPixels(datum[this.patternX]) - barWidth + paddingX;
        const item = {
          datum,
          patternY: this.patternY,
          patternX: this.patternX,
          x: xLoc,
          y
        };
        if (yLoc > (y - 10) && yLoc < (y + barWidth)) {
          if (isClick) {
            selected = item;
          }
          hover = item;
        }
      } else {
        const x = paddingX + paddingLeft + getPlotter(this.plotters, this.patternX).valToPixels(datum[this.patternX]);
        const item = {
          datum,
          patternY: this.patternY,
          patternX: this.patternX,
          x,
          y: yLoc
        };
        if (xLoc > (x - 10) && xLoc < (x + barWidth) /*&& yLoc < ((bot - y) + 10)*/) {
          if (isClick) {
            selected = item;
          }
          hover = item;
        }
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
    const barWidth = this.getWidth(canvasProps);

    ctx.save();
    ctx.lineWidth = 2;

    // clip(ctx, canvasProps);

    const bot = paddingY + h - paddingBottom;
    const plotter = getPlotter(this.plotters, this.patternX);
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
      ctx.fillStyle = this.disableOutline ? ctx.strokeStyle : `${ctx.strokeStyle}5c`;
      if (hover?.datum === datum) {
        ctx.strokeStyle = '#000000';
      }

      const x = plotter.valToPixels(
        datum[this.patternX],
        canvasProps?.scrollX,
        canvasProps?.scaleX
      ) + (this.barAlign * barWidth);
      const y = getPlotter(this.plotters, this.patternY).valToPixels(datum[this.patternY]);

      // todo: * frameCount/50

      if (x !== undefined) {
        let groupOffsetY = 0;
        if (groupStart) {
          groupStart.forEach((pat) => {
            const newYval = getPlotter(this.plotters, pat).valToPixels(datum[pat]);
            groupOffsetY += (newYval);
          });
        }

        const y2 = animateFC(frameCount, y);
        if (this.isHorizontal) {
          ctx.fillRect(paddingLeft + groupOffsetY, bot - x - barWidth + paddingX, y2, barWidth);
          if (!this.disableOutline || hover?.datum === datum) {
            ctx.strokeRect(paddingLeft + groupOffsetY, bot - x - barWidth + paddingX, y2, barWidth);
          }
        } else {
          ctx.fillRect(paddingX + paddingLeft + x, bot - y2 - groupOffsetY, barWidth, y2);
          if (!this.disableOutline || hover?.datum === datum) {
            ctx.strokeRect(paddingX + paddingLeft + x, bot - y2 - groupOffsetY, barWidth, y2);
          }
        }
      }
    });

    ctx.restore();
  }
}

export default Bar;
