// Cliente MongoDb
var MongoClient = require('mongodb').MongoClient, format = require('util').format;

// Variáveis de conexão
var user = 'abilio';
var password = 'abilio';
var host = 'ds029658.mongolab.com';
var port = 29658;
var app = 'heroku_app16170404';
var DatabaseUrl = format("mongodb://%s:%s@%s:%s/%s", user, password, host, port, app);

// Formata valores monetários
function formatReal( int )
{
        var tmp = int+'';
        var neg = false;
        if(tmp.indexOf("-") == 0)
        {
            neg = true;
            tmp = tmp.replace("-","");
        }
        
        if(tmp.length == 1) tmp = "0"+tmp
    
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        
        if( tmp.length > 9)
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2,$3");
    
        if( tmp.length > 12)
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2.$3,$4");
        
        if(tmp.indexOf(".") == 0) tmp = tmp.replace(".","");
        if(tmp.indexOf(",") == 0) tmp = tmp.replace(",","0,");
    
    return (neg ? '-'+tmp : tmp);
}

// Formata quantidades
function formatQuant( int )
{
        var tmp = int+'00';
        var neg = false;
        if(tmp.indexOf("-") == 0)
        {
            neg = true;
            tmp = tmp.replace("-","");
        }
        
        if(tmp.length == 1) tmp = "0"+tmp
    
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        
        if( tmp.length > 9)
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2,$3");
    
        if( tmp.length > 12)
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2.$3,$4");
        
        if(tmp.indexOf(".") == 0) tmp = tmp.replace(".","");
        if(tmp.indexOf(",") == 0) tmp = tmp.replace(",","0,");
		tmp = tmp.replace(",00","");
    
    return (neg ? '-'+tmp : tmp);
}

// Conexão à base de dados
MongoClient.connect(DatabaseUrl, function(err, db) {

  // Tratamento de erro
  if(err) throw err;
  
  // Acesso à coleção mpca2
  var collection = db.collection('mpca2');
  
  // A região default é "NE"
  var param = "NE";

  var res = "";
  var index = 0;
  var custog1 = 0;
  var custog2 = 0;
  var custog3 = 0;
  // Enumeração das UFs inseridas na base de dados que pertençam à região passada como parâmetro
  collection.distinct('estado', {'regiao':param}, function(err, docs) { 
	
	// Exibe cada item do array resultante
	docs.forEach(function(item) {
	  
	  // Grupo 1: Qtd jovens beneficiarios Bolsa Familia 15-24 anos nas capitais
	  var g1 = 0;
	  collection.find({'estado':item, 'municipio.capital':'S'}, {_id:0, qtd15a17anos:1, qtd18a24anos:1}).each(function(err, capital) {
		if(capital != null) g1 += capital.qtd15a17anos + capital.qtd18a24anos;
		else {
			
			  // Grupo 2: Qtd beneficiarios Bolsa Familia qq idade cidades < 30.000 habitantes Norte/Nordeste CRAS/CREAS Banda Larga
			  var g2 = 0;
			  collection.find({'estado':item, 'municipio.populacao':{$lt: 30000}, $or: [{'regiao':'NE'}, {'regiao':'N'}], $or: [{'qtdCras.comInternet':{$gt: 0}}, {'qtdCreas.comInternet':{$gt: 0}}]}, {_id:0, qtdQualquerIdade:1}).each(function(err, cidade) {
				if(cidade != null) g2 += cidade.qtdQualquerIdade;
				else {
					
					// Grupo 3: Qtd meninas beneficiarias Bolsa Familia 15-24 anos cidades > 200.000 habitantes
					var g3 = 0;
					collection.find({'estado':item, 'municipio.populacao':{$gt: 200000}}, {_id:0, qtdSexoFemininoDe15a24Anos:1}).each(function(err, vila) {
					  if(vila != null) g3 += vila.qtdSexoFemininoDe15a24Anos;
					  else {
					  
					    // Calcula o custo anual para cada grupo de público alvo
						if (param == "N") {
							custog1 += g1 * 138 * 150;
							custog2 += g2 * 138 * 150;
							custog3 += g3 * 138 * 150;
						}
						else {
							custog1 += g1 * 117 * 150;
							custog2 += g2 * 117 * 150;
							custog3 += g3 * 117 * 150;
						}
					  
                        // Exige a regiao e a qtd beneficiarios dos grupos g1, g2 e g3 e o custo
						index++;
						res = res.concat(item, ";", formatQuant(g1), ";", formatQuant(g2), ";", formatQuant(g3));
						if(index==docs.length) {
							res = res.concat("@", formatReal(custog1), ";", formatReal(custog1));
							res = res.concat(";", formatReal(custog2), ";", formatReal(custog2));
							res = res.concat(";", formatReal(custog3), ";", formatReal(custog3));
							res = res.concat(";", formatReal(2*custog1), ";", formatReal(2*custog2), ";", formatReal(2*custog3));
							console.log (res);
						}
						else {
							res = res.concat("|");
						}
						
					  }
					});					
 
				}
			  });
			
		}
	  });	  
	  
	  
    });
	
  });		
    
})