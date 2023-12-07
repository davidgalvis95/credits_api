module.exports = {
  client: 'pg',
  connection:
    process.env.DATA_BASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/postgres',
};
