import React, { Component } from 'react';
import SQLite from "react-native-sqlite-storage";

export default class amalanwajib {

    constructor(props) {
        this.dba = SQLite.openDatabase(
            {
                name: 'DRMuslim',
                createFromLocation: '~dr_muslim.db'
            }
        )
    }

    // validation = 'WHERE key = ?'
    select(tableName = '', validation = '', argument = []) {
        return new Promise((resolve, reject) => {
            this.dba.transaction((tx) => {
                tx.executeSql('SELECT * FROM ' + tableName + validation, argument, (tx, results) => {

                    resolve(results.rows)
                
                }, (error) => {
    
                    reject(error)

                });
            });
        })
    }

    insert(tableName = '', validation = '', datas) {

        let argument = []
        for (data in datas) {
            argument.push(datas[data])
        }

        return new Promise((resolve, reject) => {
            this.dba.transaction((tx) => {

                tx.executeSql('INSERT INTO ' + tableName + validation, argument, (tx, results) => {
                    
                    resolve(datas)

                }, (error) => {
    
                    reject(error)

                });
            });
        })
    }

    delete(tableName = '', condition = '', argument = []) {
        return new Promise((resolve, reject) => {
            this.dba.transaction((tx) => {
                tx.executeSql('DELETE FROM '+ tableName + condition, argument, (tx, results) => {
                    if (condition == '')
                        resolve()       // deleteAll
                    else
                        resolve()       // delete with id
                }, (error) => {
    
                    reject(error)

                });
            });
        })
    }
}