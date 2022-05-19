'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_konsultasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tb_konsultasi.init({
    konsultasi_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    unit_kerja_id: DataTypes.INTEGER,
    nama_unit_kerja: DataTypes.STRING,
    tenaga_kesehatan_user_id: DataTypes.INTEGER,
    tenaga_kesehatan_jenis_user: DataTypes.STRING,
    tenaga_kesehatan_nama: DataTypes.STRING,
    masyarakat_user_id: DataTypes.INTEGER,
    masyarakat_jenis_user: DataTypes.STRING,
    masyarakat_nama: DataTypes.STRING,
    keluhan: DataTypes.TEXT,
    status: DataTypes.ENUM('Belum Selesai', 'Selesai', 'Tunggu', 'Terima'),
    mulai_pada: DataTypes.DATE,
    berakhir_pada: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'tb_konsultasi',
  });
  return tb_konsultasi;
};