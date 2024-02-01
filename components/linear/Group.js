import { getBarActualWidth } from './utils';

class Group {
  constructor(plots, otherProps, data) {
    this.d = data;
    this.plots = plots;
    this.offset = otherProps.offset;
    this.colorScheme = otherProps.colorScheme;
  }

  getWidth() {
    return 0;
  }

  setPlotters(plotters) {
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
    let paddingX = 0;
    const offset = this.isHorizontal
      ? getBarActualWidth(this.offset, this.d?.length || 1, canvasProps.h - canvasProps.paddingBottom - canvasProps.paddingTop)
      : getBarActualWidth(this.offset, this.d?.length || 1, canvasProps.w - canvasProps.paddingLeft - canvasProps.paddingRight);

    this.plots.forEach((line, i) => {
      line.render(ctx, frameCount, {
        ...canvasProps,
        colorScheme: this.colorScheme,
        colorSchemeId: i,
        paddingX
      }, hover, clicked);
      paddingX += ((line.getWidth(canvasProps) || 0) + offset);
    });
  }
}

export default Group;
