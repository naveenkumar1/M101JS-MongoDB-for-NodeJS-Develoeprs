var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/video', function (error,db){
	assert.equal(null,error);
	console.log("opening the connection for mongodb");
	db.collection('movies').find({}).toArray( function (err,docs){
		docs.forEach(function(doc){
			console.log(doc);
		});
		db.close();
	});
	console.log("called find() method");
});