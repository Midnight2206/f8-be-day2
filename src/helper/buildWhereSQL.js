export const buildWhere = (filter={}, map={}) => {
  const conditions = [];
  const params = [];
  for (const key in map) {
    if (filter[key] !== undefined) {
      conditions.push(`${map[key]} = ?`);
      params.push(filter[key]);
    }
  }

  return {
    where: conditions.length ? " WHERE " + conditions.join(" AND ") : "",
    params,
  };
};
