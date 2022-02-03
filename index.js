const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
app.use(express.json());

const { USER, HOST, PASSWORD, DATABASE } = process.env;

const mysql = require("mysql2");
const db = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

db.query(
  "CREATE TABLE IF NOT EXISTS stores (id int NOT NULL UNIQUE auto_increment, name varchar(255) NOT NULL UNIQUE, password varchar(255) NOT NULL, primary key (id))",
  function (err, result) {
    if (err) throw err;
    console.log("Table stores created");
  }
);

app.get("/stores", (req, res) => {
  db.query("SELECT * FROM stores", function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/stores/:name", (req, res) => {
  db.query(
    "SELECT * FROM stores WHERE name = ?",
    [req.params.name],
    function (err, result) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.post("/stores", (req, res) => {
  const { store, password } = req.body;
  db.query(
    `INSERT INTO stores (name, password) VALUES('${store}', '${password}')`,
    (err, result) => {
      if (err) res.json({ error: "Store already exists" });
      else res.json({ success: "Store created" });
    }
  );
});

app.delete("/stores", (req, res) => {
  const { store, password } = req.body;
  db.query(
    `DELETE FROM stores WHERE name = '${store}' AND password = '${password}'`,
    (err, res) => {
      if (err) throw err;
    }
  );
  res.send("Store deleted");
});

app.delete("/stores/delete-all", (req, res) => {
  db.query("DELETE FROM stores", (err, res) => {
    if (err) throw err;
  });
  res.send("All stores deleted");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
