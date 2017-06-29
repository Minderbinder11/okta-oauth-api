"use strict"
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();
const port = process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, '../client')));
app.use(cookieParser());
app.use(session({
  secret: 'mt tamalpais',
  cookie: { maxAge: 3600000 },
  resave: false,
  saveUninitialized: false
}));

console.log(process.env.TEXT);

app.listen(8000, () => {
  console.log(`listening on port ${port}`)
});