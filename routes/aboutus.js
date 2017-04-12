var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/aboutus', function(req, res, next) {
  res.render('aboutus', { title: 'Express' });
});


module.exports = router;
