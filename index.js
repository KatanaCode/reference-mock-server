if (!process.env.DEBUG) process.env.DEBUG = 'error,log';

const securedPort = (process.env.SECURED_PORT || 4433);
const https = require('https');

const { initApp } = require('./lib');

const serverCert = Buffer.from(process.env.SERVER_CERT || '', 'base64').toString();
const serverKey = Buffer.from(process.env.SERVER_KEY || '', 'base64').toString();
const caCert = Buffer.from(process.env.CA_CERT || '', 'base64').toString();

const options = {
  key: serverKey,
  cert: serverCert,
  ca: caCert,
  requestCert: true,
  rejectUnauthorized: true,
};

initApp((app) => {
  https.createServer(options, app).listen(securedPort);
});
