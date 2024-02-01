import dayjs from 'dayjs';
import {
  getPlotter
} from '../../utils/ChartUtils';
import StringFormater from "../../utils/StringFormater";


function findBestStep(size, pixels) {
  // todo: make this better - currently its RUBBISH - calc step in abs numbers eg, 1,5,10 etc..

  const x = Math.ceil(Math.log10(size) - 1);
  const pow10x = 10 ** x;

  /*
  if ((pixels / pow10x) > 30) {
    if (Math.round(pixels / (pow10x / 2)) > 30) {
      return pow10x / 5;
    }
    return pow10x / 5;
  }

   */

  return pow10x / 2;
}

function findBestStep2(size, pixels) {
  if (pixels > 1000) {
    return size / 50;
  }
  if (pixels > 300) {
    return size / 20;
  }

  return size / 10;
}

function findBestTime(size, pixels) {
  let step = findBestStep2(size, pixels);
  let stepUnit;
  if (step > (86400000 * 10)) { // days
    step /= 86400000;
    stepUnit = 'day';
  } else if (step > (3600000 * 10)) { // hours
    step /= 3600000;
    stepUnit = 'hour';
  } else if (step > 60000) { //miniutes
    step /= 60000;
    stepUnit = 'minute';
  }

  return {
    step,
    stepUnit
  };
}

const GRID_COLOR = '#dedede';

