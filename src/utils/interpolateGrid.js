export const interpolateGrid = (grid, rows, columns) => {
  /* 1. matriz vacía (null) */
  const matrix = Array.from({ length: rows },
                            () => Array(columns).fill(null));

  /* 2. volcamos valores medidos => invertimos Y */
  Object.entries(grid).forEach(([key, { sum, count }]) => {
    const [x, y] = key.split('-').map(Number);   // y = 0 es abajo
    const row = rows - 1 - y;                    // row = 0 es arriba
    if (row >= 0 && row < rows && x >= 0 && x < columns) {
      matrix[row][x] = sum / count;              // promedio instantáneo
    }
  });

  /* 3. interpolación vertical por columna */
  for (let x = 0; x < columns; x++) {
    let last = null;
    for (let r = 0; r < rows; r++) {
      if (matrix[r][x] !== null) {
        if (last !== null && last < r - 1) {
          const v0 = matrix[last][x];
          const v1 = matrix[r][x];
          const gap = r - last;
          for (let rr = last + 1; rr < r; rr++) {
            const t = (rr - last) / gap;
            matrix[rr][x] = v0 + t * (v1 - v0);
          }
        }
        last = r;
      }
    }
  }

  /* 4. volvemos al formato { "x-y": {sum, count:1} }  (y invertido otra vez) */
  const out = {};
  matrix.forEach((rowArr, r) => {
    rowArr.forEach((val, x) => {
      if (val !== null) {
        const y = rows - 1 - r;                  // de nuevo (0,0) abajo-izq
        out[`${x}-${y}`] = { sum: val, count: 1 };
      }
    });
  });

  return out;
};
