var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
MongoClient.connect('mongodb://localhost:27017/m101',function(err,db){
	assert.equal(null,err);
	query = {'category_code':'biotech'}
	projection ={'name':1,'category_code':1,'_id':0}
	var cursor = db.collection('companies').find(query)
	cursor.project(projection)
	cursor.forEach(function(doc){
		console.log(doc.name+" is a "+doc.category_code+" company");
		console.log(doc);
	},function(err){
		assert.equal(err,null)
		return db.close();
	});
});