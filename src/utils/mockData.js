
export const generateMock = (rows = 8, columns = 80, min = 60, max = 90) => {
    const obj = {};
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const key = `${x}-${y}`;
        const val = Math.random() * (max - min) + min;
        obj[key] = { count: 1, sum: val };
      }
    }
    return obj;
  };
  