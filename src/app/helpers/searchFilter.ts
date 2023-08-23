type SearchCondition = {
  [key: string]: { contains: string; mode: 'insensitive' };
};

type FilterCondition = {
  [key: string]: unknown;
};

export const getWhereCondition = (
  searchTerm: string | undefined,
  searchFields: string[],
  filterFields: { [key: string]: unknown }
) => {
  // searching
  let searchConditions: SearchCondition[] = [];
  if (searchTerm) {
    searchConditions = searchFields.map((field) => ({
      [field]: { contains: searchTerm, mode: 'insensitive' },
    }));
  }
  // filtering
  let filterConditions: FilterCondition[] = [];
  if (Object.keys(filterFields).length) {
    filterConditions = Object.entries(filterFields).map(([key, value]) => ({
      [key]: value,
    }));
  }
  // where condition
  let whereCondition = {};
  if (searchConditions.length && filterConditions.length) {
    whereCondition = { AND: filterConditions, OR: searchConditions };
  } else if (searchConditions.length && !filterConditions.length) {
    whereCondition = { OR: searchConditions };
  } else if (!searchConditions.length && filterConditions.length) {
    whereCondition = { AND: filterConditions };
  }
  return whereCondition;
};
