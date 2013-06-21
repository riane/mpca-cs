// Cliente MongoDb
var MongoClient = require('mongodb').MongoClient, format = require('util').format;

// Variáveis de conexão
var user = 'abilio';
var password = 'abilio';
var host = 'ds029658.mongolab.com';
var port = 29658;
var app = 'heroku_app16170404';
var DatabaseUrl = format("mongodb://%s:%s@%s:%s/%s", user, password, host, port, app);

// Conexão à base de dados
MongoClient.connect(DatabaseUrl, function(err, db) {

  // Tratamento de erro
  if(err) throw err;
  
  // Acesso à coleção mpca2
  var collection = db.collection('mpca2');
  
  // A UF default é "BA"
  var param = "BA";

  var res = "";		  
  
  // Enumeração das cidades inseridas na base de dados que pertençam à UF passada como parâmetro
  var aux = collection.find({'estado':param}, {_id:0, codMunicipio:1, 'municipio.nome':1}).sort({'municipio.nome':1}).each(function(err, docs) {

	if(docs != null) res = res.concat(docs.codMunicipio, ";", docs.municipio.nome, "\n");
	else console.log (res);
	
	// Encerra a conexão com o banco
	db.close();
	
  });		    
  
})