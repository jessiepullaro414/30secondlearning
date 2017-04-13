var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user) {
      console.log("Logged in!");
        res.render('pages/index', {
            title: 'Express',
            login: true
        });
    } else {
        res.render('pages/index', {
            title: 'Express',
            login: false
        });

    }
});

router.get('/aboutus', function(req, res, next) {
    if (req.user) {
        res.render('pages/aboutus', {
            title: 'Express',
            login: true
        });

    } else {
        res.render('pages/aboutus', {
            title: 'Express',
            login: false
        });
    }
});

module.exports = router;
