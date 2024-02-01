import {
  animateFC
} from '../../utils/ChartUtils';
import { toCart } from './utils';

class Scatter {
  constructor(d, patternX, patternY, otherProps) {
    this.d = d;
    this.patternX = patternX;
    this.patternY = patternY;
    this.labels = {};
    this.width = otherProps.width || 10;
    this.color = otherProps.color || '#6271eb';
  }

  getWidth() {
    return this.width;
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
      w, h
    } = canvasProps;
    const r = Math.min(w, h) - 20;
    const offX = (w - r) / 2;
    const offY = (h - r) / 2;

    if (r < 0) {
      return;
    }

    ctx.save();

    ctx.lineWidth = 2;

    this.d.forEach((datum) => {
      ctx.fillStyle = `${this.color}5c`;
      ctx.strokeStyle = this.color;

      const x = this.plotters[this.patternX].valToPixelsRadial(datum[this.patternX]);
      const y = this.plotters[this.patternY].valToPixelsRadial(datum[this.patternY]);

      const y2 = animateFC(frameCount, y);
      const p = toCart((Math.PI * 2 * x) / 360.0, y2);
      ctx.beginPath();
      ctx.arc(offX + (r / 2) + p.x, offY + (r / 2) + p.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });

    ctx.restore();
  }
}

export default Scatter;
