const common = {
  client: 'sqlite3',
  useNullAsDefault: true,
  migrations: { directory: './backend/data/migrations' },
  seeds: { directory: './backend/data/seeds' },
  pool: { afterCreate: (conn, done) => conn.run('PRAGMA foreign_keys = ON', done) },
}

const development = {
  ...common,
  connection: { filename: './backend/data/dev.db3' },
}

const testing = {
  ...common,
  connection: { filename: './backend/data/test.db3' },
}

const onUpdateTrigger = table => `
  CREATE TRIGGER ${table}_updated_at
  BEFORE UPDATE ON ${table}
  FOR EACH ROW
  BEGIN
    UPDATE ${table} SET updated_at = CURRENT_TIMESTAMP
    WHERE ${table.slice(0, table.length - 1)}_id = old.${table.slice(0, table.length - 1)}_id;
  END
`

module.exports = {
  development,
  testing,
  onUpdateTrigger,
}
