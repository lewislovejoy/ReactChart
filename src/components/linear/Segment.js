import {
  getPlotter
} from '../../utils/ChartUtils';

class Segment {
  constructor(d, patternX, patternY, otherProps) {
    this.d = d;
    this.patternX = patternX;
    this.patternY = patternY;
    this.size = otherProps.size;
    this.isHorizontal = otherProps.isHorizontal;

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
      h, w, paddingBottom, paddingLeft, paddingX = 0
    } = canvasProps;

    ctx.save();
    ctx.lineWidth = this.size || 2;

    this.d.forEach((datum) => {
      ctx.fillStyle = `${datum.color || this.color}5c`;
      ctx.strokeStyle = datum.color || this.color;

      if (datum[this.patternY]) {
        if (!this.isHorizontal) {
          const x = getPlotter(this.plotters, this.patternX)
            .valToPixels(datum[this.patternX]);
          ctx.beginPath();
          ctx.moveTo(paddingX + paddingLeft + x, 0);
          ctx.lineTo(paddingX + paddingLeft + x, h - paddingBottom);
          ctx.stroke();
        }
        else {
          const y = getPlotter(this.plotters, this.patternX)
            .valToPixels(datum[this.patternX]);
          ctx.beginPath();
          ctx.moveTo(paddingX + paddingLeft, h - paddingBottom - y);
          ctx.lineTo(paddingX + paddingLeft + w, h - paddingBottom - y);
          ctx.stroke();
        }
      }
    });

    ctx.restore();
  }
}

export default Segment;
