const express = require('express')
const app = express();
var cors = require('cors')
const mongoose = require('mongoose');
const PORT =  5001;
app.use(cors({
  origin: "http://localhost:3000", credentials: true
}))
app.use(express.json()); //for understanding json data
app.use(require('./router/auth'));

mongoose
  .connect("mongodb://localhost:27017/thapamern", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => app.listen(PORT, () => console.log(`Server runing at ${PORT}`)))
  .catch(error => console.log('error'));
