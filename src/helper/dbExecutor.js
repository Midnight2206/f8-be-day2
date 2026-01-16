import mysqlPool from '#configs/database.js';
export const getExecutor = (connection) => {
  return connection ? connection.execute.bind(connection) : mysqlPool.execute.bind(mysqlPool);
}