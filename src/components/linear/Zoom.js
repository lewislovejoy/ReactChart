class Zoom {
  constructor(otherProps) {
    this.chart = otherProps.chart;

    this.startScroll = 0.0;
    this.endScroll = 1.0;
  }

  getWidth() {
    return 0;
  }

  setPlotters(plotters) {
    this.plotters = plotters;
  }

  mouseMove(xLoc, yLoc, isClick, isButtonDown, scaleMove, mouseDownLoc) {
    const {
      w, h,
      paddingX = 0,
      paddingLeft = 0, paddingRight = 0,
      paddingBottom, paddingTop,
      offsetX, offsetY
    } = this.canvasProps;
    let offX = paddingX;
    if (paddingX === undefined) {
      offX = 0;
    }

    const barWidth = w - paddingLeft - offX - paddingRight;
    offX += (offsetX || 0);
    const paddingY = (offsetY || 0);
    const startX = offX + paddingLeft + (barWidth * this.startScroll);
    const endX = startX + ((this.endScroll - this.startScroll) * barWidth);
    const startY = paddingY;
    const endY = startY + h - paddingBottom - paddingTop;

    if (xLoc > startX && xLoc < endX && yLoc > startY && yLoc < endY) {
      if (xLoc < startX + 8) {
        document.body.style.cursor = 'col-resize';
        if (isButtonDown && !this.moveStart && !this.moveEnd) {
          this.moveStart = true;
          this.moveEnd = false;
        }
      } else if (xLoc > endX - 8 && !this.moveStart && !this.moveEnd) {
        document.body.style.cursor = 'col-resize';
        if (isButtonDown) {
          this.moveStart = false;
          this.moveEnd = true;
        }
      } else if (!this.moveStart && !this.moveEnd) {
        document.body.style.cursor = 'ew-resize';
        if (isButtonDown) {
          this.moveStart = true;
          this.moveEnd = true;
        }
      }
    } else {
      document.body.style.cursor = null;
    }

    if (!isButtonDown) {
      this.moveStart = false;
      this.moveEnd = false;
    }

    let needsRepaint = false;
    if (this.moveStart && this.moveEnd) {
      if ((this.moveStart && (this.startScroll + (mouseDownLoc.x / barWidth)) > 0.0)
        && (this.moveEnd && (this.endScroll + (mouseDownLoc.x / barWidth)) <= 1.0)) {
        this.startScroll += (mouseDownLoc.x / barWidth);
        this.endScroll += (mouseDownLoc.x / barWidth);
        needsRepaint = true;
      }
    } else if (this.moveStart) {
      if (this.startScroll + (mouseDownLoc.x / barWidth) > 0.0) {
        this.startScroll += (mouseDownLoc.x / barWidth);
        needsRepaint = true;
      }
    } else if (this.moveEnd) {
      if (this.endScroll + (mouseDownLoc.x / barWidth) <= 1.0) {
        this.endScroll += (mouseDownLoc.x / barWidth);
        needsRepaint = true;
      }
    }

    if (needsRepaint) {
      scaleMove(this.chart, this.startScroll, this.endScroll - this.startScroll);
    }

    return { repaint: true };
  }

  render(ctx, frameCount, canvasProps) {
    this.canvasProps = canvasProps;
    const {
      w, h,
      paddingX,
      paddingLeft, paddingRight,
      paddingBottom, paddingTop,
      offsetX, offsetY
    } = canvasProps;
    let offX = paddingX;
    if (paddingX === undefined) {
      offX = 0;
    }

    offX += (offsetX || 0);
    const paddingY = (offsetY || 0);

    ctx.save();
    ctx.beginPath();

    ctx.fillStyle = '#0f0f0f10';
    const barWidth = w - paddingLeft - offX - paddingRight;

    const startX = barWidth * this.startScroll;
    const endX = startX + ((this.endScroll - this.startScroll) * barWidth);

    ctx.fillRect(
      offX + paddingLeft,
      paddingY,
      startX + 8,
      h - paddingBottom - paddingTop
    );

    ctx.fillRect(
      offX + paddingLeft + endX - 8,
      paddingY,
      barWidth - endX + 8,
      h - paddingBottom - paddingTop
    );
    ctx.fill();

    ctx.stokeStyle = '#0f0f0fa0';
    ctx.strokeRect(
      offX + paddingLeft + startX,
      paddingY + ((h - paddingBottom) / 2) - 10,
      8,
      20
    );

    ctx.strokeRect(
      offX + paddingLeft + endX - 8,
      paddingY + ((h - paddingBottom) / 2) - 10,
      8,
      20
    );

    ctx.fillStyle = 'white';
    ctx.fillRect(
      offX + paddingLeft + startX,
      paddingY + ((h - paddingBottom) / 2) - 10,
      8,
      20
    );
    ctx.fillRect(
      offX + paddingLeft + endX - 8,
      paddingY + ((h - paddingBottom) / 2) - 10,
      8,
      20
    );

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}

export default Zoom;
