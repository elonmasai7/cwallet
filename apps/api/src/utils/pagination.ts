export function getPagination(page = 1, pageSize = 10) {
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const safeSize = Number.isNaN(pageSize) || pageSize < 1 ? 10 : Math.min(pageSize, 50);

  return {
    skip: (safePage - 1) * safeSize,
    take: safeSize,
    page: safePage,
    pageSize: safeSize,
  };
}

