const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');

// database configuration
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  };
  
  const db = pgp(dbConfig);
  
  // test your database
  db.connect()
    .then(obj => {
      console.log('Database connection successful'); // you can view this message in the docker compose logs
      obj.done(); // success, release the connection;
    })
    .catch(error => {
      console.log('ERROR:', error.message || error);
    });

    //set view engine to EJS
    app.set('view engine', 'ejs');

    //specify JSON for parsing request body
    app.use(bodyParser.json());

    //initialize session variables
    app.use(
        session({
          secret: process.env.SESSION_SECRET,
          saveUninitialized: false,
          resave: false,
        })
      );
      
      app.use(
        bodyParser.urlencoded({
          extended: true,
        })
      );

      //set port for server to listen for client requests
      app.listen(3000);
      console.log('Server is listening on port 3000');

      app.get('/profile', (req, res) =>{
        res.render("pages/profile"); 
      });