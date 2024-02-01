import dayjs from 'dayjs';

export const getRoundedMinMax = (min, max, pixelHeight, pixelPerTick) => {
  let tickCount = Math.round(pixelHeight / pixelPerTick);
  if (tickCount < 3) {
    tickCount = 3;
  }
  const range = Math.abs(max - min);
  const unroundedTickSize = range / (tickCount - 1);
  const x = Math.ceil(Math.log10(unroundedTickSize) - 1);
  const pow10x = 10 ** x;
  const roundedTickRange = Math.ceil(unroundedTickSize / pow10x) * pow10x;
  const minRounded = roundedTickRange * Math.floor(min / roundedTickRange);
  const maxRounded = roundedTickRange * Math.ceil(max / roundedTickRange);

  return {
    min: minRounded,
    max: maxRounded,
    tickSizeInVal: roundedTickRange,
    pixelHeight
  };

  // todo: always show zero
};

function componentToHex(c) {
  const hex = parseInt(c, 10).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function rgbToHex(r, g, b) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export const COLOR_SCHEMES = {
  cat10: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
  paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99'],
  tableau: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'],
  blue: ["#002051","#0a326a","#2b446e","#4d566d","#696970","#7f7c75","#948f78","#ada476","#caba6a","#ead156","#fdea45"],
  green: ['#f7fcf5', '#e8f6e3', '#d3eecd', '#b7e2b1', '#97d494', '#73c378', '#4daf62', '#2f984f', '#157f3b', '#036429', '#00441b'].reverse(),
  red: ['#fff5f0', '#fee3d6', '#fdc9b4', '#fcaa8e', '#fc8a6b', '#f9694c', '#ef4533', '#d92723', '#bb151a', '#970b13', '#67000d'].reverse(),
  pastel: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2', '#fdcdac']
};

export const getColor = (dColor, defaultColor, colorScheme, index) => {
  if (dColor) {
    return dColor;
  }
  const cs = COLOR_SCHEMES[colorScheme];
  if (colorScheme && cs) {
    return cs[index % cs.length];
  }
  return defaultColor;
};

export function getValidDateOrString(str) {
  let dateVal = dayjs(str, null, true);
  if (dateVal.isValid()) {
    return dateVal.valueOf();
  }

  dateVal = dayjs(str, 'YYYY-MM-DD HH:mm:ss', true);
  if (dateVal.isValid()) {
    console.log('val', dateVal.valueOf());
    return dateVal.valueOf();
  }

  dateVal = dayjs(str, 'YYYY-MM-DDTHH:mm:ss[Z]', true);
  if (dateVal.isValid()) {
    return dateVal.valueOf();
  }

  dateVal = dayjs(str, 'YYYY-MM-DD', true);
  if (dateVal.isValid()) {
    return dateVal.valueOf();
  }

  dateVal = dayjs(str, 'HH:mm:ss', true);
  if (dateVal.isValid()) {
    return dateVal.valueOf();
  }

  return null;
}

export const getPlotter = (plotters, pat) => {
  const p = plotters[pat];
  if (!p) {
    throw new ReferenceError(`Couldn't find an axis for pattern: ${pat}`);
  }
  return p;
};

export const animateFC = (fc, val) => (val / 50) * fc;

export const getColor = (color) => {
  if (color === 'default') {
    return {
      from: 'color',
      modifiers: [['darker', 0.3]]
    };
  }
  return color;
};
