import pkg from 'pg';

const { Pool } = pkg;

const usr = process.env.POSTGRES_USER;
const pass = process.env.POSTGRES_PASS;
const db_name = process.env.POSTGRES_DB;

const pool = new Pool({
  user: usr,
  password: pass,
  host: 'localhost',
  port: 5432,
  database: db_name
});

export const query = (text, params) => pool.query(text, params);