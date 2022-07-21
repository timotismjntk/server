const querystring = require('querystring');
const {APP_URL, APP_PORT} = process.env;
const {tb_konsultasi_percakapan, tb_konsultasi} = require('../models');
const Joi = require('joi');
const response = require('../helpers/response');
const socketIO = require('../App');
const {Op} = require('sequelize');

module.exports = {
  getKonsultasiById: async (konsultasi_id, user_id, limit = 10, page = 1) => {
    try {
      limit = Number(limit);
      page = Number(page);
      if (page < 1) {
        page = 1;
      }
      if (konsultasi_id) {
        const {count: totalData, rows: konsultasi} =
          await tb_konsultasi_percakapan.findAndCountAll({
            where: {
              konsultasi_id: konsultasi_id,
            },
            limit: limit,
            offset: (page - 1) * limit,
            order: [['id', 'DESC']],
          });
        const pageInfo = {
          currentPage: page,
          totalPage: Math.ceil(totalData / limit) || 0,
          totalData: totalData,
          limitData: limit,
        };
        if (konsultasi.length > 0) {
          const konsultasiID = await tb_konsultasi.findOne({
            where: {konsultasi_id},
          });
          const {
            dataValues: {
              masyarakat_user_id,
              tenaga_kesehatan_user_id,
              total_belum_terbaca_tenaga_kesehatan,
              total_belum_terbaca_masyarakat,
            },
          } = konsultasiID;
          if (Number(user_id) === tenaga_kesehatan_user_id) {
            if (total_belum_terbaca_tenaga_kesehatan === 0) {
              return {
                message: 'Detail konsultasi anda',
                result: {
                  data: konsultasi,
                  pageInfo,
                },
              }
            } else {
              return {
                message: 'Detail konsultasi anda',
                result: {
                  data: konsultasi,
                  pageInfo,
                },
              }
            }
          } else if (Number(user_id) === masyarakat_user_id) {
            if (total_belum_terbaca_masyarakat === 0) {
              return {
                message: 'Detail konsultasi anda',
                result: {
                  data: konsultasi,
                  pageInfo,
                },
              }
            } else {
              return {
                message: 'Detail konsultasi anda',
                result: {
                  data: konsultasi,
                  pageInfo,
                },
              }
            }
          } else {
            return {
              message: 'Detail konsultasi anda',
              result: {
                data: konsultasi,
                pageInfo,
              },
            }
          }
        } else {
          return {
            message: 'Detail konsultasi anda',
            result: {
              data: konsultasi,
              pageInfo,
            },
          }
        }
      } else {
        return {
          message: 'Error',
          result: null,
        }
      }
    } catch (error) {
      return {
        message: 'Error',
        result: null,
      }
    }
  },
  getAllkonsultasi: async (req, res) => {
    try {
      let {userId, status, limit = 10, page = 1} = req.query;
      limit = Number(limit);
      page = Number(page);
      if (page < 1) {
        page = 1;
      }
      const where = () => {
        if (status === undefined) {
          return {
            [Op.or]: [
              {
                tenaga_kesehatan_user_id: userId,
              },
              {
                masyarakat_user_id: userId,
              },
            ],
          };
        } else {
          return {
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    tenaga_kesehatan_user_id: userId,
                  },
                  {
                    masyarakat_user_id: userId,
                  },
                ],
              },
              {
                [Op.or]: [
                  {
                    status: status === 'Terima' ? 'Terima' : status,
                  },
                  {
                    status: status === 'Terima' ? null : status,
                  },
                ],
              },
            ],
          };
        }
      };
      const {count: totalPage, rows: konsultasi} =
        await tb_konsultasi.findAndCountAll({
          where: where(),
          limit: limit,
          offset: (page - 1) * 1,
          order: [['createdAt', 'DESC']],
        });
      const path = req.originalUrl.slice(1).split('?')[0];
      const prev = querystring.stringify({...req.query, ...{page: page - 1}});
      const next = querystring.stringify({...req.query, ...{page: page + 1}});
      const pageInfo = {
        currentPage: page,
        totalPage: Math.ceil(totalPage / limit) || 0,
        totalData: totalPage,
        limitData: limit,
        prevLink: page > 1 ? `${APP_URL}:${APP_PORT}/${path}?${prev}` : null,
        nextLink:
          page < Math.ceil(totalPage / limit) || 0
            ? `${APP_URL}:${APP_PORT}/${path}?${next}`
            : null,
      };
      if (konsultasi.length > 0) {
        const sortedKonsultasi = [
          {
            title: 'Konsultasi Baru',
            data: konsultasi
              .filter(item => {
                if (item.status === null || item.status === 'Tunggu') {
                  return item;
                }
              })
              .sort((a, b) => (a.status != null) - (b.status != null) || a - b),
          },
          {
            title: 'Konsultasi Lama',
            data: konsultasi
              .filter(item => {
                if (
                  item.status === 'Belum Selesai' ||
                  item.status === 'Selesai' ||
                  item.status === 'Terima'
                ) {
                  return item;
                }
              }),
          },
        ];
        return response(res, 'List konsultasi anda', {
          data: konsultasi,
          pageInfo,
          sortedKonsultasi,
        });
      } else {
        return response(res, 'Anda tidak mempunyai list konsultasi', {
          data: konsultasi,
          pageInfo,
        });
      }
    } catch (error) {
      return response(res, error.message, {}, 500, false);
    }
  },
};
