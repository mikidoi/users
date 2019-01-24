// Transpile all code following this line with babel
require('babel-register')({
  presets: ['env']
});

module.exports = require('./server.js');
