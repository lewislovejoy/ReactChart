const toCart = (deg, r) => ({
  x: r * Math.cos(deg),
  y: r * Math.sin(deg)
});

function getMin(patterns, scale) {
  let { min } = scale[patterns[0]];
  patterns.forEach((pat) => {
    if (scale[pat].min < min) {
      min = scale[pat].min;
    }
  });
  return min;
}

function getMax(patterns, scale) {
  let { max } = scale[patterns[0]];
  patterns.forEach((pat) => {
    if (scale[pat].max > max) {
      max = scale[pat].max;
    }
  });
  return max;
}
class Axis {
  constructor(side, data, label, tickFormat, otherProps) {
    this.dataType = otherProps.dataType;
    this.data = data;
    this.side = side;
    this.label = label;
    this.patterns = otherProps.patterns;
    this.showGrid = otherProps.showGrid;
    this.hideTicks = otherProps.hideTicks;
    this.hidden = otherProps.hidden;
  }

  setPlotters(plotters) {
    this.plotters = plotters;
  }

  mouseMove() {
    return {};
  }

  renderRadius(ctx, frameCount, canvasProps, isRight) {
    if (this.hidden) {
      return;
    }
    const {
      w, h
    } = canvasProps;
    const r = Math.min(w, h) - 30;
    const offX = (w - r) / 2;
    const offY = (h - r) / 2;

    if (r < 0) {
      return;
    }

    ctx.lineWidth = 2;
    ctx.moveTo(offX + (r / 2), offY + (r / 2));
    ctx.lineTo(offX + r + 20, offY + (r / 2));
    ctx.stroke();

    ctx.lineWidth = 0.5;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    if (!this.hideTicks) {
      const plotter = this.plotters[this.patterns[0]];
      const bestStep = 30;
      for (let i = plotter.roundedMinMax.min; i < plotter.roundedMinMax.max + bestStep; i += bestStep) {
        const val = plotter.valToPixelsRadial(i);
        const x = offX + (r / 2) + val;
        ctx.fillStyle = '#455a64';
        ctx.moveTo(x, offY + (r/2));
        ctx.lineTo(x, offY + (r/2) + 10);
        ctx.stroke();
        ctx.fillText(`${Math.round(i)}`, x, offY + (r/2) + 20);

        if (this.showGrid) {
          ctx.setLineDash([5, 5]);
          ctx.arc(offX + (r/2), offY + (r/2), val, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }
  }

  renderAngle(ctx, frameCount, canvasProps, isTop) {
    if (this.hidden) {
      return;
    }
    const {
      w, h
    } = canvasProps;
    const r = Math.min(w,h) - 30;
    const offX = (w-r) / 2;
    const offY = (h-r) / 2;

    ctx.lineWidth = 0.5;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    if (!this.hideTicks) {
      const plotter = this.plotters[this.patterns[0]];
      if (this.dataType === 'linear') {
        const bestStep = 30;
        for (let i = plotter.roundedMinMax.min; i < plotter.roundedMinMax.max + bestStep; i += bestStep) {
          const y = plotter.valToPixelsRadial(i);
          const p = toCart((Math.PI * 2 * y) / 360, r / 2);

          ctx.moveTo(offX + (r / 2), offY + (r / 2));
          ctx.lineTo(offX + (r / 2) + p.x, offY + (r / 2) + p.y);
          ctx.stroke();
        }
      } else if (this.dataType === 'labels') {
        const labels = plotter.getLabels();
        const numDivisions = labels.length;
        for (let j = 0; j < numDivisions; j += 1) {
          ctx.fillStyle = '#455a64';
          const p = toCart((Math.PI * 2 * (j / numDivisions)), r / 2);
          ctx.lineWidth = 2;
          ctx.moveTo(offX + (r / 2), offY + (r / 2));
          ctx.lineTo(offX + (r / 2) + p.x, offY + (r / 2) + p.y);
          ctx.stroke();
          const p2 = toCart((Math.PI * 2 * (j / numDivisions)), 10 + (r / 2));

          ctx.save();
          ctx.translate(offX + (r / 2) + p2.x, offY + (r / 2) + p2.y);
          ctx.rotate((Math.PI * 2 * (j / numDivisions)) + (Math.PI / 2));
          ctx.textAlign = 'center';
          ctx.fillText(labels[j], 0, 0);
          ctx.restore();
        }
      }
    }
  }

  render(ctx, frameCount, canvasProps) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#455a64';
    if (this.side === 'radius') {
      this.renderRadius(ctx, frameCount, canvasProps, this.side === 'right');
    } else {
      this.renderAngle(ctx, frameCount, canvasProps, this.side === 'top');
    }
    ctx.restore();
  }
}

export default Axis;
