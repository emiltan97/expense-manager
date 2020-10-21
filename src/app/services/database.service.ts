import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Account } from './account.service';

export interface TransactionType {
  TransactionTypeID: number;
  TransactionTypeName: string;
}
export interface AccountType {
  AccountTypeID: number;
  AccountTypeName: string;
}

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private transactionType = new BehaviorSubject([]);
  private accounts = new BehaviorSubject([]);
  private currentTransactionType: number;
  private calendarDate:string = "";
  private hasCondition:boolean = false;


  constructor(private platform: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'expense.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.Expense();
      }).catch(err => {
        console.log(err);
      });
    });

  }

  getLatestTransaction() {
    return this.database.executeSql('SELECT * FROM Transactions ORDER BY TransactionID DESC LIMIT 1', []);
  }

  getLatestTransactionByAccountID(id) {
    const data = [id];
    return this.database.executeSql('SELECT * FROM Transactions WHERE AccountID = ? ORDER BY TransactionID DESC LIMIT 1', data);
  }

  loadAllAccounts() {
    return this.database.executeSql('SELECT * from Account', [])
      .then(data => {
        const accounts: Account[] = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            accounts.push(data.rows.item(i));
          }
        }
        this.accounts.next(accounts);
      });
  }

  Expense() {
    this.http.get('assets/Expense.sql', { responseType: 'text' }).subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql).then(_ => {
        this.loadAccountType();
        this.loadTransactionType();
        this.dbReady.next(true);
      }).catch(error => {
        console.log(error);
      });
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getAccounts() {
    return this.accounts.asObservable();
  }

  getTransactionType() {
    return this.transactionType.asObservable();
  }

  loadAccountType() {
    return this.database.executeSql('SELECT * from AccountType', []);
  }

  loadTransactionType() {
    return this.database.executeSql('SELECT * from TransactionType', []).then(data => {
      const transactionType: TransactionType[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          transactionType.push(data.rows.item(i));
        }
      }
      this.transactionType.next(transactionType);
    });;
  }

  setCurrentTransactionType(transactionTypeID){
    this.currentTransactionType = transactionTypeID;
  }

  getCurrentTransactionType() {
    return this.currentTransactionType;
  }

  setCalendarDate(date){
    this.calendarDate = date;
  }

  getCalendarDate(){
    return this.calendarDate;
  }

  setCondition(condition){
    this.hasCondition = condition;
  }

  getCondition(){
    return this.hasCondition;
  }

  getDatabase() {
    return this.database;
  }
}
