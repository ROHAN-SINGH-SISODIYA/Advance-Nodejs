const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// route/v1
const userRoute = require('./routes/v1/user');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/api/v1', userRoute);

app.use('*', (req, res) => {
  // this will handle all 404
  res.status(404).send({});
});

const PORT = 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
