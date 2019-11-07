/* eslint-disable no-console */
const express = require('express');

let port = process.env.PORT || 5000;
let app = express();

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
