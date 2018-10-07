const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');
  const headers = req.headers;
  const method = req.method.toLowerCase();

  let stream = '';
  req.on('data', (chunk) => {
    stream += chunk;
  });
  req.on('end', () => {
    console.log(method);
    res.end('heyy!!!\n');
  })
})

server.listen(3001, () => {
  console.log('server is listening on port 3001');
})
