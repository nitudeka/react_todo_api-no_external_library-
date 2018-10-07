const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('./lib/helpers');
const handlers = require('./lib/handlers');
const config = require('./lib/config');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');
  const queryStringObject = parsedUrl.query;
  const headers = req.headers;
  const method = req.method.toLowerCase();

  const decoder = new StringDecoder('utf8');
  let stream = '';
  req.on('data', (chunk) => {
    stream += decoder.write(chunk);
  });
  req.on('end', () => {
    stream += decoder.end();
    const dataObject = helpers.parseJsonToObject(stream);

    const data = {
      headers,
      method,
      queryStringObject,
      path: trimmedPath,
      payload: dataObject
    }
    
    const choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    choosenHandler(data, (statusCode, payload) => {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = typeof(payload) == 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader('content-type', 'application/json')
      res.writeHead(statusCode);
      res.end(payloadString);
    })
  })
})

const router = {
  register: handlers.register,
  login: handlers.login
}

server.listen(config.port, () => {
  console.log(`server is listening on port ${config.port}`);
})
