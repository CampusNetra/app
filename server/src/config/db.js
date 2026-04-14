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
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
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

  // 1. Aggressively clean params to avoid D1_TYPE_ERROR with undefined
  const cleanParams = (Array.isArray(params) ? params : [params]).map(v => 
    v === undefined ? null : v
  );

  // 2. Translate MySQL-specific syntax to SQLite (D1)
  // a. Convert "INSERT IGNORE" -> "INSERT OR IGNORE"
  let translatedSql = sql.replace(/INSERT IGNORE/gi, 'INSERT OR IGNORE');

  // b. Convert MySQL FIELD(column, 'v1', 'v2'...) -> SQLite CASE
  // MySQL FIELD(c.type, 'branch', 'section') => (CASE c.type WHEN 'branch' THEN 1 WHEN 'section' THEN 2 ELSE 3 END)
  translatedSql = translatedSql.replace(/FIELD\(([^,]+),\s*([^)]+)\)/gi, (match, column, argsStr) => {
    const args = argsStr.split(',').map(a => a.trim());
    let caseSql = `(CASE ${column.trim()} `;
    args.forEach((val, idx) => {
        caseSql += `WHEN ${val} THEN ${idx + 1} `;
    });
    caseSql += `ELSE ${args.length + 1} END)`;
    return caseSql;
  });

  // c. Convert MySQL ON DUPLICATE KEY UPDATE (Specifically for known patterns in the app)
  // Patterns like "INSERT INTO channel_members (...) ON DUPLICATE KEY UPDATE last_read_message_id = ?"
  if (translatedSql.includes('ON DUPLICATE KEY UPDATE')) {
      // 1. Detect table name to determine conflict target
      if (translatedSql.includes('channel_members')) {
          translatedSql = translatedSql.replace(/ON DUPLICATE KEY UPDATE (.*) = \?/gi, 
            'ON CONFLICT(channel_id, user_id) DO UPDATE SET $1 = excluded.$1');
      }
      // Add other table patterns here if needed in the future
  }

  try {
    const prepared = d1.prepare(translatedSql);
    const statement = cleanParams.length ? prepared.bind(...cleanParams) : prepared;
    const result = await statement.all();
    const meta = result.meta || {};
    const mutationResult = {
        ...meta,
        insertId: meta.last_row_id,
        affectedRows: meta.changes,
        changedRows: meta.changes // MySQL result compatibility
    };

    const isQuery = /^\s*(SELECT|SHOW|DESCRIBE|PRAGMA)/i.test(translatedSql);

    return isQuery 
      ? [result.results || [], {}] 
      : [mutationResult, []];
  } catch (err) {
    console.error('D1 Execution Error:', err.message);
    console.error('SQL:', sql);
    console.error('Params:', JSON.stringify(cleanParams));
    throw err;
  }
};

const execute = async (sql, params = []) => {
  if (getD1Binding()) {
    return executeOnD1(sql, params);
  }

  return getNodePool().execute(sql, params);
};

const query = async (sql, params = []) => {
  if (getD1Binding()) {
    return executeOnD1(sql, params);
  }
  return getNodePool().query(sql, params);
};

const getConnection = async () => {
  if (getD1Binding()) {
    throw new Error('getConnection is not supported on D1');
  }
  return getNodePool().getConnection();
};

module.exports = {
  execute,
  query,
  getConnection
};
