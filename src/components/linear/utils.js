export function clip(ctx, canvasProps) {
  const {
    w, paddingX = 0, paddingLeft, paddingRight, offsetX = 0
  } = canvasProps;

  const region = new Path2D();
  region.rect(paddingX + offsetX + paddingLeft, 0, w - paddingX - offsetX - paddingLeft - paddingRight, 2000);
  ctx.clip(region);
}

export function getStackName(patterns) {
  const p = [...patterns];
  return `STACK-${p.sort().join('-')}`;
}

export function getBarMaxWidth(percentOrAbs, numItems, fullSpace) {
  if (!percentOrAbs || percentOrAbs === 0) {
    return 0;
  }

  if (percentOrAbs > 1.0) {
    return percentOrAbs;
  }

  return (fullSpace / numItems);
}

export function getBarActualWidth(percentOrAbs, numItems, fullSpace) {
  if (!percentOrAbs || percentOrAbs === 0) {
    return 0;
  }

  if (percentOrAbs > 1.0) {
    return percentOrAbs;
  }

  return (fullSpace / numItems) * percentOrAbs;
}
