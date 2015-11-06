/**
 * Http server for prototype publish
 */
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/../'));

app.listen(app.get('port'), function() {
	console.log('Server listening on port %s', app.get('port'));
});

