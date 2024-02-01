import { getColor } from "../../utils/ChartUtils";

class Bar {
  constructor(d, patternX, patternY, otherProps) {
    this.d = [...d].reverse();
    this.patternX = patternX;
    this.patternY = patternY;
    this.labels = {};
    this.width = otherProps.width || 1.0;
    this.color = otherProps.color || '#6271eb';

    this.colorScheme = otherProps.colorScheme;
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
    const startRad = (3 * Math.PI) / 2;

    // todo: sort data in small to large
    this.d.forEach((datum) => {
      ctx.fillStyle = `${this.color}5c`;
      ctx.strokeStyle = this.color;

      const x = this.plotters[this.patternX].valToPixelsRadial(datum[this.patternX]);
      const y = this.plotters[this.patternY].valToPixelsRadial(datum[this.patternY]);

      const endRot = startRad + (Math.PI * 2 * (((y * frameCount) / 50) / 450.0));

      ctx.beginPath();
      ctx.moveTo(offX + (r / 2), offY + (r / 2));
      ctx.arc(
        offX + (r / 2), // x
        offY + (r / 2), // y
        x, // radius
        startRad, // -Math.PI / 2.0, // startingAngle (radians)
        endRot,
        false // antiClockwise (boolean)
      );
      ctx.lineTo(offX + (r / 2), offY + (r / 2));
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(offX + (r / 2), offY + (r / 2));
      ctx.arc(
        offX + (r / 2), // x
        offY + (r / 2), // y
        x + this.width, // radius
        startRad, // -Math.PI / 2.0, // startingAngle (radians)
        endRot,
        false // antiClockwise (boolean)
      );
      ctx.lineTo(offX + (r / 2), offY + (r / 2));
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(
        offX + (r / 2), // x
        offY + (r / 2), // y
        x, // radius
        startRad, // -Math.PI / 2.0, // startingAngle (radians)
        endRot,
        false // antiClockwise (boolean)
      );
      ctx.stroke();

      if ((x - 5) > 0) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.moveTo(offX + (r / 2), offY + (r / 2));
        ctx.arc(
          offX + (r / 2), // x
          offY + (r / 2), // y
          x - 1, // radius
          0, // startingAngle (radians)
          Math.PI * 2,
          false // antiClockwise (boolean)
        );
        ctx.lineTo(offX + (r / 2), offY + (r / 2));
        ctx.fill();
      }
    });

    const plotter = this.plotters[this.patternX];
    this.d.forEach((datum, i) => {
      const xVal = datum[this.patternX];

      ctx.strokeStyle = getColor(datum.color, this.color, this.colorScheme, i);
      ctx.fillStyle = `${ctx.strokeStyle}5c`;

      const x = plotter.valToPixelsRadial(datum[this.patternX]);

      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${xVal}`, offX + (r / 2) - 5, (r / 2) - x + 15);
    });

    ctx.restore();
  }
}

export default Bar;
