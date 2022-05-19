const route = require('express').Router();
const {
  mulaiKonsultasi,
  konsultasi,
  getKonsultasiById,
  getAllkonsultasi,
  ubahStatusKonsultasi,
} = require('../controllers/konsultasi');

route.post('/mulai', mulaiKonsultasi);
route.post('/percakapan', konsultasi);
route.get('/byid', getKonsultasiById);
route.get('/all', getAllkonsultasi);
route.get('/updateStatus', ubahStatusKonsultasi);

module.exports = route;