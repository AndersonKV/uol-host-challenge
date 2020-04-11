const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "uol_host",
});

const fs = require("fs");
const path = require("path");
const convert = require("xml-js");
const fetch = require("node-fetch");

const filePath = path.join(
  __dirname,
  "../../public/assets/api/liga_da_justica.xml"
);

const jsonAvangers = require("../../public/assets/api/vingadores.json");
const avangers = jsonAvangers.vingadores;

let item = [];

module.exports = {
  async index(req, res) {
    res.render("index");
  },

  async store(req, res) {
    //converte para json
    let getEmail = JSON.stringify(req.body);

    const removeStrings = (getEmail) => {
      const string = getEmail.replace(/[-\\^$*+?.()"|[\]{}]/g, "");

      if (string[string.length - 1] === ":") {
        const prepared = string.slice(0, string.length - 1).split(",");

        const name = prepared[0].split(":");
        const email = prepared[1].split(":");

        const telephone = prepared[2].split(":");

        const parte1 = telephone[1].slice(0, 2);
        const parte2 = telephone[1].slice(2, 6);
        const parte3 = telephone[1].slice(6, 11);

        const telephoneFormated = `(${parte1})-${parte2}-${parte3}`;

        const hero_group = prepared[3].split(":");
        const codiname = prepared[4].split(":");

        const user = {
          name: name[1],
          email: email[1],
          telephone: telephoneFormated,
          hero_group: hero_group[1],
          codiname: codiname[1],
        };

        return user;
      } else {
        return string;
      }
    };

    const user = removeStrings(getEmail);
    console.log("FINALIZANDO...");
    console.log(user);

    pool.getConnection(function (err, connection) {
      var sql = `INSERT INTO users_js (name, email, telephone, hero_group, codiname) VALUES ('${user.name}', '${user.email}', '${user.telephone}', '${user.hero_group}', '${user.codiname}')`;

      connection.query(sql, function (err, result) {
        connection.release();
        if (err) throw err;

        //console.log(result.affectedRows);

        if (result.affectedRows === 1) {
          res.status(200).send(true);
        }
        if (result.affectedRows === 0) {
          res.status(204).send(false);
        }
      });
    });
  },

  async getEmail(req, res) {
    console.log("VERICANDO EMAIL...");
    let getEmail = JSON.stringify(req.body);

    const removeStrings = (getEmail) => {
      const string = getEmail.replace(/[-\\^$*+?.()"|[\]{}]/g, "");

      if (string[string.length - 1] === ":") {
        const prepared = string.slice(0, string.length - 1).split(",");

        const email = prepared[0].split(":");

        return email;
      } else {
        return string;
      }
    };

    const email = removeStrings(getEmail);

    pool.getConnection(function (err, connection) {
      connection.query(
        `SELECT email FROM users_js where email = '${email}'`,
        function (err, rows) {
          connection.release();
          if (err) throw err;

          if (rows.length === 1) {
            res.status(200).send(true);
          }
          if (rows.length === 0) {
            res.status(200).send(false);
          }
        }
      );
    });
  },

  async getCodiname(req, res) {
    console.log("VERIFICANDO CODINOME...");
    const getGroup = JSON.stringify(req.body);
    const group = getGroup.replace(/[-\\^$*+?.()"|:[\]{}]/g, "");

    let setLeague = false;
    let setAvangers = false;

    if (group === "league of justice") {
      const xmlFile = fs.readFileSync(filePath);

      const result = convert.xml2json(xmlFile, { compact: true, spaces: 4 });
      const json = JSON.parse(result);
      const lj = json.liga_da_justica.codinomes.codinome;

      async function getLeague() {
        for (const value of lj) {
          pool.getConnection(function (err, connection) {
            connection.query(
              `SELECT * FROM users_js where codiname = '${value._text}'`,
              function (err, rows) {
                if (err) console.log(err);
                connection.release();

                if (rows.length === 0) {
                  if (item.length == 0) {
                    item.push(value._text);
                    setLeague = true;
                    console.log(value._text);
                    res.status(200).send(value._text);
                  }
                }
              }
            );
          });
        }
      }

      getLeague();

      //verifica se passSucess foi validado, se não, envia reservado
      checkPass = () => {
        if (setLeague === false) res.status(200).send("Reservado");
      };

      setTimeout(checkPass, 3500);
    }

    if (group === "avangers") {
      async function getAvangers() {
        for (const value of avangers) {
          pool.getConnection(function (err, connection) {
            connection.query(
              `SELECT * FROM users_js where codiname = '${value.codinome}'`,
              function (err, rows) {
                if (err) {
                  console.log(err);
                }
                connection.release();

                console.log(rows.length);
                if (rows.length === 0) {
                  if (item.length == 0) {
                    item.push(value.codinome);
                    setAvangers = true;
                    console.log(value.codinome);
                    res.status(200).send(value.codinome);
                  }
                }
              }
            );
          });
        }
      }

      getAvangers();
      //verifica se setAvangers foi validado, se não, envia reservado
      checkPass = () => {
        if (setAvangers === false) res.status(200).send("Reservado");
      };

      setTimeout(checkPass, 3600);
    }
  },

  async list(req, res) {
    pool.getConnection(function (err, connection) {
      connection.query(`SELECT * FROM users_js`, function (err, rows) {
        connection.release();
        if (err) throw err;
        res.status(200).send(rows);
      });
    });
  },
};
