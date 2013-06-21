// Cliente MongoDb
var MongoClient = require('mongodb').MongoClient, format = require('util').format;

// Vari�veis de conex�o
var user = 'abilio';
var password = 'abilio';
var host = 'ds029658.mongolab.com';
var port = 29658;
var app = 'heroku_app16170404';
var DatabaseUrl = format("mongodb://%s:%s@%s:%s/%s", user, password, host, port, app);

// Conex�o � base de dados
MongoClient.connect(DatabaseUrl, function(err, db) {

  // Tratamento de erro
  if(err) throw err;
  
  // Acesso � cole��o mpca2
  var collection = db.collection('mpca2');

  // Enumera��o das regi�es inseridas na base de dados
  collection.distinct('regiao', function(err, docs) { 
	
	// Exibe cada item do array resultante
	docs.forEach(function(item) {
      console.log(item);
    });
	
	// Encerra a conex�o com o banco
	db.close();
	
  });		  
  
})