class Axis {
  constructor(side, data, label, tickFormat, otherProps) {
    this.data = data;
    this.side = side;
    this.label = label;
    this.patterns = otherProps.patterns;
    this.showGrid = otherProps.showGrid;
    this.hideTicks = otherProps.hideTicks;
    this.format = otherProps.format ? StringFormater(otherProps.format) : null;
    this.labelRotation = otherProps.labelRotation;
    this.placeAtZero = otherProps.placeAtZero;
    this.isStack = otherProps.isStack;
    this.hidden = otherProps.hidden;
    this.dataType = otherProps.dataType;
    this.offset = otherProps.offset || 0;
    this.skip = otherProps.skip || 1;
    if (this.dataType === 'date' && !this.format) {
      this.format = StringFormater({ type: 'Date', options: 'YYYY-MM-DD' });
    }
    if (this.dataType === 'datetime' && !this.format) {
      this.format = StringFormater({ type: 'Date', options: 'YYYY-MM-DD HH:mm:ss' });
    }
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

  drawLeftGrid(ctx, w, y, paddingX) {
    if (this.showGrid) {
      ctx.beginPath();
      ctx.strokeStyle = GRID_COLOR;
      ctx.moveTo(w, y);
      ctx.lineTo(paddingX, y);
      ctx.stroke();
    }
  }

  rotatedLabel(ctx, x, paddingY, isTop, l) {
    if (this.labelRotation) {
      ctx.save();
      ctx.translate(x, paddingY + (isTop ? -15 : +15));
      ctx.textAlign = 'left';
      ctx.rotate((this.labelRotation / 360.0) * (2.0 * Math.PI));
      ctx.fillText(this.format ? this.format(l) : l, 0, 0);
      ctx.restore();
    } else {
      ctx.fillText(this.format ? this.format(l) : l, x, paddingY + (isTop ? -15 : +15));
    }
  }

  drawLabel(ctx, label, x, y) {
    ctx.fillText(this.format ? this.format(label) : label, x, y);
  }

  renderLeft(ctx, frameCount, canvasProps, isRight) {
    if (this.hidden) {
      return;
    }
    const {
      w, h,
      paddingLeft, paddingBottom,
      paddingRight, paddingTop,
      offsetX, offsetY
    } = canvasProps;

    let paddingX = isRight ? (w - paddingRight) : paddingLeft;
    paddingX += (offsetX || 0) + this.offset;

    const paddingY = offsetY || 0;

    ctx.lineWidth = 2;
    ctx.moveTo(paddingX, h - paddingBottom + paddingY);
    ctx.lineTo(paddingX, paddingTop + paddingY);
    ctx.stroke();

    ctx.lineWidth = 0.5;
    ctx.font = '10px Arial';
    ctx.textAlign = isRight ? 'left' : 'right';

    if (!this.hideTicks) {
      const plotter = getPlotter(this.plotters, this.patterns[0]);
      const bot = paddingY + h - paddingBottom;

      if (this.dataType === 'date' || this.dataType === 'datetime') {
        const { step, stepUnit } = findBestTime(plotter.roundedMinMax.max - plotter.roundedMinMax.min, h - paddingLeft - paddingRight);

        let currentDate = dayjs(plotter.roundedMinMax.min)
          .add(1, stepUnit);
        const endDate = dayjs(plotter.roundedMinMax.max);
        let last = null;
        while (endDate.diff(currentDate) > 0) {

          const y = paddingY + h - paddingBottom - plotter.valToPixels(currentDate.valueOf());
          ctx.beginPath();
          ctx.strokeStyle = '#455a64';
          ctx.moveTo(paddingX + (isRight ? +5 : -5), y);
          ctx.lineTo(paddingX, y);
          ctx.stroke();
          if (!last || ((y - last) > 100)) {
            // todo: rotate this.labelRotation
            this.drawLabel(ctx, currentDate.valueOf(), paddingX + (isRight ? 7 : -7), y + 3);
            last = y;
          }
          this.drawLeftGrid(ctx, w - paddingRight, y, paddingX);
          currentDate = currentDate.add(step, stepUnit);
        }
      } else if (this.dataType === 'linear' || !this.dataType) {
        const bestStep = findBestStep(plotter.roundedMinMax.max - plotter.roundedMinMax.min, h - paddingLeft - paddingRight);
        for (let i = plotter.roundedMinMax.min; i < plotter.roundedMinMax.max + bestStep; i += bestStep) {
          const y = bot - plotter.valToPixels(i);
          ctx.beginPath();
          ctx.strokeStyle = '#455a64';
          ctx.moveTo(paddingX + (isRight ? +5 : -5), y);
          ctx.lineTo(paddingX, y);
          ctx.stroke();
          // todo: rotate this.labelRotation
          this.drawLabel(ctx, i, paddingX + (isRight ? 7 : -7), y + 3);
          this.drawLeftGrid(ctx, w - paddingRight, y, paddingX);
        }
      } else if (this.dataType === 'labels') {
        const labels = plotter.getLabels();
        for (let i = 0; i < labels.length; i += this.skip) {
          const y = bot - plotter.valToPixels(labels[i]);
          ctx.beginPath();
          ctx.strokeStyle = '#455a64';
          ctx.moveTo(paddingX + (isRight ? +5 : -5), y);
          ctx.lineTo(paddingX, y);
          ctx.stroke();
          // todo: rotate this.labelRotation
          // this.rotatedLabel(ctx,paddingX + (isRight ? 7 : -7), y + 3, false, labels[i]);
          this.drawLabel(ctx, labels[i], paddingX + (isRight ? 7 : -7), y + 3);
          this.drawLeftGrid(ctx, w - paddingRight, y, paddingX);
        }
      }
    }

    if (this.label) {
      ctx.fillStyle = '#455a64';
      ctx.translate(isRight ? (w - 5) : 10, paddingY + ((h - paddingBottom) / 2));
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(this.label, 0, 0);
    }
  }

  renderBottom(ctx, frameCount, canvasProps, isTop) {
    if (this.hidden) {
      return;
    }
    const {
      w,
      h,
      paddingLeft, paddingBottom, paddingTop, paddingRight,
      offsetY, offsetX
    } = canvasProps;

    const paddingY = isTop ? (offsetY || 0) + paddingTop + this.offset : (offsetY || 0) + (h - paddingBottom) + this.offset;
    const paddingX = (offsetX || 0) + (paddingLeft || 0);

    ctx.lineWidth = 2;
    ctx.moveTo(paddingLeft, paddingY);
    ctx.lineTo(w - paddingRight, paddingY);
    ctx.stroke();

    ctx.lineWidth = 0.5;
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';

    if (!this.hideTicks) {
      const plotter = getPlotter(this.plotters, this.patterns[0]);
      const left = paddingLeft;

      //console.log('Plot bottom dates:', plotter)

      if (this.dataType === 'date' || this.dataType === 'datetime') {
        const { step, stepUnit } = findBestTime(plotter.roundedMinMax.max - plotter.roundedMinMax.min, w - paddingTop - paddingBottom)
        let currentDate = dayjs(plotter.roundedMinMax.min)
          .add(1, stepUnit);
        const endDate = dayjs(plotter.roundedMinMax.max);
        let last = null;

        while (endDate.diff(currentDate) > 0) {
          const x = left + plotter.valToPixels(
            currentDate.valueOf(),
            canvasProps?.scrollX,
            canvasProps?.scaleX
          );

          ctx.beginPath();
          ctx.strokeStyle = '#455a64';
          ctx.moveTo(x, paddingY);
          ctx.lineTo(x, paddingY + (isTop ? -5 : +5));
          ctx.stroke();
          if (!last || ((x - last) > 100)) {
            this.rotatedLabel(ctx, x, paddingY, isTop, currentDate.valueOf());
            last = x;
          }
          if (this.showGrid) {
            ctx.beginPath();
            ctx.strokeStyle = GRID_COLOR;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h - paddingBottom);
            ctx.stroke();
          }
          currentDate = currentDate.add(step, stepUnit);
        }
      } else if (this.dataType === 'linear') {
        const bestStep = findBestStep(plotter.roundedMinMax.max - plotter.roundedMinMax.min, w - paddingTop - paddingBottom);
        for (let i = plotter.roundedMinMax.min; i < plotter.roundedMinMax.max + bestStep; i += bestStep) {
          const x = paddingX + plotter.valToPixels(
            i,
            canvasProps?.scrollX,
            canvasProps?.scaleX
          );

          ctx.beginPath();
          ctx.strokeStyle = '#455a64';
          ctx.moveTo(x, paddingY);
          ctx.lineTo(x, paddingY + (isTop ? -5 : +5));
          ctx.stroke();
          this.rotatedLabel(ctx, x, paddingY, isTop, i);

          if (this.showGrid) {
            ctx.beginPath();
            ctx.strokeStyle = GRID_COLOR;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h - paddingBottom);
            ctx.stroke();
          }
        }
      } else if (this.dataType === 'labels') {
        const labels = getPlotter(this.plotters, this.patterns[0]).getLabels();
        for (let i = 0; i < labels.length; i += this.skip) {
          const x = left + plotter.valToPixels(
            labels[i],
            canvasProps?.scrollX,
            canvasProps?.scaleX
          );

          ctx.beginPath();
          ctx.strokeStyle = '#455a64';
          ctx.moveTo(x, paddingY);
          ctx.lineTo(x, paddingY + (isTop ? -5 : +5));
          ctx.stroke();

          this.rotatedLabel(ctx, x, paddingY, isTop, labels[i]);

          if (this.showGrid) {
            ctx.beginPath();
            ctx.strokeStyle = GRID_COLOR;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h - paddingBottom);
            ctx.stroke();
          }
        }
      }
    }

    if (this.label) {
      ctx.fillStyle = '#455a64';
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(this.label, paddingLeft + ((w - paddingLeft - paddingRight) / 2), isTop
        ? (paddingY - 30) : h);
    }
  }

  render(ctx, frameCount, canvasProps) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#455a64';
    if (this.side === 'left' || this.side === 'right') {
      this.renderLeft(ctx, frameCount, canvasProps, this.side === 'right');
    } else {
      this.renderBottom(ctx, frameCount, canvasProps, this.side === 'top');
    }
    ctx.restore();
  }
}

export default Axis;
