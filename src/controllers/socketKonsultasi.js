const querystring = require('querystring');
const {APP_URL, APP_PORT} = process.env;
const {tb_konsultasi_percakapan, tb_konsultasi} = require('../models');
const Joi = require('joi');
const response = require('../helpers/response');
const socketIO = require('../App');

module.exports = {
  mulaiKonsultasi: async (req, res) => {
    try {
      const joiSchema = Joi.object({
        unit_kerja_id: Joi.number().integer().required(),
        nama_unit_kerja: Joi.string().required(),
        tenaga_kesehatan_user_id: Joi.number().integer().required(),
        tenaga_kesehatan_jenis_user: Joi.string().required(),
        tenaga_kesehatan_nama: Joi.string().required(),
        tenaga_kesehatan_spesialis: Joi.string().required(),
        masyarakat_user_id: Joi.number().integer().required(),
        masyarakat_jenis_user: Joi.string().required(),
        masyarakat_nama: Joi.string().required(),
        keluhan: Joi.string().required(),
        status: Joi.string().valid('Belum Selesai', 'Selesai'),
      });
      const {value: results, error} = joiSchema.validate(req.body);
      if (error) {
        return response(res, 'Error', {error: error.message}, 400, false);
      } else {
        const send = await tb_konsultasi.create(results);
        if (send) {
          // template chat dokter pertama kali membuat konsultasi
          const {konsultasi_id} = send.dataValues;
          const template = await tb_konsultasi_percakapan.create({
            konsultasi_id,
            user_id: results.tenaga_kesehatan_user_id,
            jenis_user: results.tenaga_kesehatan_jenis_user,
            nama: results.tenaga_kesehatan_nama,
            konten: `Hai, selamat datang di Dokter Hebat\nTerimakasih telah menghubungi, ${results.tenaga_kesehatan_nama} akan segera membalas.`,
          });
          if (template) {
            return response(res, 'Konsultasi Berhasil Dibuat', send.dataValues);
          } else {
            return response(res, 'Gagal membuat konsultasi', {}, 400, false);
          }
        } else {
          return response(res, 'Gagal membuat konsultasi', {}, 400, false);
        }
      }
    } catch (error) {
      return response(res, error.message, {}, 500, false);
    }
  },
  konsultasi: async (body) => {
    try {
      const joiSchema = Joi.object({
        konsultasi_id: Joi.number().integer().required(),
        user_id: Joi.number().integer().required(),
        jenis_user: Joi.string().required(),
        nama: Joi.string().required(),
        konten: Joi.string(),
        url_gambar: Joi.string(),
      });
      const {value: results, error} = joiSchema.validate(body);
      if (error) {
        socketIO.emit(results.konsultasi_id.toString(), {
            success: false,
            message: error.message,
        })
      } else {
        const send = await tb_konsultasi_percakapan.create(results);
        if (send) {
          socketIO.emit(results.konsultasi_id.toString(), {
            success: true,
            message: 'Konsultasi Anda terkirim',
            result: {
              ...send.dataValues,
            },
          })
        } else {
            socketIO.emit(results.konsultasi_id.toString(), {
                success: false,
                message: 'Gagal mengirim Konsultasi',
                result: {
                    ...send.dataValues,
                },
            })
        }
      }
    } catch (error) {
        socketIO.emit(results.konsultasi_id.toString(), {
            success: false,
            message: 'Gagal mengirim Konsultasi',
            result: {
                ...send.dataValues,
            },
        })
    }
  },
  getKonsultasiById: async (req, res) => {
    try {
      let {konsultasi_id, limit = 10, page = 1} = req.query;
      limit = Number(limit);
      page = Number(page);
      if (page < 1) {
        page = 1;
      }
      if (konsultasi_id) {
        const konsultasi = await tb_konsultasi_percakapan.findAll({
          where: {
            konsultasi_id: konsultasi_id,
          },
          limit: limit,
          offset: (page - 1) * 1,
          // order: [['id', 'DESC']],
        });
        const totalPage = await tb_konsultasi_percakapan.count({
          where: {
            konsultasi_id: konsultasi_id,
          },
        });
        const path = req.originalUrl.slice(1).split('?')[0];
        const prev = querystring.stringify({...req.query, ...{page: page - 1}});
        const next = querystring.stringify({...req.query, ...{page: page + 1}});
        const pageInfo = {
          currentPage: page,
          totalPage: Math.ceil(totalPage / limit) || 0,
          totalData: 2,
          limitData: limit,
          prevLink: page > 1 ? `${APP_URL}:${APP_PORT}/${path}?${prev}` : null,
          nextLink:
            page < Math.ceil(totalPage / limit) || 0
              ? `${APP_URL}:${APP_PORT}/${path}?${next}`
              : null,
        };
        if (konsultasi.length > 0) {
          return response(res, 'Detail konsultasi anda', {
            data: konsultasi,
            pageInfo,
          });
        } else {
          return response(res, 'Anda tidak mempunyai konsultasi', {
            data: konsultasi,
            pageInfo,
          });
        }
      } else {
        return response(res, 'Error', null, 400, false);
      }
    } catch (error) {
      return response(res, error.message, {}, 500, false);
    }
  },
};
