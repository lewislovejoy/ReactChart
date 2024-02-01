import {
  animateFC, getPlotter
} from '../../utils/ChartUtils';
import {
  clip
} from './utils';

class Band {
  constructor(d, patternX, patternYmin, patternYmax, otherProps) {
    this.d = d;
    this.patternX = patternX;
    this.patternYmin = patternYmin;
    this.patternYmax = patternYmax;
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

  plot(datum, canvasProps, frameCount, i, bot, ctx, paddingX, paddingLeft, oldX, patternY, isFirst, offset) {
    let startX;
    let startY;
    const x = getPlotter(this.plotters, this.patternX)
      .valToPixels(
        datum[this.patternX],
        canvasProps?.scrollX,
        canvasProps?.scaleX
      );
    const y = getPlotter(this.plotters, patternY)
      .valToPixels(datum[patternY]);

    const y2 = animateFC(frameCount, y);
    if (this.isHorizontal) {
      if (isFirst) {
        startX = paddingX + paddingLeft + y2;
        startY = bot - x;
        ctx.moveTo(paddingX + paddingLeft + y2, bot - x);
      } else {
        if (this.isSmooth) {
          const pDatum = this.d[i + offset];
          const yP = getPlotter(this.plotters, patternY)
            .valToPixels(pDatum[patternY]);
          const xP = getPlotter(this.plotters, this.patternX)
            .valToPixels(
              pDatum[this.patternX],
              canvasProps?.scrollX,
              canvasProps?.scaleX
            );
          const yP2 = animateFC(frameCount, yP);
          const pointPrev = {
            x: paddingX + paddingLeft + yP2,
            y: bot - xP
          };
          const point = {
            x: paddingX + paddingLeft + y2,
            y: bot - x
          };
          const xMid = (pointPrev.x + point.x) / 2;
          const yMid = (pointPrev.y + point.y) / 2;
          const cpX1 = (xMid + pointPrev.x) / 2;
          const cpX2 = (xMid + point.x) / 2;
          ctx.quadraticCurveTo(cpX1, pointPrev.y, xMid, yMid);
          ctx.quadraticCurveTo(cpX2, point.y, point.x, point.y);
        } else {
          ctx.lineTo(paddingX + paddingLeft + y2, bot - x);
        }
      }
      oldX = bot - x;
    } else {
      if (isFirst) {
        startX = paddingX + paddingLeft + x;
        startY = bot - y2;
        ctx.lineTo(paddingX + paddingLeft + x, bot - y2);
      } else {
        if (this.isSmooth && i > 0) {
          const pDatum = this.d[i + offset];
          const yP = getPlotter(this.plotters, patternY)
            .valToPixels(pDatum[patternY]);
          const xP = getPlotter(this.plotters, this.patternX)
            .valToPixels(
              pDatum[this.patternX],
              canvasProps?.scrollX,
              canvasProps?.scaleX
            );
          const yP2 = animateFC(frameCount, yP);
          const pointPrev = {
            x: paddingX + paddingLeft + xP,
            y: bot - yP2
          };
          const point = {
            x: paddingX + paddingLeft + x,
            y: bot - y2
          };
          const xMid = (pointPrev.x + point.x) / 2;
          const yMid = (pointPrev.y + point.y) / 2;
          const cpX1 = (xMid + pointPrev.x) / 2;
          const cpX2 = (xMid + point.x) / 2;
          ctx.quadraticCurveTo(cpX1, pointPrev.y, xMid, yMid);
          ctx.quadraticCurveTo(cpX2, point.y, point.x, point.y);
        } else {
          ctx.lineTo(paddingX + paddingLeft + x, bot - y2);
        }
      }

      oldX = paddingX + paddingLeft + x;
    }
    return {
      startX,
      startY,
      oldX
    };
  }

  mouseMove(xLoc, yLoc, isClick, button) {
  }

  render(ctx, frameCount, canvasProps) {
    this.canvasProps = canvasProps;
    const {
      h, paddingBottom, paddingLeft, offsetY = 0, paddingX = 0, groupStart
    } = canvasProps;
    const paddingY = offsetY || 0;

    ctx.save();
    ctx.lineWidth = 2;
    let startX = 0;
    let startY = 0;
    let oldX = 0;

    clip(ctx, canvasProps);

    ctx.beginPath();
    const bot = paddingY + h - paddingBottom;
    ctx.fillStyle = `${this.color}5c`;
    ctx.strokeStyle = this.color;

    for (let i = 0; i < this.d.length; i += 1) {
      const datum = this.d[i];
      const ret = this.plot(
        datum,
        canvasProps,
        frameCount,
        i,
        bot,
        ctx,
        paddingX,
        paddingLeft,
        oldX,
        this.patternYmax,
        i === 0,
        -1
      );
      if (i === 0) {
        startX = ret.startX;
        startY = ret.startY;
      }
      oldX = ret.oldX;
    }

    for (let i = this.d.length - 1; i >= 0; i -= 1) {
      const datum = this.d[i];
      const ret = this.plot(
        datum,
        canvasProps,
        frameCount,
        i,
        bot,
        ctx,
        paddingX,
        paddingLeft,
        oldX,
        this.patternYmin,
        i === this.d.length - 1,
        1
      );
      oldX = ret.oldX;
    }

    ctx.lineTo(startX, startY);
    ctx.fill();

    ctx.restore();
  }
}

export default Band;
