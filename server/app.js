const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();
const router = require('./router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

router(app);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));