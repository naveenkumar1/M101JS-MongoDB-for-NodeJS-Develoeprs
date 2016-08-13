var express = require('express'),
	app = express(),
	engines = require('consolidate'),
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
app.engine('html',engines.nunjucks);
app.set('view engine','html');
app.set('views',__dirname+'/views');
MongoClient.connect('mongodb://localhost:27017/video',function(error,db){
	assert.equal(null,error);
	console.log("connection opened for transactions");
	app.get('/',function(req,res){
		db.collection('movies').find({}).toArray(function(error,docs){
			res.render('movies',{'movies':docs})
		});
	});
	app.use(function(req,res){
		res.sendStatus(404);
	});
	var server = app.listen(4000,function(){
		var port = server.address().port;
		console.log("application started running on server port %s",port);
	});
});