const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const server = require('http').createServer(app)

const {tokenGenerator, makeCall, placeCall, incoming, welcome} = require('./controllers/call.js')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

app.get('/', async (req, res) => {
    try {
      res.send({
        success: true,
        message: 'Backend is running',
      })
    } catch (e) {
      res.send({
        success: false,
        message: 'Error',
      })
    }
  })

app.post('/', (req, res) => {
  try {
    res.send({
      success: true,
      message: welcome(),
    })
  } catch (e) {
    res.send({
      success: false,
      message: 'Error',
    })
  }
})

app.get('/accessToken', function(request, response) {
  tokenGenerator(request, response);
});

app.post('/accessToken', function(request, response) {
  tokenGenerator(request, response);
});

app.get('/makeCall', function(request, response) {
  makeCall(request, response);
});

app.post('/makeCall', function(request, response) {
  makeCall(request, response);
});

app.get('/placeCall', placeCall);

app.post('/placeCall', placeCall);

app.get('/incoming', function(request, response) {
  response.send(incoming());
});

app.post('/incoming', function(request, response) {
  response.send(incoming());
});



server.listen(8080, () => {
  console.log('listening on port ' + 8080)
})