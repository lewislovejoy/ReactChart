import { getPlotter, rgbToHex } from './utils';

class Heatmap {
  constructor(d, patternX, patternY, patternVal, otherProps) {
    this.d = d;
    this.patternX = patternX;
    this.patternY = patternY;
    this.patternVal = patternVal;

    this.minVal = Infinity;
    this.maxVal = -Infinity;
    d.forEach((datum) => {
      const val = datum[patternVal];
      if (val > this.maxVal) {
        this.maxVal = val;
      }
      if (val < this.minVal) {
        this.minVal = val;
      }
    });
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
      w, h, paddingX, paddingLeft, paddingBottom, offsetX, paddingTop = 0, paddingRight = 0
    } = canvasProps;
    let offX = paddingX;
    if (paddingX === undefined) {
      offX = 0;
    }
    offX += offsetX;

    ctx.save();
    ctx.lineWidth = 2;

    const numDivisionsX = Object.keys(getPlotter(this.plotters, this.patternX).getLabels()).length;
    const numDivisionsY = Object.keys(getPlotter(this.plotters, this.patternY).getLabels()).length;

    const offHeatX = ((w - paddingBottom) / numDivisionsX) / 2.0;
    const offHeatY = ((h - paddingLeft) / numDivisionsY) / 2.0;

    this.d.forEach((datum) => {
      const x = getPlotter(this.plotters, this.patternX).valToPixels(datum[this.patternX], 0, 1.0);
      const y = getPlotter(this.plotters, this.patternY).valToPixels(datum[this.patternY], 0, 1.0);

      const val = (datum[this.patternVal] - this.minVal) / (this.maxVal - this.minVal);
      const col = rgbToHex(255.0 * val, 0, 255.0 * (1.0 - val));
      ctx.fillStyle = col; //`${col}5c`;

      // this.min
      ctx.fillRect(paddingLeft + x - offHeatX + 5, h - paddingBottom - y + offHeatY + 7, ((w - paddingLeft) / numDivisionsX), -((h - paddingBottom) / numDivisionsY));
      ctx.strokeStyle = 'white';
      ctx.strokeRect(paddingLeft + x - offHeatX + 5, h - paddingBottom - y + offHeatY + 7, ((w - paddingLeft) / numDivisionsX), -((h - paddingBottom) / numDivisionsY));

      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.font = '18px Arial';
      ctx.fillText(datum[this.patternVal], paddingLeft + x, h - paddingBottom - y + 5);
    });

    ctx.restore();
  }
}

export default Heatmap;
