var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');

MongoClient.connect("mongodb://localhost:27017/m101",function(error,db){
		assert.equal(null,error);
		query ={"category_code":"biotech"}
		db.collection('companies').find(query).toArray(function(err,docs){
				assert.equal(err,null);
				assert.notEqual(docs.length,0);
				docs.forEach(function(doc){
					console.log(doc.name+"is a"+doc.category_code+"company");
				});
				db.close();
			});
	});