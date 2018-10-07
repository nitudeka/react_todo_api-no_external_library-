// Node dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('./lib/helpers');
const handlers = require('./lib/handlers');
const config = require('./lib/config');

// Initialize the http server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');
  const queryStringObject = parsedUrl.query;
  const headers = req.headers;
  const method = req.method.toLowerCase();

  // Decode the payload to utf8
  const decoder = new StringDecoder('utf8');
  let stream = '';
  req.on('data', (chunk) => {
    stream += decoder.write(chunk);
  });
  req.on('end', () => {
    stream += decoder.end();
    // Convert JSON to javascript object
    const dataObject = helpers.parseJsonToObject(stream);

    // Data that have to sent to the handlers
    const data = {
      headers,
      method,
      queryStringObject,
      path: trimmedPath,
      payload: dataObject
    }
    
    // Chose the handler the request should go to, route to not-found if nothing matches
    const choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    choosenHandler(data, (statusCode, payload) => {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = typeof(payload) == 'object' ? payload : {};

      // Conver the payload to JSON that have to send to the client
      const payloadString = JSON.stringify(payload);

      res.setHeader('content-type', 'application/json')
      res.writeHead(statusCode);
      res.end(payloadString);
    })
  })
})

// Acceptable routes
const router = {
  register: handlers.register,
  login: handlers.login
}

// Start the server
server.listen(config.port, () => {
  console.log(`server is listening on port ${config.port}`);
})
