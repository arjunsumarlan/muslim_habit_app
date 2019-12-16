import React, { Component } from 'react';
import dao from './dao'

export default class amalanwajib {
    static instance = amalanwajib.instance == null ? new amalanwajib() : this.instance

    getamalan() {
        return dao.instance.selectData()
            .then(row => {return row})
    }

    getamalanbyTanggal(tanggal = '') {
        return dao.instance.selectDatabyTanggal(tanggal)
            .then(row => {return row})
    }

    filterbyAmalandanTanggal(amalan = '', tanggal = '') {
        return dao.instance.selectDatabyAmalandanTanggal(amalan, tanggal)
            .then(row => {return row})
    }

    deleteAmalan(amalan = '', tanggal = ''){
        return dao.instance.deleteAmalan(amalan, tanggal)
    }

    setAmalan(amalan = '', hari = '', bulan = '', tahun = '', tanggal = '', nilai = '', type = '', waktu = '', pause = '', kategori = '', telat = ''){
        return dao.instance.insertAmalan(amalan, hari, bulan, tahun, tanggal, nilai, type, waktu, pause, kategori, telat)
    }

    setNilai(amalan = '', hari = '', bulan = '', tahun = '', tanggal = '', nilai = '', type = '', waktu = '', pause = '', kategori = '', telat = ''){
        return dao.instance.deleteAmalan(amalan, tanggal)
            .then(() => dao.instance.insertAmalan(amalan, hari, bulan, tahun, tanggal, nilai, type, waktu, pause, kategori, telat))
            .then((row)=>{return row})
    }
}