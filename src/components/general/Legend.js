import StringFormater from '../../utils/StringFormater';
import { getColor, getPlotter } from '../../utils/ChartUtils';

class Legend {
  constructor(otherProps) {
    this.otherProps = otherProps;
  }

  setPlotters(plotters) {
    this.plotters = plotters;
  }

  getWidth() {
    return 0;
  }

  mouseMove() {
    return {};
  }

  render(ctx, frameCount, canvasProps, hover) {
    this.canvasProps = canvasProps;
    const {
      w, h
    } = canvasProps;
    const {
      location = 'left-top', background, border, data, width = 100, colorScheme
    } = this.otherProps;

    const isLabelledLegend = (typeof data === 'string' || data instanceof String);
    const plotter = isLabelledLegend && getPlotter(this.plotters, data);

    const height = isLabelledLegend
      ? ((plotter?.getLabels()?.length || 1) * 15) + 5
      : (data.length * 15) + 5;

    ctx.save();

    ctx.beginPath();
    ctx.font = '10px Arial';

    let xOffset = 0;
    let yOffset = 0;

    if (location.indexOf('left-') < 0) {
      xOffset = w - width;
    }
    if (location.indexOf('-top') < 0) {
      yOffset = h - height;
    }

    ctx.textAlign = 'left';

    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(xOffset, yOffset, width, height);
      ctx.fill();
    }
    if (border) {
      ctx.strokeStyle = border;
      ctx.strokeRect(xOffset, yOffset, width, height);
      ctx.stroke();
    }

    if (isLabelledLegend) {
      if (plotter && plotter.getLabels()) {
        plotter.getLabels().forEach((label, i) => {
          ctx.fillStyle = getColor(null, null, colorScheme, i);
          ctx.fillRect(xOffset + 10, yOffset + 5 + (i * 15), 10, 10);
          ctx.fillStyle = 'black';
          ctx.fillText(label, xOffset + 23, yOffset + 13 + (i * 15));
        });
      }
    } else if (data?.forEach) {
      data.forEach(({
        key,
        name,
        color,
        format
      }, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(xOffset + 10, yOffset + 5 + (i * 15), 10, 10);
        ctx.fillStyle = 'black';

        if (hover && hover.datum?.[key]) {
          ctx.fillText(`${name}: ${format ? StringFormater(format)(hover.datum?.[key]) : hover.datum?.[key]}`, xOffset + 23, yOffset + 13 + (i * 15));
        } else {
          ctx.fillText(name, xOffset + 23, yOffset + 13 + (i * 15));
        }
      });
    }

    ctx.stroke();

    ctx.restore();
  }
}

export default Legend;
