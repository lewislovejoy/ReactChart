import { getRoundedMinMax } from '../utils/ChartUtils';

const getBound = (x, width) => {
  if (!x) {
    return 0;
  }
  if (x > 0) {
    return x;
  }
  return width + x;
};

const getBound2 = (y, y2, height) => {
  if (!y) {
    return height - y2;
  }
  if (y > 0) {
    return height - y2 - y;
  }
  return -y2 - y;
};

const getBounds = (bounds, width, height) => {
  const x = getBound(bounds?.left, width);
  const y = getBound(bounds?.top, height);
  const w = getBound2(bounds?.right, x, width);
  const h = getBound2(bounds?.bottom, y, height);
  return {
    x,
    y,
    w: w < 0 ? 100 : w,
    h: h < 0 ? 100 : h
  };
};

class XYtoPixelCalc {
  constructor(pattern, dataType, bounds, data, min, max, labels, labelVals) {
    this.pattern = pattern;
    this.dataType = dataType;
    this.minVal = min;
    this.maxVal = max;
    this.labels = labels;
    this.labelVals = labelVals;
  }

  getLabels() {
    return this.labels;
  }

  hasLabels() {
    return this.labels?.length > 0;
  }

  resetLabels(max, labels, labelVals) {
    this.maxVal = max;
    this.labels = labels;
    this.labelVals = labelVals;
  }

  setPolarScale(isAngle, chart, size) {
    if (isAngle) {
      this.pixelSize = 360;
      this.roundedMinMax = getRoundedMinMax(
        this.minVal,
        this.maxVal,
        this.pixelSize,
        0.1
      );
    } else {
      const padding = chart?.padding || {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
      };

      const radius = Math.min(
        size.width - padding.left - padding.right,
        size.height - padding.bottom - padding.top
      );
      this.pixelSize = (radius / 2.0) - 30;
      this.roundedMinMax = getRoundedMinMax(
        this.minVal,
        this.maxVal,
        this.pixelSize,
        0.1 // tick
      );
    }
  }

  setScale(isVertical, chart, width, height) {
    const padding = chart?.padding || {
      left: 40,
      right: 0,
      bottom: 35,
      top: 10
    };

    const {
      w, h
    } = getBounds(chart.bounds, width, height);

    if (isVertical) {
      this.pixelSize = h - padding.bottom - padding.top;
      this.roundedMinMax = getRoundedMinMax(
        this.minVal,
        this.maxVal,
        this.pixelSize,
        0.1
      );
    } else {
      this.pixelSize = w - padding.left - padding.right;
      this.roundedMinMax = getRoundedMinMax(
        this.minVal,
        this.maxVal,
        this.pixelSize,
        0.1 // tick
      );
    }
  }

  filterOut(val, percent) {
    return ((val - this.minVal) / (this.maxVal - this.minVal)) < percent;
  }

  valToPixelsRadial(val, offset, scale) {
    const rmx = this.roundedMinMax;
    const v = (this.dataType === 'labels') ? (this.labelVals[val]) : val;
    const p = (this.pixelSize * (1.0 / (scale || 1.0)))
      * ((v - rmx.min - ((offset || 0.0) * (rmx.max - rmx.min))) / (rmx.max - rmx.min));
    return p;
  }

  valToPixels(val, offset, scale) {
    const rmx = this.roundedMinMax;
    const v = (this.dataType === 'labels') ? (0.5 + this.labelVals[val]) : val;
    const p = (this.pixelSize * (1.0 / (scale || 1.0)))
        * ((v - rmx.min - ((offset || 0.0) * (rmx.max - rmx.min))) / (rmx.max - rmx.min));
    return p;
  }
}

export default XYtoPixelCalc;
