require("dotenv").config();
const mysql = require("mysql2");

const urlDb = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;

const connection = mysql.createConnection(urlDb);

module.exports = {
  database: process.env.MYSQLDATABASE,
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  dialect: 'mysql',
  connection: connection
};
