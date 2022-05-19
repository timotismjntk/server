'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_konsultasi_percakapan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tb_konsultasi_percakapan.init({
    konsultasi_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    jenis_user: DataTypes.STRING,
    nama: DataTypes.STRING,
    konten: DataTypes.TEXT,
    url_gambar: DataTypes.TEXT,
    is_readed: DataTypes.ENUM('belum', 'sudah'),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'tb_konsultasi_percakapan',
  });
  return tb_konsultasi_percakapan;
};