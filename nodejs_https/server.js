var http = require("http");
	
function start() {
  function onRequest(request, response) {
    console.log("Request received.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Trabalho MPCA teste - deploy de aplicacao");
    response.end();
  }

  http.createServer(onRequest).listen(process.env.PORT || 5000);
  console.log("Server has started.");
}

exports.start = start;
