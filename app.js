const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./src/routes/index')(app);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    console.log('Connected to database.');
    app.listen(process.env.PORT, () => {
        console.log(`Server initialized. Try it on http://localhost:${process.env.PORT}`);
    });
});



