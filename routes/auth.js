var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/login', (req, res) => {
    const loginInfo = req.logMethod;
    res.render('login', {loginInfo});
});

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    async function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/");
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    console.log("session closed");
    res.redirect("/");
});

module.exports = router;