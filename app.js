const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
})