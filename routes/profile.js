var express = require('express');
var router = express.Router();

router.use((req, res, next) =>{
    if(req.user){
        console.log(`autenticado ${req.user.name} ${req.user.lastname}`);
        next();
    }else{
        res.redirect('/auth/login');
    }
})

router.get('/', (req, res) => {
    const user = req.user;
    console.log(user);
    const loginInfo = req.logMethod;
    res.render('profile', {user, loginInfo});
});

module.exports = router;