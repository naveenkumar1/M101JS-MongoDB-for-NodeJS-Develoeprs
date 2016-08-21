var MongoClient =  require('mongodb').MongoClient,
	assert = require('assert'),
	commmandLineArgs = require('command-line-args');
var options = commandLineOptions();
MongoClient.connect("mongodb://localhost:27017/m101",function(err,db){
	assert.equal(err,null);
	var query = getQueryConstructor(options);
	var projection = {'_id':0,'name':1,"founded_year":1,"number_of_employees":1,"ipo":1,"offices.country_code":1}
	var cursor = db.collection('companies').find(query)
	cursor.project(projection)
	var numCount=0;
	cursor.forEach(function(doc){
		console.log(doc);
		numCount = numCount + 1;
	},function(err){
		assert.equal(err,null);
		console.log("Matching documents "+numCount);
		console.log("Constructed query " + JSON.stringify(query));
		return db.close();
	});
});
function getQueryConstructor(options){
	console.log(options);
	var query ={
		"founded_year":{
			"$gte":options.firstYear,
			"$lte":options.lastYear
		}
	}
		if("employees" in  options){
			query.number_of_employees={"$gte":options.employees}
		}
		if("ipo" in options){
			if(options.ipo=="yes"){
				query["ipo.valuation_amount"]={"$exists":true,"$ne":null}
			}else{
				query["ipo.valuation_amount"]=null;
			}
			}
		if("country" in options){
			query["offices.country_code"] = options.country
		}	
	return query;
}
function commandLineOptions(){
	var cli = commmandLineArgs([
		{name:"firstYear",alias:"f",type:Number},
		{name:"lastYear",alias:"l",type:Number},
		{name:"employees",alias:"e",type:Number},
		{name:"ipo",alias:"i",type:String},
		{name:"country",alias:"c",type:String}
		]);
	var options = cli.parse();
	if(!(('firstYear' in options)&&('lastYear' in options))){
		console.log(cli.getUsage({
			type:'Usage',
			description:"The first two options are mandatory"
		}));
		process.exit();
	}
	return options;
}