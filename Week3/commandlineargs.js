var MongoClient = require('mongodb').MongoClient,
	commandLineArgs = require('command-line-args'),
	assert = require('assert');
var options = commandLineOptions();
MongoClient.connect("mongodb://localhost:27017/m101",function(error,db){
	assert.equal(error,null);
	var query = queryConstructor(options);
	var projection ={"_id":0,"name":1,"founded_year":1,"number_of_employees":1,"crunchbase_url":1};
	var cursor = db.collection('companies').find(query,projection);
	var numMatches =0;
	cursor.forEach(function(doc){
		console.log(doc);
		numMatches = numMatches +1;
	},
	function(err){
		assert.equal(null,err);
		console.log("Our query is"+JSON.stringify(query));
		console.log("Matching Documents"+numMatches);
	});
});
function queryConstructor(options){
	var query = {
		"founded_year" :{
			"$gte":options.firstYear,
			"$lte":options.lastYear
		} 
	};
	if("employees" in options){
		query.number_of_employees = {"$gte":options.employees}
	}
	return query;
}
function commandLineOptions(){
	var cli = commandLineArgs(
	[{name:"firstYear",alias:"f",type:Number},
	{name:"lastYear",alias:"l",type:Number},
	{name:"employees",alias:"e",type:Number}]);
	var options = cli.parse()
	if (!(("firstYear" in options)&&("lastYear" in options))){
		console.log(cli.getUsage({
			title:"Usage",
			description:"THe first two options are mandatory"
		}));
		process.exit();
	}
	return options;
}
