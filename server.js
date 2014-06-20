//
// Web Administration Server
//

var express = require('express');
var path = require('path');

app = express();
app.set('port', process.env.PORT || 8000);
app.use(express["static"](path.join(__dirname, 'app')));
app.use(express.logger('dev'));
app.use(app.router);

var server = require("http").createServer(app);
server.listen(app.get("port"), function() {
  return console.log("Roboconf Web Management server is listening on port " + app.get("port"));
});
