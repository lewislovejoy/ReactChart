import StringFormater from '../../utils/StringFormater';
import { rgbToHex } from './utils';

class Gauge {
  constructor(d, patternX, min, max, otherProps) {
    this.d = d;
    this.patternX = patternX;
    this.min = min;
    this.max = max;

    this.nrLevels = otherProps.nrLevels;
    this.arcPadding = otherProps.arcPadding || 0;
    this.arcWidth = otherProps.arcWidth;

    this.reverseColorScale = otherProps.reverseColorScale;
    this.hideText = otherProps.hideText;
    if (otherProps.textFormat && StringFormater(otherProps.textFormat)) {
      this.textFormat = StringFormater(otherProps.textFormat);
    }
  }

  getWidth() {
    return 0;
  }

  setPlotters() {
  }

  mouseMove() {
    return {};
  }

  render(ctx, frameCount, canvasProps) {
    this.canvasProps = canvasProps;
    const {
      w, h, paddingBottom
    } = canvasProps;
    const r = Math.min(w, h - paddingBottom) - 20;
    const r2 = r / 2;
    const offX = (w - r) / 2;
    const offY = (h - r - paddingBottom) / 2;

    if (r < 0) {
      return;
    }

    ctx.save();
    ctx.lineWidth = 2;

    const steps = this.nrLevels || 20.0;
    // this.arcPadding
    // this.arcWidth

    const incRad = Math.PI / steps;
    const gap = incRad * (this.arcPadding / 2.0);
    for (let x = 0; x < steps; x += 1) {
      let c = x;
      if (this.reverseColorScale) {
        c = steps - x;
      }
      ctx.fillStyle = rgbToHex(
        Math.min(255, (2 * (255.0 * c)) / steps),
        Math.min(255, 2 * (255 * (1.0 - (c / steps)))),
        0
      );
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 5;

      const rad = Math.PI + ((Math.PI * x) / steps);

      ctx.beginPath();
      ctx.moveTo(offX + r2, h - paddingBottom);
      ctx.arc(offX + r2, h - paddingBottom, r, rad + gap, rad + incRad - gap);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.moveTo(offX + r2, h - paddingBottom);
    ctx.arc(offX + r2, h - paddingBottom, r - (this.arcWidth || 30), 0, 2 * Math.PI);
    ctx.fill();

    const val = this.patternX ? (this.d?.[this.patternX] || this.d?.[0]?.[this.patternX] || 0) : this.d;

    ctx.textAlign = 'center';
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = 'black';

    if (!this.hideText) {
      if (this.textFormat) {
        ctx.fillText(this.textFormat(val), offX + r2, 20 + (h / 2));
      } else {
        ctx.fillText(val, offX + r2, 20 + (h / 2));
      }
    }

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.moveTo(offX + r2, h - paddingBottom);
    ctx.arc(offX + r2, h - paddingBottom, 10, 0, 2 * Math.PI);
    ctx.fill();

    const percent = ((val - this.min) / (this.max - this.min)) * (frameCount / 50.0);
    // rotate dial
    ctx.translate(offX + r2, h - paddingBottom);
    ctx.rotate((percent * Math.PI) - Math.PI / 2);
    ctx.translate(-(offX + r2), -(h - paddingBottom));

    ctx.beginPath();
    ctx.fillStyle = '#000000A0';
    ctx.moveTo(offX + r2 - 10, h - paddingBottom);
    ctx.lineTo(offX + r2, 60);
    ctx.lineTo(offX + r2 + 10, h - paddingBottom);
    ctx.fill();

    ctx.restore();
  }
}

export default Gauge;
