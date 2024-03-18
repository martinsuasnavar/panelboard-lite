
// old version with traditional datbases



///////////////////////
//  MySQL            //
//  Database Module  //
///////////////////////


// db/index.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PORT = process.env.DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;


const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  port: DB_PORT,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}
)

/*
local database

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: '3308',
    database: 'app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
)

*/


// check if it's localhost to determine the schema name
// this prevents access denial errors
let database = pool.pool.config.connectionConfig.database;
let host = pool.pool.config.connectionConfig.host;
checkIfItsLocalHost();

function checkIfItsLocalHost(){
  if (host == 'localhost'){
      database = `${database}.`;
      console.log("Database is local host.");
  }else{
      database = ``;
      console.log("Database is not local host.");
  }
}

// DATABASE CONNECTION CHECK
async function checkDatabaseConnection() {
  try {
    await pool.execute('SELECT 1');
    console.log('Database connection successful.');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}
// Get all rows from a table
async function getAll(table, selectById, idFieldName, idValue) {
  let [rows, fields] = await pool.query(`SELECT * FROM ${database}${table}`);
  if (selectById == true){
    [rows, fields] = await pool.query(`SELECT * FROM ${database}${table} WHERE ${idFieldName} = ?`, [idValue]);
  }
  return rows;
}

// Create a new row in a table
async function create(table, data) {
  const [result] = await pool.query(`INSERT INTO ${database}${table} SET ?`, [data]);
  return result.insertId;
}

// Update a row in a table
async function update(table, updatedColumnName, updatedValue, idFieldName, id, data) {
  const [result] = await pool.query(`UPDATE ${database}${table} SET ${updatedColumnName} = '${updatedValue}' WHERE ${idFieldName} = ?`, [id]);
  return result;
}

// Delete a row from a table
async function remove(table, idFieldName, idValue) {
  const [result] = await pool.query(`DELETE FROM ${database}${table} WHERE ${idFieldName} = ?`, [parseInt(idValue)]);
  return result;
}

module.exports = {
  checkDatabaseConnection,
  getAll,
  create,
  update,
  remove
};
*/