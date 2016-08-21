var MongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	commandLineArgs = require('command-line-args');
var options = commandLineOptions();
MongoClient.connect("mongodb://localhost:27017/m101",function(error,db){
	assert.equal(error,null);
	var query = queryConstructor(options);
	var projection = projectionConstructor(options);
	var cursor = db.collection('companies').find(query);
	cursor.project(projection);
	var numCount=0;
	cursor.forEach(function(doc){
		numCount =numCount+1
		console.log(doc);
	},function(err){
		assert.equal(err,null);
		console.log("Count of documents"+numCount);
		console.log('THe query that is constructed'+JSON.stringify(query));
		return db.close();
	});
});
function projectionConstructor(options){
	var projection ={
		"_id":0,
		"name":1,
		"founded_year":1
	}
	if("overview" in options){
		projection.overview =1;
	}
	if("milestones" in options){
		projection["milestones.source_description"] =1;
	}
	return projection;
}
function queryConstructor(options){
	var query={};
	if("overview" in options){
		query.overview ={"$regex":options.overview,"$options":"i"};
	}
	if("milestones" in  options){
		query["milestones.source_description"] ={"$regex":options.milestones,"$options":"i"}
	}
	return query;
}
function commandLineOptions(){
	var cli = commandLineArgs([
		{name:"overview",alias:"o",type:String},
		{name:"milestones",alias:"m",type:String}
		]);
	var options = cli.parse();
	if(Object.keys(options).length<1){
		console.log(cli.getUsage({
		title : "Usage",
		description : "You have to enter atleast one option to facilitate search efficiently"
	}));
		process.exit();
	};
	return options;
}