// server.js
const express = require('express');
const next = require('next');
const https = require('https');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '192.168.1.53'; 
//192.168.1.237
const PORT = process.env.PORT || 80;
const app = next({ dev,hostname,PORT });
const handle = app.getRequestHandler();



// HTTPS Configuration
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.crt')),
};
const keyPath = path.join(__dirname, 'cert.key');
const certPath = path.join(__dirname, 'cert.crt');
console.log('SSL Key Path:', keyPath);
console.log('SSL Cert Path:', certPath);

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start HTTPS Server
  const httpsServer = require('https').createServer(httpsOptions, server);
  httpsServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on https:${hostname}:${PORT}`);
  });
});
