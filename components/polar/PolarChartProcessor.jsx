import StringFormater from '../../utils/StringFormater';

import Axis from './Axis';
import Area from './Area';
import Scatter from './Scatter';
import Spider from './Spider';
import Pie from './Pie';
import Bar from './Bar';

import Tooltip from '../general/Tooltip';
import Legend from '../general/Legend';

const polarChartProcessor = {
  Axis: (key, {
    label,
    type,
    tickFormat,
    side,
    ...rest
  }, d) => new Axis(side, d, label, tickFormat && StringFormater(tickFormat), rest),
  Pie: (key, {
    patternX,
    patternY,
    ...rest
  }, data) => new Pie(data, patternX, patternY, rest),
  Bar: (key, {
    patternX,
    patternY,
    ...rest
  }, data) => new Bar(data, patternX, patternY, rest),
  Scatter: (key, {
    patternX,
    patternY,
    ...rest
  }, data) => new Scatter(data, patternX, patternY, rest),
  Spider: (key, {
    patternX,
    patternY,
    ...rest
  }, data) => new Spider(data, patternX, patternY, rest),
  Area: (key, {
    patternX,
    patternY,
    ...rest
  }, data) => new Area(data, patternX, patternY, rest),

  Legend: (key, args) => new Legend(args),
  Tooltip: (key, args) => new Tooltip(args)
};

export default polarChartProcessor;
