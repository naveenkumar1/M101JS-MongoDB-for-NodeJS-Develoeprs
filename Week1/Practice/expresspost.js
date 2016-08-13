var express = require('express'),
	app = express(),
	engines = require('consolidate');
	bodyParser = require('body-parser');

app.engine('html',engines.nunjucks);
app.set('view engine','html');
app.set('views',__dirname+'/views');
app.use(bodyParser.urlencoded({extended:true}));

function errorHandler(err,req,res,next){
	console.error(err.stack);
	console.error(err.message);
	res.status(500).render('error_tempalte',{'error':err});
}
app.get('/fruits',function(req,res){
	res.render('fruits',{'fruits':["orange","peach","banana","strawbery"]});
});
app.post('/fruit_template',function(req,res,next){
	var favourite = req.body.fruit;
	if(typeof favourite == 'undefined'){
		next('Error please select any input');
	}
	else{
		res.send("you have a selected a favourite"+favourite);
	}
});
app.use(errorHandler);
var server = app.listen(3000,function(){
	var port = server.address().port;
	console.log("Application listening on port %s",port);
});
