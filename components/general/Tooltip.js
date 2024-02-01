import StringFormater from '../../utils/StringFormater';

class Tooltip {
  constructor(otherProps) {
    this.isVertical = otherProps.isVertical;
    this.isSelectable = otherProps.isSelectable;
    this.data = otherProps.data;
    this.width = otherProps.width;
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

  render(ctx, frameCount, canvasProps, hover, clicked) {
    ctx.save();
    ctx.beginPath();
    let {
      datum, x, y
    } = hover || {};

    if (this.isSelectable && clicked) {
      ctx.fillStyle = '#6271eb50';
      ctx.fillRect(clicked.x - 10, 0, 20, canvasProps.h - canvasProps.paddingBottom);
    }

    if (this.isSelectable && hover) {
      ctx.fillStyle = '#6271eb20';
      ctx.fillRect(hover.x - 10, 0, 20, canvasProps.h - canvasProps.paddingBottom);
    }

    if (hover && this.data?.length) {
      let startY = y - this.data.length * 15;

      if (startY < 6) {
        startY = 6;
      }
      if (x > (canvasProps.w - (this.width || 100))) {
        x = canvasProps.w - (this.width || 100);
      }

      ctx.lineWidth = 1;
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.fillRect(x - 5, startY - 5, this.width || 100, 5 + this.data.length * 15);
      ctx.strokeRect(x - 5, startY - 5, this.width || 100, 5 + this.data.length * 15);
      ctx.stroke();
      ctx.fill();
      ctx.fillStyle = 'black';

      this.data.forEach(({ key, name, color, format }, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, startY + (i * 15), 10, 10);
        ctx.fillStyle = 'black';
        let d = datum?.[key];
        if (format) {
          d = StringFormater(format)(d);
        }
        ctx.fillText(`${name}: ${d}`, x + 12, 10 + startY + (i * 15));
      });
    }

    ctx.restore();
  }
}

export default Tooltip;
