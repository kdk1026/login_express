const mysql = require('mysql');
const config = require('../config/db_config.js');

const connection = mysql.createConnection(config);
connection.connect();

module.exports = connection;