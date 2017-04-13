var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//AES256 Crypto Functions
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'RANDOMKEY';

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

//Connect to Database
mongoose.connection.on('open', function(ref) {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function(err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});
mongoose.connect('mongodb://localhost/30seconds');

//User Schema
var Schema = mongoose.Schema;
var UserDetail = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    password: String,
    type: String
}, {
    collection: 'userInfo'
});
var UserDetails = mongoose.model('userInfo', UserDetail);

var app = express();

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//Handle User Sessions
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

//Verify Login with User Schema
passport.use(new LocalStrategy(
    function(username, password, done) {
        process.nextTick(function() {
            UserDetails.findOne({
                    'username': username
                },
                function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                      console.log("user not found!");
                        return done(null, false);
                    }
                    if (user.password != encrypt(password)) {
                        return done(null, false);
                    }
                    return done(null, user);
                });
        });
    }
));

app.use('/', index);
app.use('/users', users);

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/'); //Can fire before session is destroyed?
});

app.post('/auth',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(500).send({
        error: 'Something failed!'
    })
});

//Create Server Instance on Defined Port
var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
