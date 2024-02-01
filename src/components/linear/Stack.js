import {
  getPlotter
} from '../../utils/ChartUtils';
import {
  getStackName
} from './utils';

class Stack {
  constructor(data, plots, otherProps) {
    this.plots = plots;
    this.data = data;
    this.colorScheme = otherProps.colorScheme;

    const allPatterns = {};
    this.plots.forEach((line) => {
      const d = line.patternY;
      if (d) {
        allPatterns[d] = true;
      }
    });
    this.allPatternArray = Object.keys(allPatterns);
  }

  getWidth() {
    return 0;
  }

  setPlotters(plotters) {
    this.plotters = plotters;
    this.plots.forEach((line) => line.setPlotters(plotters));
  }


  mouseMove(xLoc, yLoc, isClick, isMouseDown, scaleMove, moveDif) {
    let selected;
    let hover;
    let repaint;
    this.plots.forEach((line) => {
      const newData = line.mouseMove(xLoc, yLoc, isClick, isMouseDown, scaleMove, moveDif);
      if (newData?.selected) {
        selected = newData.selected;
        repaint = true;
      }
      if (newData?.hover) {
        hover = newData.hover;
        repaint = true;
      }
      if (newData?.repaint) {
        repaint = true;
      }
    });

    return {
      hover,
      selected,
      repaint
    };
  }

  render(ctx, frameCount, canvasProps, hover, clicked) {
    const groupMinMax = getPlotter(this.plotters, getStackName(this.allPatternArray));

    this.plots.forEach((line, i) => {
      line.render(ctx, frameCount, {
        ...canvasProps,
        groupStart: (i > 0) ? this.allPatternArray.slice(0, i) : undefined,
        groupMinMax,
        offsetY: 0,
        colorScheme: this.colorScheme,
        colorSchemeId: i
      }, hover, clicked);
    });
  }
}

export default Stack;
