// at top of server.js
import apiRouter from './router';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
// import mongoose from 'mongoose';

// initialize
const app = express();

// DB Setup
// TODO: Setup firebase

// enable/disable cross origin resource sharing if necessary
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('static'));
// enables static assets from folder static

// set path
app.set('views', path.join(__dirname, '../app/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());


// REGISTER ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);


// default index route
app.get('/', (req, res) => {
  res.send('error: no auth');
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
