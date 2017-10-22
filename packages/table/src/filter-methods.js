
// 'match','==','>','<','>=','<=','range'

export const masterFilter = (values, row, filterType, column) => {
  switch (filterType) {
    case '==':
    default:
      return filterEqual(values, row, filterType, column);
    case 'match':
      return filterMatch(values, row, filterType, column);
    case '>':
      return filterGreater(values, row, filterType, column);
    case '<':
      return filterLess(values, row, filterType, column);
    case '>=':
      return filterGreaterEqual(values, row, filterType, column);
    case '<=':
      return filterLessEqual(values, row, filterType, column);
    case 'range':
      return filterRange(values, row, filterType, column);
  }
};

export const filterMatch = (values, row, filterType, column) => {
  return row[column.property].indexOf(values[0]) !== -1;
};

export const filterEqual = (values, row, filterType, column) => {
// eslint-disable-next-line eqeqeq
  return row[column.property] == values[0];
};

export const filterGreater = (values, row, filterType, column) => {
  if (filterType === 'date' || filterType === 'datetime') {
    return row[column.property].getTime() > values[0].getTime();
  }
  if (filterType === 'time') {
    return (row[column.property].getTime() % 86400000) > (values[0].getTime() % 86400000);
  }
  return row[column.property] > values[0];
};

export const filterLess = (values, row, filterType, column) => {
  if (filterType === 'date' || filterType === 'datetime') {
    return row[column.property].getTime() < values[0].getTime();
  }
  if (filterType === 'time') {
    return (row[column.property].getTime() % 86400000) < (values[0].getTime() % 86400000);
  }
  return row[column.property] < values[0];
};

export const filterGreaterEqual = (values, row, filterType, column) => {
  if (filterType === 'date' || filterType === 'datetime') {
    return row[column.property].getTime() >= values[0].getTime();
  }
  if (filterType === 'time') {
    return (row[column.property].getTime() % 86400000) >= (values[0].getTime() % 86400000);
  }
  return row[column.property] >= values[0];
};

export const filterLessEqual = (values, row, filterType, column) => {
  if (filterType === 'date' || filterType === 'datetime') {
    return row[column.property].getTime() <= values[0].getTime();
  }
  if (filterType === 'time') {
    return (row[column.property].getTime() % 86400000) <= (values[0].getTime() % 86400000);
  }
  return row[column.property] <= values[0];
};

export const filterRange = (values, row, filterType, column) => {
  if (filterType === 'date' || filterType === 'datetime') {
    return row[column.property].getTime() > values[0].getTime() && row[column.property].getTime() < values[0].getTime();
  }
  if (filterType === 'time') {
    return (row[column.property].getTime() % 86400000) > (values[0].getTime() % 86400000) &&
      (row[column.property].getTime() % 86400000) < (values[0].getTime() % 86400000);
  }
  return row[column.property] > values[0] && row[column.property] < values[0];
};
