const express = require('express');
const bodyParser= require('body-parser')
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use("/css",express.static(__dirname + "/css"));
app.use("/assets",express.static(__dirname + "/assets"));

const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId;

var db;

const uri = "mongodb+srv://augusto:L%40ugus66@test-cases-db-oanhd.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  if (err) return console.log(err)
  db = client.db("test-cases-db");
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
});


app.get('/', (req, res) => {
  //console.log('db.collection("testcases").find().toArray()')
  //db.collection('testcases').find().toArray(err,result) )
  //console.log(cursor)
 db.collection('testcases').find().toArray((err,result) => {

    if (err) return console.log(err)
    res.render('index.ejs', {tests: result})
  })
})

app.get('/detailtst?', (req, res) => {
  console.log(req.query['id'])
  db.collection('testcases').findOne({"_id":ObjectId(req.query['id'])},(err,result) => {
     if (err) return console.log(err)
     console.log(result)
     res.render('detailtst.ejs', {test: result})
   })
  //res.render('detailtst.ejs')
})

app.get('/delete?', (req, res) => {
  console.log(req.query['id'])
  db.collection('testcases').deleteOne({"_id":ObjectId(req.query['id'])},(err,result) => {
     if (err) return console.log(err)
     console.log(result)
     res.redirect('/')
   })
  //res.render('detailtst.ejs')
})

app.get('/inputtst', (req, res) => {
  res.render('inputtst.ejs')
})

app.post('/inputtst', (req, res) => {
  db.collection("testcases").insertOne(req.body,(err,result) => {
    if (err)  return console.log(err)
    res.redirect('/')
  })
})
