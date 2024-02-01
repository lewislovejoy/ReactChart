import { getColor } from "../../utils/ChartUtils";
import { toCart } from './utils';

class Pie {
  constructor(d, patternX, patternY, otherProps) {
    this.d = d;
    this.patternY = patternY;
    this.patternX = patternX;
    this.labels = {};
    this.radius = otherProps.radius || 1.0;
    this.color = otherProps.color || '#6271eb';
    this.disableInteractions = otherProps.disableInteractions;

    this.colorScheme = otherProps.colorScheme;
    this.innerRadius = otherProps.innerRadius || 0.0;
    this.labelRadius = otherProps.labelRadius || 0.5;

    this.min = 0;
    this.max = 0;
    this.d.forEach((datum) => {
      this.max += datum[this.patternY];
    });
  }

  setPlotters(plotters) {
    this.plotters = plotters;
  }

  mouseMove() {
    return {};
  }

  render(ctx, frameCount, canvasProps, hover, clicked) {
    this.canvasProps = canvasProps;
    const {
      w, h
    } = canvasProps;
    const r = Math.min(w, h) - 30;
    const r2 = r / 2.0;
    const offX = (w - r) / 2;
    const offY = (h - r) / 2;

    if (r < 0) {
      return;
    }

    ctx.save();
    ctx.lineWidth = 2;

    let lastEnd = 0;
    this.d.forEach((datum, i) => {
      if (clicked?.datum === datum) {
        ctx.fillStyle = '#6271eb';
        ctx.strokeStyle = '#172fe8';

        // offX = 20;
        // offY = 20;
        // todo: move in direction of 'selected'
      } else if (hover?.datum === datum) {
        ctx.fillStyle = '#ff00005c';
        ctx.strokeStyle = 'red';
      } else {
        ctx.strokeStyle = getColor(datum.color, this.color, this.colorScheme, i);
        ctx.fillStyle = `${ctx.strokeStyle}ac`;
      }

      const dVal = (datum[this.patternY] * 360) / this.max;
      ctx.beginPath();
      ctx.moveTo(offX + r2, offY + r2);
      ctx.arc(
        offX + r2, // x
        offY + r2, // y
        ((this.radius * (r / 2.0) * frameCount) / 50), // radius
        Math.PI * 2 * (lastEnd / 360.0), // startingAngle (radians)
        Math.PI * 2 * ((dVal + lastEnd) / 360.0),
        false // antiClockwise (boolean)
      );
      ctx.lineTo(offX + r2, offY + r2);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (this.patternX) {
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        const p = toCart(Math.PI * 2 * ((lastEnd + (dVal / 2)) / 360.0), (r / 2.0) * this.labelRadius);
        ctx.fillText(datum[this.patternX], offX + r2 + p.x, offY + r2 + p.y);
      }

      lastEnd = dVal + lastEnd;
    });

    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.moveTo(offX + r2, offY + r2);
    ctx.arc(
      offX + r2, // x
      offY + r2, // y
      (r2 * this.innerRadius * frameCount) / 50, // radius
      0, // startingAngle (radians)
      Math.PI * 2,
      false // antiClockwise (boolean)
    );
    ctx.lineTo(offX + r2, offY + r2);
    ctx.fill();

    ctx.restore();
  }
}

export default Pie;
