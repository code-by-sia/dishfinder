var express = require("express"),
    app = express(),
    port= process.env.PORT || 3000,
    api = require('./api.js'),
    path= require('path'),
    db = require('sqlite'),
    appDb = require('./db.js'),
    cookieParser= require("cookie-parser"),
    bodyParser= require("body-parser");


const dbPath=path.join(__dirname,"data.sqlite");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var publicDir = path.join(__dirname,'../client/public');

const expressStatic = express.static(publicDir);

app.use('/',expressStatic);
app.use('/public',expressStatic);
app.use('/search/:location/:subject',expressStatic);
app.use('/item/:id',expressStatic);

api.routes(app,db);

app.route('/about').all(function(req,res){
  res.send('Designed and developed by Siamand Maroufi');
});

Promise.resolve()
  .then(() => db.open(dbPath, { Promise }))
  .catch(err => console.error(err.stack))
  .then(() => app.listen(port,function(){
      try{
        appDb.updateDataBase(db);
      }catch(exception){

      }
      console.log(`server listening at localhost:${port}`);
    })
  );
