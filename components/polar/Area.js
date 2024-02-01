import {
  animateFC,
} from '../../utils/ChartUtils';

/*
const toPolar = (x,y) => ({
  r: Math.sqrt((x * x) + (y * y)),
  deg: Math.atan(y / x)
}); */

const toCart = (deg, r) => ({
  x: r * Math.cos(deg),
  y: r * Math.sin(deg)
});

class Area {
  constructor(d, patternX, patternY, otherProps) {
    this.d = d;
    this.patternX = patternX;
    this.patternY = patternY;
    this.width = otherProps.width || 10;
    this.color = otherProps.color || '#6271eb';
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
      w, h
    } = canvasProps;
    const r = Math.min(w, h) - 30;
    const offX = (w - r) / 2;
    const offY = (h - r) / 2;

    if (r < 0) {
      return;
    }

    ctx.save();
    ctx.lineWidth = 2;
    ctx.fillStyle = this.color;


    ctx.beginPath();
    this.d.forEach((datum) => {
      ctx.fillStyle = `${this.color}5c`;
      ctx.strokeStyle = this.color;

      const x = this.plotters[this.patternX].valToPixelsRadial(datum[this.patternX]);
      const y = this.plotters[this.patternY].valToPixelsRadial(datum[this.patternY]);

      const y2 = animateFC(frameCount, y);
      const p = toCart((Math.PI * 2 * x) / 360.0, y2);
      ctx.lineTo(offX + (r / 2) + p.x, offY + (r / 2) + p.y);
    });

    const dataVal = (this.d[0][this.patternY] * frameCount) / 50;
    const p = toCart(0, animateFC(frameCount, this.plotters[this.patternX].valToPixelsRadial(dataVal)));
    ctx.lineTo(offX + (r / 2) + p.x, offY + (r / 2) + p.y);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

export default Area;
