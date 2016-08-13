var express = require('express'),
	app = express(),
	engines = require('consolidate'),
	Mongoclient = require('mongodb').MongoClient,
	assert = require('assert'),
	bodyParser =  require('body-parser');
app.engine('html',engines.nunjucks);
app.set('view engine','html');
app.set('views',__dirname + '/views');
app.use(bodyParser.urlencoded({extended:true}));

Mongoclient.connect('mongodb://localhost:27017/video',function(err,db){
	assert.equal(null,err);
	function errorHandler(err,req,res,next){
	console.error(err.stack);
	console.error(err.message);
	res.status(500).render('/error_tempalte',{'error':err});
	}
	app.get('/',function(req,res){
		db.collection('movies').find({}).toArray(function(error,docs){
			res.render('movies_final',{'movies':docs});
		});
	});
	app.get('/contact_us',function(req,res){
		res.status(200).render('contact');
	});
	app.post('/contact_us',function(req,res){
		var username = req.body.username;
		var location = req.body.location;
		var suggestion = req.body.sug;
		console.log(suggestion);
		var obj={'username':username,'location':location,'suggestion':suggestion};
		console.log(obj);
		db.collection('suggestions').insertOne(obj,function(err,result){
			console.log("inserted"+result);
		});
		res.status(200).render('contact');
	});
	app.use(errorHandler);
	var server = app.listen(4000,function(){
		var port = server.address().port;
		console.log("Server running on port:"+port);
	});
});