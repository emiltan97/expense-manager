import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';
import {Platform} from '@ionic/angular';

export interface Account {
  AccountID?: number;
  AccountName: string;
  StartingBalance: number;
  CurrentBalance: number;
  CreatedDate: Date;
  AccountTypeID: number;
}

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  private database: SQLiteObject;

  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  account = new BehaviorSubject([]);

  currentAccountID: number = 0;

    constructor(private platform: Platform,private sqlitePorter: SQLitePorter, private sqlite: SQLite,
                private http: HttpClient, private databaseService: DatabaseService) {
        this.platform.ready().then(() => {
            this.sqlite.create({
                name: 'expense.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                this.database = db;
                this.dbReady.next(true);
            }).catch(err => {
                console.log(err);
            });
        });
    }

  insertAccount(account: Account) {

    const content = [account.AccountName, account.StartingBalance, account.CurrentBalance, account.CreatedDate, account.AccountTypeID];

    return this.database.executeSql(
        'INSERT INTO Account (AccountName, StartingBalance, CurrentBalance, CreatedDate, AccountTypeID) VALUES (?, ?, ?, ?, ?)', content
    );
  }

    deleteAccount(id) {
        return this.database.executeSql('DELETE FROM Account WHERE AccountID = ?', [id]);
    }

  loadAllAccounts() {
      const accounts: Account[] = [];
      this.database.executeSql('SELECT * from Account', [])
          .then(data => {
              if (data.rows.length > 0) {
                  for (let i = 0; i < data.rows.length; i++) {
                      accounts.push(data.rows.item(i));
                  }
              }
          });
      return accounts;
  }

  updateAccount(account){
      const name = account.accountName;
      console.log(name);
      const startingBalance = account.startingBalance;
      console.log(startingBalance);
      const id = account.accountID;
      console.log(id);
      return this.database.executeSql('UPDATE Account SET AccountName = ?, ' +
          'StartingBalance = ? WHERE AccountID = ?', [name, startingBalance, id]);
  }

  getCurrentAccountID(){
    return this.currentAccountID;
  }

  setCurrentAccountID(accountID){
    this.currentAccountID = accountID;
  }
}
