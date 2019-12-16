import React, { Component } from 'react';
import generaldao from '../generaldao'

export default class dao extends generaldao{
	static instance = dao.instance == null ? new dao() : this.instance

	selectData(){
		return this.select('amalan_shunnah', '', [])
    }
    
    selectDatabyTanggal(tanggal){
        return this.select('amalan_shunnah', ' WHERE tanggal = ?', [tanggal])
    }

    selectDatabyAmalandanTanggal(amalan, tanggal){
        return this.select('amalan_shunnah', ' WHERE tanggal = ? AND amalan = ?', [tanggal, amalan])
    }

	insertAmalan(amalan, hari, bulan, tahun, tanggal, nilai, type, waktu, pause, kategori, telat){
		let datas = {
            amalan,
            hari,
            bulan,
            tahun,
            nilai,
            tanggal,
            type,
            waktu,
            pause,
            kategori,
            telat
        }

		return this.insert('amalan_shunnah', ' VALUES(?,?,?,?,?,?,?,?,?,?,?)', datas)
	}

	deleteAmalan(amalan, tanggal){
		return this.delete('amalan_shunnah', ' WHERE amalan = ? AND tanggal = ?', [amalan, tanggal])
    }
    
    deleteAll(){
		return this.delete('amalan_shunnah', '', [])
	}
}