// const ethers = require('ethers');
require('dotenv').config();
const mysql = require('mysql2/promise');

const express = require('express');
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

async function query({ query, values = [] }) {
    
      const dbconnection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
      });
    
      try {
        const [results] = await dbconnection.execute(query, values);
        dbconnection.end();
        return results;
      } catch (error) {
        throw Error(error.message);
        return { error };
      }
    }

app.post('/erc20trxlog', async(req,res) => {

  try {
      const {from, contractaddress, func, blockhash, blocknumber, transactionhash, status}  = req.body;
      console.log(from, contractaddress, func, blockhash, blocknumber, transactionhash, status, "DATA POST balblalabalba");
      const products = await query({
          query: "INSERT INTO `erc20` (`useraddress`, `contractaddress`, `function`, `blockhash`, `blocknumber`, `transactionhash`, `status`) VALUES (?,?,?,?,?,?,?)",
          values: [from, contractaddress, func, blockhash, blocknumber, transactionhash, status],
        });
      
        // console.log(products);
        res.status(200).json({ status: "success" });
  } catch (error) {
      res.status(500).send(error.message);
      console.log(error);
  }
});

app.post('/erc721trxlog', async(req,res) => {

  try {
      const {from, contractaddress, func, blockhash, blocknumber, transactionhash, status}  = req.body;
      console.log(from, contractaddress, func, blockhash, blocknumber, transactionhash, status, "DATA POST balblalabalba");
      const products = await query({
          query: "INSERT INTO `erc721` (`useraddress`, `contractaddress`, `function`, `blockhash`, `blocknumber`, `transactionhash`, `status`) VALUES (?,?,?,?,?,?,?)",
          values: [from, contractaddress, func, blockhash, blocknumber, transactionhash, status],
        });
      
        // console.log(products);
        res.status(200).json({ status: "success" });
  } catch (error) {
      res.status(500).send(error.message);
      console.log(error);
  }
});

app.get('/erc20/:from', async(req,res) => {
    try {
      const from = req.params.from;
        const products = await query({
            query: "SELECT * FROM `erc20` WHERE useraddress IN (?)",
            values: [from],
          });
          console.log(products);
          res.status(200).json(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/erc721/:from', async(req,res) => {
  try {
    const from = req.params.from;
      const products = await query({
          query: "SELECT * FROM `erc721` WHERE useraddress IN (?)",
          values: [from],
        });
        console.log(products);
        res.status(200).json(products);
  } catch (error) {
      res.status(500).send(error.message);
  }
});


const port = 3001;
app.listen(port, () => {
    console.log("API server is listening on port 3001")
});

