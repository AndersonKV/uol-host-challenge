module.exports = (cn) => {
  const mysql = require("mysql");

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "uol_host",
  });

  return connection;
};
