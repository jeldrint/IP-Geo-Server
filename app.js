const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const session = require('express-session')

const indexRoute = require('./routes/index');
const passport = require('passport');
const LocalStrat = require('passport-local').Strategy;

//ENV
require('dotenv').config();

//Pool
const pool = new Pool ({
    connectionString: process.env.DATABASE_URL
})

const app = express();

//PASSPORT LOCAL
passport.use(
    new LocalStrat(async(username, password, done) => {
        //console.log(username, password)
        try{
            const { rows } = await pool.query("SELECT * FROM \"Users\" WHERE username = $1", [username])
            const user = rows[0];

            if(!user){
                return done(null, false, { message: "Incorrect username"});
            }
            if(user.password !== password){
                return done(null, false, {message: "Incorrect Password"})
            }
            return done(null, user);
        }catch(error){
            return done(err);
        }
    })
)

passport.serializeUser((user, done) => {
    done(null,user.id);
})

passport.deserializeUser((async (id, done)=> {
    try{
        const { rows } = await pool.query("SELECT * FROM \"Users\" WHERE id = $1", [id])
        const user = rows[0];

        done(null,user);
    }catch(error){
        done(error);
    }
}))

//MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// PASSPORT AND EXPRESS SESSION MIDDLEWARES
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }))
app.use(passport.session());

//ROUTES
app.use('/', indexRoute);

// PORT CONNECT
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => console.log(`server running on port ${port}`)); 