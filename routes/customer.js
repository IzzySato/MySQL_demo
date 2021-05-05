const express = require('express');
const mysql = require('mysql');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Let's build the DB if it doesn't exist
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Friday23',
    multipleStatements: true
  });

  const createDBAndTables = `CREATE DATABASE IF NOT EXISTS test;
      use test;
      CREATE TABLE IF NOT EXISTS customer (
      ID int NOT NULL AUTO_INCREMENT,
      fName varchar(30),
      lName varchar(30),
      PRIMARY KEY (ID));`;

  connection.connect();
  connection.query(createDBAndTables, function (error, results, fields) {
    if (error) {
        throw error;
    }
    //console.log(results);
  });
  connection.end();
  res.render('index', { title: 'MySQL test' });
});

router.get('/load-customer', (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Friday23',
    database: 'test'
  });
  connection.connect();
  connection.query('SELECT * FROM customer', (error, results, fields) => {
      if (error) {
          throw error;
      }
      console.log('Rows returned are: ', results);
      res.send({ status: "success", rows: results });

  });
  connection.end();
});


router.post('/add-customer', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Friday23',
    database: 'test'
  });
  connection.connect();

  connection.query('INSERT INTO customer (fName, lName) values (?, ?)',
        [req.body.fName, req.body.lName],
        function (error, results, fields) {
    if (error) {
        throw error;
    }
    //console.log('Rows returned are: ', results);
    res.send({ status: "success", msg: "Recorded added." });
  });
  connection.end();
});

router.post('/removeCustomer', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Friday23',
    database: 'test'
  });
  connection.connect();
  const {body: {id}} = req;
  connection.query('DELETE FROM customer WHERE ID = ?',
        id,
        function (error, results, fields) {
    if (error) {
        throw error;
    }
    res.send({ status: "success", msg: "Removed customer." });
  });
  connection.end();
});

router.post('/updateCustomer', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Friday23',
    database: 'test'
  });
  connection.connect();
  const {body: {id, newFirst, newLast}} = req;
  connection.query('UPDATE customer SET fName = ?, lName = ? WHERE ID = ?',
        [newFirst, newLast, id],
        function (error, results, fields) {
    if (error) {
        throw error;
    }
    res.send({ status: "success", msg: "Removed customer." });
  });
  connection.end();
});



module.exports = router;