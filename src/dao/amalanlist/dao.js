import React, { Component } from 'react';
import generaldao from '../generaldao'

export default class dao extends generaldao{
	static instance = dao.instance == null ? new dao() : this.instance

	selectData(){
		return this.select('amalan_list', '', [])
    }
    
    selectDatabyKategori(kategori){
        return this.select('amalan_list', ' WHERE kategori = ?', [kategori])
    }

    selectDatabyShowHome(show_home){
        return this.select('amalan_list', ' WHERE show_home = ?', [show_home])
    }

    selectDatabyAmalandanKategori(amalan, kategori){
        return this.select('amalan_list', ' WHERE amalan = ? AND kategori = ?', [amalan, kategori])
    }

	insertAmalan(amalan, kategori, show_home, waktu, type){
		let datas = {
            amalan,
            kategori,
            show_home,
            waktu,
            type
        }

		return this.insert('amalan_list', ' VALUES(?,?,?,?,?)', datas)
	}

	deleteAmalan(amalan){
		return this.delete('amalan_list', ' WHERE amalan = ?', [amalan])
    }
    
    deleteAll(){
		return this.delete('amalan_list', '', [])
	}
}