export const campsSort = arr => {
  const sortedArr = arr.sort((x, y) => {
    const today = new Date();
    const dateX = new Date(x.date);
    const dateY = new Date(y.date);

    // Send to the end if archived
    const isXPast = dateX < today;
    const isYPast = dateY < today;

    if (isXPast && !isYPast) return 1; // x past, y future -> x goes last
    if (!isXPast && isYPast) return -1; // x future, y past

    // Sort normal within splitted groups
    return dateX - dateY;
  });
  return sortedArr;
};
export const eventsSort = arr => {
  const sortedArr = arr.sort((x, y) => {
    const now = new Date();
    const xDate = new Date(x.date);
    const yDate = new Date(y.date);

    const xIsPast = xDate < now;
    const yIsPast = yDate < now;

    // 1. Past events go below future ones
    if (xIsPast && !yIsPast) return 1;
    if (!xIsPast && yIsPast) return -1;

    // 2. Within each group: sort by manual order (lower number = higher priority)
    const xOrder = x.order ?? 9999; // fallback for undefined
    const yOrder = y.order ?? 9999;

    if (xOrder !== yOrder) return xOrder - yOrder;

    // 3. Within same order: fixed events come before repetitive ones
    if (x.eventType === 'fixed' && y.eventType !== 'fixed') return -1;
    if (x.eventType !== 'fixed' && y.eventType === 'fixed') return 1;

    // 4. As final fallback: sort by date (ascending)
    return xDate - yDate;
  });
  return sortedArr;
};
export const classesSort = arr => {
  const sortedArr = arr;
  return sortedArr;
};
