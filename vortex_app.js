var createError = require('http-errors');
var express = require('express');

var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('./config/config')
const jwt = require('jsonwebtoken')
var cors = require('cors');
var bodyParser=require('body-parser')

app.use(bodyParser.json({limit:'10000mb'}));
app.use(bodyParser.urlencoded({
    parameterLimit: 1000000,
    limit: '1000mb',
    extended: true
  }));

var mongoose=require('mongoose')
mongoose.connect(config.dburl,{ useNewUrlParser: true }).then((sucess)=>{
    console.log('mongo db connected sucessfully')
    
},(err)=>{
    console.log("monodb connecttion err")
})
var indexRouter = require('./routes/Api/index');
var usersRouter = require('./routes/Api/users');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(5004, () => console.log(`Example app listening on port 5004!`))
// module.exports = app;
