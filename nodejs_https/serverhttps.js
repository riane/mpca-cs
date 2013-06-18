var https = require('https');
var fs = require('fs');


var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

function start() {
	var a = https.createServer(options, function (req, res) {
	  console.log("Requisicao Recebida");
	  res.writeHead(200);
	  res.end("Testando server https:");
	}).listen(process.env.PORT || 5000);
}


console.log("Servidor iniciado");

exports.start = start;
