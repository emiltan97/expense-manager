import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';
import { Platform } from '@ionic/angular';
import { AccountService } from './account.service';


export interface Transactions {
  TransactionID?: number;
  TransactionName: string;
  TransactionAmount: number;
  TransactionDate: any;
  TransactionTypeID: number;
  AccountID: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  transactions = new BehaviorSubject([]);
  dateTitle = new Date();

  constructor(private platform: Platform,private sqlitePorter: SQLitePorter, private sqlite: SQLite,
    private http: HttpClient, private databaseService: DatabaseService,private accountService:AccountService) {
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'expense.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
          this.database = db;
          this.dbReady.next(true);
          console.log(this.database);
      }).catch(err => {
        console.log(err);
      });
    })
  }


  addTransactions(transaction: Transactions) {

    const data = [transaction.TransactionName, transaction.TransactionAmount, transaction.TransactionDate, transaction.TransactionTypeID, transaction.AccountID];

    return this.database.executeSql("INSERT INTO Transactions (TransactionName,TransactionAmount,TransactionDate,TransactionTypeID,AccountID) VALUES (?,?,?,?,?)", data)
      .then(data => {
        console.log(data.rows.item);
      }).catch(err => {
        console.log(err);
      });
  }

  getAllTransactions() {
    return this.database.executeSql('SELECT * from Transactions', []).then(data => {
      const transactions: Transactions[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          transactions.push(data.rows.item(i));
        }
      }
      this.transactions.next(transactions);
    });
  }

  getTransactionsByDateAccountType(date:string, accountID:number, transactionTypeID:number){

    let data = [];

    let query = "";


    if(transactionTypeID == 0 && date == ""){
  
        data= [accountID];
        query = "Select * from Transactions WHERE AccountID = ?";
      
    }else if(transactionTypeID == 0 && date != ""){

      data= [date,accountID];
      query = "Select * from Transactions WHERE TransactionDate = ? AND AccountID = ?";

    }else if(transactionTypeID>0 && date!="" && accountID !=0 ){

      data= [date,accountID,transactionTypeID];
      query = "Select * from Transactions WHERE TransactionDate = ? AND AccountID = ? AND TransactionTypeID = ?";

    }

    return this.database.executeSql(query,data).then(data=>{
      const transactions: Transactions[] = [];
      if(data.rows.length>0){
        for (let i = 0; i < data.rows.length; i++) {
          transactions.push(data.rows.item(i));
        }
      }

      return transactions;
    })

  }

  getTransactionsByDate(date:Date){
    
    date.setDate(1);
    let firstDayOfMonth = this.formatDate(date);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    let lastDayOfMonth = this.formatDate(date);

    let data = [this.accountService.getCurrentAccountID(), firstDayOfMonth, lastDayOfMonth];

    return this.database.executeSql("SELECT * from Transactions WHERE AccountID = ? AND TransactionDate BETWEEN ? AND ?",data).then(data=>{
      const transactions: Transactions[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          transactions.push(data.rows.item(i));
        }
      }
      return transactions;
    });
  }

  formatDate(date:Date){
    let currentDate = date.getDate()
    let formattedTodayDate:string = "0" + currentDate.toString();
    let sliceDate = formattedTodayDate.slice(-2);

    let currentMonth = date.getMonth() + 1;
    let formattedMonth:string = "0" + currentMonth.toString();
    let sliceMonth = formattedMonth.slice(-2);

    let currentYear:string = date.getFullYear().toString();
    const formattedDate = currentYear + "-" + sliceMonth + "-" + sliceDate;

    return formattedDate;

  }

  getTodayTransactions(){

    let tempDate = new Date();
    const formattedTempDate = this.formatDate(tempDate);

    // let startDate = new Date();
    // startDate.setHours(0,0,0);
    // const tempA = this.formatDate(startDate);
    // let endDate = new Date();
    // endDate.setHours(23,59,59);
    // const tempB = this.formatDate(endDate);

    let accountID = this.accountService.getCurrentAccountID();

    console.log(accountID);

    let data =[accountID,formattedTempDate];

    return this.database.executeSql("SELECT * from Transactions WHERE AccountID = ? AND TransactionDate = ?", data).then(data => {
      const transactions: Transactions[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          transactions.push(data.rows.item(i));
        }
      }
      return transactions;
    });
  }

  getTransactionByID(transactionID:number){
    let transaction: Transactions;

    return this.database.executeSql('SELECT * from Transactions WHERE TransactionID = ?',[transactionID]).then(data=>{
      return transaction = {
        TransactionID: data.rows.item(0).TransactionID,
        TransactionName: data.rows.item(0).TransactionName,
        TransactionAmount: data.rows.item(0).TransactionAmount,
        TransactionDate: data.rows.item(0).TransactionDate,
        TransactionTypeID: data.rows.item(0).TransactionTypeID,
        AccountID: data.rows.item(0).AccountID
      }
    }).catch(err=>{
      console.log(err);
    })
    
  }

  UpdateTransaction(transaction: Transactions){
    const data = [transaction.TransactionName, transaction.TransactionAmount, transaction.TransactionDate, transaction.TransactionTypeID, transaction.AccountID, transaction.TransactionID];

    return this.database.executeSql('UPDATE Transactions SET TransactionName = ?, TransactionAmount = ?, TransactionDate = ?, TransactionTypeID = ?, AccountID = ? WHERE TransactionID = ?' , data).then(data =>{
      console.log(data);
    }).catch(err=>{
      console.log(err);
    })
    
  }

  DeleteTransaction(transactionID : number){
    return this.database.executeSql('DELETE from Transactions WHERE TransactionID = ?',[transactionID]).then(data=>{
      console.log(data);
    }).catch(err=>{
      console.log(err);
    })
  }

  DeleteTransactionsByAccountID(accountID:number){
    return this.database.executeSql('DELETE from Transactions WHERE AccountID = ?',[accountID]).then(data=>{
      console.log(data);
    }).catch(err=>{
      console.log(err);
    })
  }

  getTransactions(){
    return this.transactions.asObservable();
  }

  setDateTitle(date:Date){
    this.dateTitle = date;
  }

  getDateTitle(){
    return this.dateTitle;
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }
}
