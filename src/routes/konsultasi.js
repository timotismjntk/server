const route = require('express').Router();
const {
  mulaiKonsultasi,
  konsultasi,
  getKonsultasiById,
  getAllkonsultasi,
  ubahStatusKonsultasi,
  ubahTotalBelumTerbacaKonsultasi,
  countTotalUnreadedKonsultasi,
} = require('../controllers/konsultasi');

route.post('/mulai', mulaiKonsultasi);
route.post('/percakapan', konsultasi);
route.get('/byid', getKonsultasiById);
route.get('/all', getAllkonsultasi);
route.get('/updateStatus', ubahStatusKonsultasi);
route.get('/ubahTotalBelumTerbacaKonsultasi', ubahTotalBelumTerbacaKonsultasi);
route.get('/countTotalUnreadedKonsultasi', countTotalUnreadedKonsultasi);

module.exports = route;