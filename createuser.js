//Module dependencies.
var mongoose = require('mongoose');

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

//Prompt User and Enter into MongoDb
function prompt(question, callback) {
    var stdin = process.stdin,
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function(data) {
        callback(data.toString().trim());
    });
}

//End Process
function quit() {
    console.log("bye!");
}

//Promt User for Credentials to add
var usrName = "";
var pass = "";
prompt('Enter Email:', function(input) {
    usrName = input;
    prompt('Enter Password:', function(input) {
        pass = encrypt(input);
        var newUser = new UserDetails({
            username: usrName,
            firstName: "Admin",
            lastName: "Admin",
            password: pass,
            type: 'user'
        });
        newUser.save(function(err, newUser) {
            if (err) return console.error(err);
        });
        console.log("Adding " + usrName + "...");
        setTimeout(function() {
            console.log("User Added!");
            process.exit();
        }, 3000);
    });
});
