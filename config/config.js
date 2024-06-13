require('dotenv').config();
const mysql = require("mysql2")

const urlDb = `mysql://root:HRkzUpEPquIkFogMUcvyAAPGCfGFHzXH@monorail.proxy.rlwy.net:12774/railway`

const connection = mysql.createConnection(urlDb);

module.exports = connection;
