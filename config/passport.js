const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {
    Pool
} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'mysecretpassword',
    port: 5432,
})

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(async function (user, done) {
    const findUser = await pool.query('select * from users where googleid = $1', [user.id]);
    if (findUser.rows.length == 1) {
        done(null, findUser.rows[0]);
    } else {
        const {
            sub,
            given_name,
            family_name,
            picture,
            email
        } = req.user._json;
        const timestamp = `${Date.now()}`;
        const data = [timestamp, sub, given_name, family_name, email, picture];
        const newuser = await pool.query('insert into users (timestamp, googleid, name, lastname, email, img) values ($1,$2,$3,$4,$5,$6) returning *', data);
        done(null, newuser.rows[0]);
    }
});

passport.use(
    new GoogleStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        function (accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    )
);