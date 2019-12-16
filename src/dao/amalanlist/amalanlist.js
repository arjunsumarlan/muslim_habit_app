import React, { Component } from 'react';
import dao from './dao'

export default class amalanlist {
    static instance = amalanlist.instance == null ? new amalanlist() : this.instance

    getamalan() {
        return dao.instance.selectData()
            .then(row => {return row})
    }

    getamalanbyKategori(kategori = '') {
        return dao.instance.selectDatabyKategori(kategori)
            .then(row => {return row})
    }

    getamalanbyShowHome(show_home = '') {
        return dao.instance.selectDatabyShowHome(show_home)
            .then(row => {return row})
    }

    filterbyAmalandanKategori(amalan = '', kategori = '') {
        return dao.instance.selectDatabyAmalandanKategori(amalan, kategori)
            .then(row => {return row})
    }

    deleteAmalan(amalan = ''){
        return dao.instance.deleteAmalan(amalan)
    }

    deleteAll(){
        return dao.instance.deleteAll()
    }

    setAmalan(amalan = '', kategori = '', show_home = '', waktu = '', type = ''){
        return dao.instance.insertAmalan(amalan, kategori, show_home, waktu, type)
    }

    updateAmalan(amalan = '', kategori = '', show_home = '', waktu = '', type = ''){
        return dao.instance.deleteAmalan(amalan)
            .then(() => dao.instance.insertAmalan(amalan, kategori, show_home, waktu, type))
            .then((row)=>{return row})
    }
}