const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const expressValidator = require('express-validator');

var loginC = require('./controllers/loginC');
var hangC = require('./controllers/hangC');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(expressValidator());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


app.use(function(req, res, next) {
  var pathname = parseurl(req).pathname;
  if(!req.session.user &&  pathname != '/login') {
    res.redirect('/login');
  } else {
    next();
  }
});


app.get('/', function(req, res) {
  res.send('wsdafsadf');
});


app.get('/login', loginC.renderLogin);
app.get('/hang', hangC.renderHang);
app.post('/login', loginC.postLogin);
app.post('/hang', hangC.enterLetters);


app.listen(3000, function(){
  console.log('Successfully started express application!');
});
