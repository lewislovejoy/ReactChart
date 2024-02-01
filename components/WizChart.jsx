import React from 'react';
import dayjs from 'dayjs';

import Chart from './Chart';
import LineChartProcessor from './linear/LinearChartProcessor';
import PolarChartProcessor from './polar/PolarChartProcessor';

import XYtoPixelCalc from './XYtoPixelCalc';
import { getStackName } from './linear/utils';

export function WizChart({
  data, charts, onClickFn, selected, setSelected, disableAnimation, ...rest
}) {
  const [size, setSize] = React.useState({ width: rest.width, height: rest.height });
  const onResize = ({ width, height }) => {
    setSize({ width, height });
  };

  let actualData = data;
  const chartLines = charts.map((chart) => {
    const plotters = {};
    chart.plots.forEach((line) => {
      if (line.type === 'Axis') {
        if (line.isStack) {
          const stackName = getStackName(line.patterns);
          let min = Infinity;
          let max = -Infinity;
          let calcMin = true;
          let calcMax = true;
          if (typeof line?.bounds?.min === 'number') {
            min = line?.bounds?.min;
            calcMin = false;
          }
          if (typeof line?.bounds?.max === 'number') {
            max = line?.bounds?.max;
            calcMax = false;
          }
          actualData.forEach((datum) => {
            let val = 0;
            line.patterns.forEach((pattern) => {
              val += datum[pattern];
            });
            if (calcMax && val > max) {
              max = val;
            }
            if (calcMin && val < min) {
              min = val;
            }
          });

          plotters[stackName] = new XYtoPixelCalc(
            stackName,
            line.dataType,
            line.bounds,
            actualData,
            min,
            max
          );
          plotters[stackName].setScale((line.side === 'left' || line.side === 'right'), chart, size.width, size.height);
          line.patterns.forEach((pattern) => {
            plotters[pattern] = plotters[stackName];
          });
        } else {
          line.patterns.forEach((pattern) => {
            if (line.dataType === 'date') {
              actualData = actualData?.map((d) => ({
                ...d,
                [pattern]: dayjs(d[pattern])
                  .startOf('day')
                  .valueOf()
              }));
            }
            if (line.dataType === 'datetime') {
              actualData = actualData?.map((d) => ({
                ...d,
                [pattern]: dayjs(d[pattern])
                  .valueOf()
              }));
            }
            if (line.dataType === 'linear') {
              actualData = actualData?.map((d) => ({
                ...d,
                [pattern]: parseFloat(d[pattern])
              }));
            }
          });

          const stackName = getStackName(line.patterns);
          if (line.dataType !== 'labels') {
            let min = Infinity;
            let max = -Infinity;
            let calcMin = true;
            let calcMax = true;
            if (typeof line?.bounds?.min === 'number') {
              min = line?.bounds?.min;
              calcMin = false;
            }
            if (typeof line?.bounds?.max === 'number') {
              max = line?.bounds?.max;
              calcMax = false;
            }
            actualData.forEach((datum) => {
              line.patterns.forEach((pattern) => {
                const val = datum[pattern];

                if (calcMax && val > max) {
                  max = val;
                }
                if (calcMin && val < min) {
                  min = val;
                }
              });
            });

            plotters[stackName] = new XYtoPixelCalc(
              stackName,
              line.dataType,
              line.bounds,
              actualData,
              min,
              max
            );
          } else {
            const labelsObj = {};
            actualData.forEach((d) => {
              line.patterns.forEach((pattern) => {
                labelsObj[d[pattern]] = true;
              });
            });
            const labels = Object.keys(labelsObj);
            const labelVals = {};
            labels.forEach((label, i) => {
              labelVals[label] = i;
            });

            plotters[stackName] = new XYtoPixelCalc(
              stackName,
              line.dataType,
              line.bounds,
              actualData,
              0,
              labels.length,
              labels,
              labelVals
            );
          }

          if (chart?.isPolar) {
            plotters[stackName].setPolarScale((line.side === 'angle'), chart, size);
          } else {
            plotters[stackName].setScale((line.side === 'left' || line.side === 'right'), chart, size.width, size.height);
          }

          line.patterns.forEach((pattern) => {
            plotters[pattern] = plotters[stackName];
          });
        }
      }
    });

    if (chart?.filterMin) {
      const keys = Object.keys(chart?.filterMin);
      actualData = actualData.filter((datum) => {
        let remove = false;
        keys.forEach((key) => {
          if (plotters[key].filterOut(datum[key], chart?.filterMin[key])) {
            remove = true;
          }
        });
        return !remove;
      });

      // actualData may have changed due to item being filtered - so need to re-do the plotters with labels that may no longer be used
      chart.plots.forEach((line) => {
        if (line.type === 'Axis') {
          const stackName = getStackName(line.patterns);
          const plotter = plotters[stackName];
          if (plotter.hasLabels) {
            const labelsObj = {};
            actualData.forEach((d) => {
              line.patterns.forEach((pattern) => {
                labelsObj[d[pattern]] = true;
              });
            });
            const labels = Object.keys(labelsObj);
            const labelVals = {};
            labels.forEach((label, i) => {
              labelVals[label] = i;
            });
            plotter.resetLabels(
              labels.length,
              labels,
              labelVals
            );
          }
        }
      });
    }

    const plots = chart?.isPolar
      ? chart.plots.map((line, j) => PolarChartProcessor[line.type](j, line, actualData, onClickFn, selected, setSelected))
      : chart.plots.map((line, j) => LineChartProcessor[line.type](j, line, actualData, onClickFn, selected, setSelected));

    plots.forEach((line) => {
      line.setPlotters(plotters);
    });

    return {
      ...chart,
      lineObjs: plots,
      scrollX: 0.0,
      scaleX: 1.0
    };
  });

  return (
      <div style={{ width: '100%', height: '100%' }}>
        <Chart
          disableAnimation={disableAnimation}
          height={size.height}
          width={size.width}
          charts={chartLines}
          onClick={onClickFn}
        />
      </div>
  );
}
