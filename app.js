require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const logger = require('./src/utils/logger')

const customerRoute = require('./src/modules/customers/customerRoute');
const adminRoute = require('./src/modules/admin/adminRoute');
const { Console } = require("winston/lib/winston/transports");

app.use(cors());

app.get('/', (req, res) => res.status(200).json({
    success: 1,
    message: 'Demo page for server check.',
}));

app.use('/v1/customer', jsonParser, customerRoute);
app.use('/v1/admin', jsonParser, adminRoute);

const port = process.env.APP_PORT || 8081;
app.listen(port, () => {
    console.log("Server up and running on port :", port);
});