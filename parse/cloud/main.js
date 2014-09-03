
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

s = require('express');
var app = express();
 
// Global app configuration section
app.use(express.bodyParser());  // Populate req.body
 
app.post('/notify_message',
         express.basicAuth('YOUR_USERNAME', 'YOUR_PASSWORD'),
         function(req, res) {
  // Use Parse JavaScript SDK to create a new message and save it.
  var Message = Parse.Object.extend("Message");
  var message = new Message();
  message.save({ text: req.body.text }).then(function(message) {
    res.send('Success');
  }, function(error) {
    res.status(500);
    res.send('Error');
  });
});
 
app.listen();

/*
The above code uses the express.bodyParser middleware to read request body and populate req.body.text. Note that we didn't write app.use(express.basicAuth(…)) in the global app configuration section because we want HTTP basic auth for this endpoint only, instead of for all endpoints globally. This way, we could have other endpoints in this app that are publicly accessible.

To test the custom endpoint, you could run the following command to send an request containing a form-encoded body.

$ curl -X POST \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'text=hi'
    http://YOUR_USERNAME:YOUR_PASSWORD@example.parseapp.com
If you want to access the request body's raw bytes, you should use the parseExpressRawBody middleware in your code instead of express.bodyParser. It's also okay to include both middleware components if some of your request handlers need JSON or www-form-encoded parsing, while others need the request body bytes.
*/
/*
var express = require('express');
var parseExpressRawBody = require('parse-express-raw-body');
var app = express();

// Global app configuration section
app.use(express.bodyParser());
app.use(parseExpressRawBody());
 
app.post('/receive_raw_data',
         express.basicAuth('YOUR_USERNAME', 'YOUR_PASSWORD'),
         function(req, res) {
  // If you send this endpoint JSON or www-form-encoded data, then
  // express.bodyParser will fill req.body with the corresponding data.
  // Otherwise, parseExpressRawBody will fill req.body with a Buffer
  // object containing the request body.  You can also convert this
  // Buffer to a string using req.body.toString().
});
 
app.listen();
*/
