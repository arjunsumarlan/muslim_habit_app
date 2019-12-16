import React, { Component } from 'react';
import generaldao from '../generaldao'

export default class dao extends generaldao{
	static instance = dao.instance == null ? new dao() : this.instance

	selectData(){
		return this.select('amalan_wajib', '', [])
    }
    
    selectDatabyTanggal(tanggal){
        return this.select('amalan_wajib', ' WHERE tanggal = ?', [tanggal])
    }

    selectDatabyAmalandanTanggal(amalan, tanggal){
        return this.select('amalan_wajib', ' WHERE tanggal = ? AND amalan = ?', [tanggal, amalan])
    }

	insertAmalan(amalan, hari, bulan, tahun, tanggal, nilai, type, waktu, pause, kategori, telat){
		let datas = {
            amalan,
            hari,
            bulan,
            tahun,
            tanggal,
            nilai,
            type,
            waktu,
            pause,
            kategori,
            telat
        }

		return this.insert('amalan_wajib', ' VALUES(?,?,?,?,?,?,?,?,?,?,?)', datas)
	}

	deleteAmalan(amalan, tanggal){
		return this.delete('amalan_wajib', ' WHERE amalan = ? AND tanggal = ?', [amalan, tanggal])
	}
}