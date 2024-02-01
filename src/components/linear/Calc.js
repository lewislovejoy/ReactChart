import {
  animateFC, getPlotter
} from '../../utils/ChartUtils';
import {
  clip
} from './utils';


const getLine = (currentData, patternX, patternY) => {
  // Least Squares Regression
  const sum = currentData.reduce((acc, pair) => ({
    x: acc.x + pair[patternX],
    y: acc.y + pair[patternY]
  }), { x: 0, y: 0 });

  const average = {
    x: sum.x / currentData.length,
    y: sum.y / currentData.length
  };

  const slopeDividend = currentData
    .reduce((acc, pair) => parseFloat(acc + ((pair[patternX] - average.x) * (pair[patternY] - average.y))), 0);
  const slopeDivisor = currentData
    .reduce((acc, pair) => parseFloat(acc + (pair[patternX] - average.x) ** 2), 0);

  const slope = slopeDivisor !== 0
    ? parseFloat((slopeDividend / slopeDivisor).toFixed(2))
    : 0;

  const coeficient = parseFloat(
    (-(slope * average.x) + average.y).toFixed(2)
  );

  return { slope, coeficient }

  // todo: plot `Formula: y = ${coeficient} + ${slope} * x`
}

class Calc {
  constructor(d, patternX, patternY, otherProps) {
    this.d = d;
    this.patternX = patternX;
    this.patternY = patternY;
    this.color = otherProps.color || '#6271eb';
    this.calc = otherProps.calc;

    // calc === 'ls-best-fit'

    this.line = getLine(d, patternX, patternY);
  }

  getWidth() {
    return 0;
  }

  setPlotters(plotters) {
    this.plotters = plotters;
  }

  mouseMove() {
    return {};
  }

  render(ctx, frameCount, canvasProps) {
    this.canvasProps = canvasProps;
    const {
      h, paddingBottom, paddingLeft, offsetY = 0, paddingX = 0, groupStart
    } = canvasProps;
    const paddingY = offsetY || 0;

    ctx.save();
    ctx.lineWidth = 2;
    let oldX;
    let oldY;

    clip(ctx, canvasProps);

    const bot = paddingY + h - paddingBottom;
    this.d.forEach((datum, i) => {
      ctx.fillStyle = `${datum.color || this.color}5c`;
      ctx.strokeStyle = datum.color || this.color;

      const xDatum = datum[this.patternX];
      const x = getPlotter(this.plotters, this.patternX).valToPixels(
        xDatum,
        canvasProps?.scrollX,
        canvasProps?.scaleX
      );
      const y = getPlotter(this.plotters, this.patternY).valToPixels(
        this.line.coeficient + (this.line.slope * xDatum)
      );

      const y2 = animateFC(frameCount, y);
      if (x !== undefined) {
        if (i !== 0) {
          ctx.beginPath();
          ctx.moveTo(oldX, oldY);
          ctx.lineTo(paddingX + paddingLeft + x, bot - y2);
          ctx.stroke();
        }

        oldX = paddingX + paddingLeft + x;
        oldY = bot - y2;
      }
    });

    ctx.restore();
  }
}

export default Calc;
