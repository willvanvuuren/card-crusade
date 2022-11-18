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

// place to store variable needed by multiple pages
 user = {
  user_id: undefined,
  username: undefined,
  email: undefined,
  password: undefined,
  wins: undefined,
  losses: undefined,
  icon: undefined,
};

//user.username="Janek"; //need to set this at login, used to update username/password in profile


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
  user.username=req.body.username;
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

app.get('/home', (req,res) => {
  res.render("pages/home");
});

app.get("/game", (req, res) => {
  //req.session.destroy();
  //add Logged out Successfully message 
  res.render("pages/game");
}); 


app.get('/profile', async(req, res) =>{
  //username = "Geri"; //need to read this in from login
  username=user.username; //need this from login
  const query = "SELECT * FROM users ORDER BY wins DESC"; 
  
  db.any(query, [])
    .then(async (data) => {
      //console.log(data[0].username); //works
    res.render("pages/profile",{
      data,
      username,  
    });    
    })

    .catch((error) => {
      res.render("pages/profile", {
        error: true,
        message: 'Error'
      })

      });
  });

  app.post('/profile', async (req, res) => {
    //console.log(user.username);
    const hash = await bcrypt.hash(req.body.password, 10);

  if(req.body.username!="" && req.body.password!="")
  {
    var query = `UPDATE users          
                SET username = $1, password = $2
                WHERE users.username = $3
                RETURNING *`;
    db.any(query, [req.body.username, hash, user.username])
    .then(()=>{
      user.username=req.body.username;
      res.redirect('/profile');
    })
    .catch( () =>{
      //add error message
        res.redirect('/profile');
        console.log("post profile error");
    });
  }
  else{
    console.log("please enter both username and password");
   

    const query = "SELECT * FROM users ORDER BY wins DESC"; 
  
    db.any(query, [])
    .then(async (data) => {
      //console.log(data[0].username); //works
    res.render("pages/profile",{
      data,
      username,  
      error: true,
      message: 'Please enter both username and password',
    });    
    })

  }
  });




  app.post('/profile_icon', async (req, res) => {
    //console.log("in profile_icon");
    //console.log(req.body.selectpicker);
    //update link in database

    var query = `UPDATE users          
    SET icon = $1
    WHERE users.username = $2
    RETURNING *`;
    db.any(query, [req.body.selectpicker, user.username])
      .then(()=>{
        res.redirect('/profile');
    })
      .catch( () =>{
      //add error message
      res.redirect('/profile');
      console.log("post profile error");
    });



  });

  app.get("/logout", (req, res) => {
    //req.session.destroy();
    //add Logged out Successfully message 
    res.render("pages/logout");
  }); 



