var 	databaseUrl = "mongodb://andrei:andrei@ds029658.mongolab.com:29658/heroku_app16170404"
	collections = ["mpca2"]
	db = require("mongojs").connect(databaseUrl, collections)
	utils = require('utils')
	fs = require('fs')
	nomeArq = "Nordeste_mais_200.000.csv" //nome do arquivo para importar
	lineList = fs.readFileSync(nomeArq).toString().split('\r\n')
	line = null
	contReg = 0
	tempoFim = 0
	tempoGasto = 0
	tempoInicio = Date.now()
	schemaKeyList = ['regiao', 'uf', 'nome', 'codIbge', 'populacao', 'qtdCras', 'qtdCreas', 'total', '15a17', '18a24',
					'meninas', 'ind_capital']; //layout do arquivo de importacao

	line = lineList.shift(); // Faz a leitura do header.

function createDocRecurse (err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    if (lineList.length) {
        line = lineList.shift(); // Faz leitura do arquivo de entrada.
	contReg = contReg + 1;
	line.split(';').forEach(function (entry, i) {
	schemaKeyList[i] = entry;
        });
	db.mpca2.save({codMunicipio: schemaKeyList[3],
			regiao: schemaKeyList[0],
			estado: schemaKeyList[1],
			municipio: {
					nome: schemaKeyList[2].trim(),
					populacao: schemaKeyList[4] * 1,
						capital: schemaKeyList[11]
				},
				qtdCras: {
					comInternet: schemaKeyList[5] * 1,
					semInternet: 0,
				},
				qtdCreas: {
					comInternet: schemaKeyList[6] * 1,
					semInternet: 0,
				},
				qtd15a17anos: schemaKeyList[8] * 1,
				qtd18a24anos: schemaKeyList[9] * 1,
				qtdQualquerIdade: schemaKeyList[7] * 1,
				qtdSexoFemininoDe15a24Anos: schemaKeyList[10] * 1},function(err, saved) {
				if( err || !saved ) {console.log("mpca2 not saved", err);
					process.exit(1);}
				else console.log("mpca2 saved");
				     createDocRecurse(null);
	});
	
    else
	{
	console.log("Fim da importação");
	console.log("Total de registros inseridos =", contReg);
	tempoFim = Date.now();
	tempoGasto = tempoFim - tempoInicio;
	console.log("Tempo gasto em ms=", tempoGasto);
	process.exit(0);
	}
	
}

createDocRecurse(null);
