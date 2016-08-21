var MongoClient = require("mongodb").MongoClient,
	assert = require('assert'),
	commandLineArgs = require('command-line-args');
var options = commandLineOptions();
MongoClient.connect("mongodb://localhost:27017/m101",function(err,db){
	assert.equal(err,null);
	projection={"_id":0,"name":1,"employees":1,"founded_year":1,"ipo":1}
	var query = queryConstructor(options);
	var cursor = db.collection('companies').find(query);
	cursor.project(projection);
	var numCount=0;
	cursor.forEach(function(doc){
		numCount = numCount +1;
		console.log(doc);
	},
	function(err){
		assert.equal(err,null);
		console.log("Number of matching documents"+numCount);
		console.log("Query constructed"+JSON.stringify(query));
		return db.close();
	});
});
function queryConstructor(options){
	var query ={
		"founded_year":{
			"$gte":options.firstYear,
			"$lte":options.lastYear
		}
	};
		if("employees" in  options){
			query.employees ={"$gte":options.employees}
		}
		if("ipo" in options){
			if(options.ipo == "yes"){
				query["ipo.valuation_amount"] = {"$exists":true,"$ne":null}
			}
			else{
				query["options.valuation_amount"] = null;
			}
		}
	return query;
}
function commandLineOptions(){
	var cli = commandLineArgs([
		{name:"firstYear",alias:"f",type:Number},
		{name:"lastYear",alias:'l',type:Number},
		{name:"employees",alias:'e',type:Number},
		{name:"ipo",alias:'i',type:String}
		]);
	var options = cli.parse();
	if(!(("firstYear" in  options) &&("lastYear" in  options))){
		console.log(cli.getUsage({
			type:"Usage",
			description:"YOu have to mandatorily  enter the first 2 parameters to facilitate search"
		}));
		process.exit();
	}
	return options;
}