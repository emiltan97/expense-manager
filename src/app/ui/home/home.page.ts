import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AccountService, Account } from '../../services/account.service';
import { TransactionsService, Transactions } from 'src/app/services/transactions.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TransactionHistoryPage } from '../transaction-history/transaction-history.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    accounts: any;
    transactions: Transactions[];
    hasAccount;
    hasTransaction = false;
    index = 1;
    lastTransaction = 0;
    currentAccountCurrentBalance;
    currentAccountLastTransaction: Transactions = {
        TransactionID: 0,
        TransactionName: "",
        TransactionAmount: 0,
        TransactionDate: null,
        TransactionTypeID: 0,
        AccountID: 0
    }
    currentAccountDailyExpenses;


    constructor(private dbService: DatabaseService, private transactionService: TransactionsService, private navController: NavController, private router: Router, private accountService: AccountService, private changeDetectorReference : ChangeDetectorRef) {
    }

    ngOnInit() {
        this.dbService.getDatabaseState().subscribe(ready => {
            if (ready) {
                this.transactionService.getAllTransactions();
                this.transactionService.getTransactions().subscribe(
                    data => {
                        this.transactions = data;
                    }
                );
                this.dbService.getLatestTransaction().then(
                    data => {
                        if (data.rows.length > 0) {
                            if (this.accountService.getCurrentAccountID() === data.rows.item(0).AccountID || this.accountService.getCurrentAccountID() === 0) {
                                this.index = data.rows.item(0).AccountID;
                                this.accountService.setCurrentAccountID(this.index);
                            }
                        }
                    }
                );
            }
        })
    }

    ionViewDidEnter() {
        this.transactionService.getAllTransactions();
        this.transactionService.getTransactions().subscribe(
            data => {
                this.transactions = data;
            });
        this.dbService.loadAllAccounts();
        this.dbService.getAccounts().subscribe(
            data => {
                this.accounts = data;
                if (this.accountService.getCurrentAccountID() === 0) {
                    if (this.accounts.length > 0) {
                        this.hasAccount = true;
                        this.index = this.accounts[0].AccountID;
                        this.setCurrentAccountCurrentBalance();
                        this.setCurrentAccountLastTransaction();
                        this.setCurrentAccountDailyExpense();
                    } else {
                        this.hasAccount = false;
                    }
                }
                else {
                    this.index = this.accountService.getCurrentAccountID();
                    this.setCurrentAccountCurrentBalance();
                    this.setCurrentAccountLastTransaction();
                    this.setCurrentAccountDailyExpense();
                }
            }
        );
  }

  navigateToTransactionHistory(){
    this.dbService.setCondition(false);
    this.dbService.setCurrentTransactionType(0);
    this.dbService.setCalendarDate("");
    this.accountService.setCurrentAccountID(this.index);
    this.navController.navigateForward(['/menu/transaction-history/']);
  }

  setCurrentAccountCurrentBalance(){
      let tempAcc: Account;
      for (let i = 0; i < this.accounts.length; i++){
          if (this.accounts[i].AccountID === this.index){
              tempAcc = this.accounts[i];
          }
      }
      this.currentAccountCurrentBalance = tempAcc.StartingBalance;
      let temp: Transactions[];
      temp = this.transactions.filter((transaction) => {
              return (transaction.AccountID === this.index);
      });
      for (let i = 0; i < temp.length; i++){
          if (temp[i].TransactionTypeID === 1){
              this.currentAccountCurrentBalance += temp[i].TransactionAmount;
          }
          else {
              this.currentAccountCurrentBalance -= temp[i].TransactionAmount;
          }
      }
  }

  setCurrentAccountLastTransaction(){
      this.dbService.getLatestTransactionByAccountID(this.index).then(
        data => {
            if (data.rows.length > 0){
                this.hasTransaction = true;
                this.currentAccountLastTransaction = data.rows.item(0);
                this.lastTransaction = this.currentAccountLastTransaction.TransactionAmount;
            }
            else {this.hasTransaction = false;}
        });
      this.accountService.setCurrentAccountID(this.index);
  }

  setCurrentAccountDailyExpense(){
      this.transactionService.getTodayTransactions().then((data:any)=>{
          const transactions = data;

          let temp: Transactions[];
          temp = transactions.filter((transaction) => {
              return (transaction.AccountID === this.index);
          });
          this.currentAccountDailyExpenses = 0;

          for (let i = 0; i < temp.length; i++){
              if (temp[i].TransactionTypeID === 1){
                  this.currentAccountDailyExpenses += temp[i].TransactionAmount;
              }
              else {
                  this.currentAccountDailyExpenses -= temp[i].TransactionAmount;
              }
          }
      },err =>{
          console.log("error: " + err);
      });
  }

  onChange(){
      this.accountService.setCurrentAccountID(this.index);
      this.setCurrentAccountCurrentBalance();
      this.setCurrentAccountLastTransaction();
      this.setCurrentAccountDailyExpense();
  }

  editLastTransaction(){
      if(this.currentAccountLastTransaction.TransactionID != 0){
        this.navController.navigateForward(['/menu/edit-transaction/',this.currentAccountLastTransaction.TransactionID]);
      }
  }

  navigateToDailyTransactions(){
    this.dbService.setCurrentTransactionType(0);
    let date = new Date();
    this.transactionService.setDateTitle(date);
    let formattedDate:string = this.transactionService.formatDate(date);
    this.dbService.setCalendarDate(formattedDate);
    this.accountService.setCurrentAccountID(this.index);
    this.navController.navigateForward(['/menu/transaction-history/']);
  }

}

