import StringFormater from '../../utils/StringFormater';

import Axis from './Axis';
import Bar from './Bar';
import Group from './Group';
import Scatter from './Scatter';
import Segment from './Segment';
import Line from './Line';
import Area from './Area';
import Band from './Band';
import Stack from './Stack';
import Heatmap from './Heatmap';
import Gauge from './Gauge';
import Calc from './Calc';
import Zoom from './Zoom';
import Funnel from './Funnel';

import Tooltip from '../general/Tooltip';
import Legend from '../general/Legend';

const linearChartProcessor = {
  Gauge: (key, {
    patternX,
    min,
    max,
    ...rest
  }, data) => new Gauge(data, patternX, min, max, rest),
  Heatmap: (key, {
    patternX,
    patternY,
    patternVal,
    ...rest
  }, data) => new Heatmap(data, patternX, patternY, patternVal, rest),
  Axis: (key, {
    label,
    type,
    tickFormat,
    side,
    ...rest
  }, d) => new Axis(side, d, label, tickFormat && StringFormater(tickFormat), rest),
  Bar: (key, {
    patternX,
    patternY,
    type,
    ...rest
  }, data) => new Bar(data, patternX, patternY, rest),
  Funnel: (key, {
    patternX,
    patternY,
    type,
    ...rest
  }, data) => new Funnel(data, patternX, patternY, rest),
  Grouped: (key, {
    plots,
    type,
    ...props
  }, data) => new Group(
    plots.map((line2, j) => linearChartProcessor[line2.type](j, line2, data)),
    props
  ),
  Scatter: (key, {
    patternX,
    patternY,
    type,
    ...rest
  }, data) => new Scatter(data, patternX, patternY, rest),
  Line: (key, {
    patternX,
    patternY,
    sortKey,
    style,
    type,
    ...rest
  }, data) => new Line(data, patternX, patternY, rest),
  Calc: (key, {
    patternX,
    patternY,
    sortKey,
    style,
    type,
    ...rest
  }, data) => new Calc(data, patternX, patternY, rest),
  Area: (key, {
    patternX,
    patternY,
    sortKey,
    style,
    type,
    ...rest
  }, data) => new Area(data, patternX, patternY, rest),

  Band: (key, {
    patternX,
    patternYMax,
    patternYMin,
    sortKey,
    style,
    type,
    ...rest
  }, data) => new Band(data, patternX, patternYMin, patternYMax, rest),

  LineSegment: (key, {
    patternX,
    patternY,
    style,
    type,
    formatLabel,
    ...rest
  }, data) => new Segment(data, patternX, patternY, rest),
  Legend: (key, {
    type,
    ...rest
  }, data, scale) => new Legend(rest),
  Tooltip: (key, {
    type,
    ...rest
  }, data, scale) => new Tooltip(rest),
  Zoom: (key, {
    type,
    ...rest
  }, data, scale) => new Zoom(rest),



  Stacked: (key, {
    plots,
    type,
    ...props
  }, data) => new Stack(
    data,
    plots.map((line2, j) => linearChartProcessor[line2.type](j, line2, data)),
    props
  )
};

export default linearChartProcessor;
