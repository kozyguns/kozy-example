export const cycleFirearms = (firearms: any[], count: number, startIndex: number = 0) => {
  const cycledFirearms = [];
  let index = startIndex;

  while (cycledFirearms.length < count) {
    cycledFirearms.push(firearms[index]);
    index = (index + 1) % firearms.length;
  }

  return cycledFirearms;
};