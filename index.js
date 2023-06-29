require('dotenv').config();
const Server = require('./src/models/server');
const port = process.env.PORT;
const app = new Server( port );

app.listen();