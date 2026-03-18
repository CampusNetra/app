let nodePool = null;

const getD1Binding = () => {
  if (typeof globalThis !== 'undefined' && globalThis.DB) {
    return globalThis.DB;
  }
  return null;
};

const getNodePool = () => {
  if (nodePool) return nodePool;

  const nodeRequire = eval('require');
  const mysql = nodeRequire('mysql2/promise');
  nodeRequire('dotenv').config();

  nodePool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'campus_netra',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
  });

  return nodePool;
};

const executeOnD1 = async (sql, params = []) => {
  const d1 = getD1Binding();
  if (!d1) {
    throw new Error('D1 binding not found');
  }

  const prepared = d1.prepare(sql);
  const statement = params.length ? prepared.bind(...params) : prepared;
  const result = await statement.all();
  const meta = result.meta || {};

  return [
    result.results || [],
    {
      ...meta,
      insertId: meta.last_row_id,
      affectedRows: meta.changes
    }
  ];
};

const execute = async (sql, params = []) => {
  if (getD1Binding()) {
    return executeOnD1(sql, params);
  }

  return getNodePool().execute(sql, params);
};

module.exports = {
  execute
};
