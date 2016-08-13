var express =  require('express');
var app = express();
var engine = require('consolidate');
app.engine('html',engine.nunjucks);
app.set('view engine','html');
app.set('views',__dirname +'/views');

app.get('/',function(req,res){
	res.render('helloworld',{'name':"naveen"});
});
app.use(function(req,res){
	res.sendStatus(404);
});
var server = app.listen(3000,function(){
	var port = server.address().port;
	console.log("Server running on port %s",port);
});