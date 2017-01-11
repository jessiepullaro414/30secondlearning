var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8081
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8081);

console.log("Example app listening at http://localhost:8081");
