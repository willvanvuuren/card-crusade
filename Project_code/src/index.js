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

app.get('/login', (req,res) => {
  res.render("pages/login");
});

app.get('/register', (req,res) => {
  res.render("pages/register");
});

app.post('/register', async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  var query = 'SELECT username FROM users WHERE username=$1;';
  db.any(query, [req.body.username])
  .then(function (rows) {
    if (rows.length != 0){
      console.log('Duplicate username');
      throw new Error('This username is already taken');
    }
    else {
      var query = 'INSERT INTO users (username, email, password, wins, losses) VALUES ($1, $2, $3, $4, $5);';
      db.any(query, [req.body.username, req.body.email, hash, 0, 0])
      .then(function (rows) {
          res.redirect('/login');
      }
     )
      .catch(function (err) {
          res.redirect('/register');
      })
    }
  })
  .catch(function (err) {
    res.render("pages/register", {
      error: true,
      message: err
    })
  });
});

app.post('/login', async (req,res) => {
  const query = 'SELECT password FROM users WHERE username=$1;';
  db.any(query, [req.body.username])
      .then(async (data) => {
          console.log(data[0].password);
          const match = await bcrypt.compare(req.body.password, data[0].password);
          console.log(match);
          if (match){
              req.session.user = {
                  api_key: process.env.API_KEY,
              };
              req.session.save();
              res.redirect('/home');
          }  
          else {
              console.log("Incorrect username or password");
              throw new Error(`Incorrect username or password`);
          }
      })
      .catch((error) => {
          res.render("pages/login", {
            error: true,
            message: 'Incorrect username or password'
          })

      });
});

// Authentication middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

app.get('/', (req,res) => {
  res.render("pages/login");
});


//set port for server to listen for client requests
app.listen(3000);
console.log('Server is listening on port 3000');

app.get('/profile', (req, res) =>{
  res.render("pages/profile"); 
});
