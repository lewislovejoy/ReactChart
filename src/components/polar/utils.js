export const toPolar = (x,y) => ({
  r: Math.sqrt((x * x) + (y * y)),
  deg: Math.atan(y / x)
});

export const toCart = (deg, r) => ({
  x: r * Math.cos(deg),
  y: r * Math.sin(deg)
});
