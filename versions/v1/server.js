const port = 3000;
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/src'));

app.listen('3000');
console.log("app working on port 3000");