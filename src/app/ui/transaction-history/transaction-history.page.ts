import { Component, OnInit } from '@angular/core';
import { TransactionsService, Transactions } from 'src/app/services/transactions.service';
import { AccountService } from 'src/app/services/account.service';
import { DatabaseService, TransactionType } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.page.html',
  styleUrls: ['./transaction-history.page.scss'],
})
export class TransactionHistoryPage implements OnInit {

  transactions: Transactions[] = [];
  accounts: Account[] = [];
  transactionType: TransactionType[] = [];
  currentAccountID = 1;
  currentTransactionTypeID = 0;
  allTransactionType = 0;

  date = new Date();
  dateTitle: string = "";
  hasCondition: boolean = false;

  showSkeletonText:boolean = true;



  constructor(private transactionService: TransactionsService, private databaseService: DatabaseService, private activatedRoute: ActivatedRoute, private accountService: AccountService) {
    this.transactionService.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.transactionService.getAllTransactions();
        this.databaseService.loadAllAccounts();
        this.databaseService.loadTransactionType();

        this.databaseService.getAccounts().subscribe(data => {
          this.accounts = data;
        })

        this.databaseService.getTransactionType().subscribe(data => {
          this.transactionType = data;
        })

      }
    });

  }

  ngOnInit() {
    this.transactions = [];
    console.log(this.accountService.getCurrentAccountID());
    this.currentAccountID = this.accountService.getCurrentAccountID();
    this.currentTransactionTypeID = this.databaseService.getCurrentTransactionType();

    this.hasCondition = this.databaseService.getCondition();
  }

  ionViewWillEnter() {

    this.showSkeletonText = true;

    this.transactionService.getTransactionsByDateAccountType(this.databaseService.getCalendarDate(), this.currentAccountID, this.currentTransactionTypeID).then(data => {
      this.transactions = data;
      this.transactions.sort((a, b) => {
        return new Date(b.TransactionDate).getTime() - new Date(a.TransactionDate).getTime();
      });
      this.date = this.transactionService.getDateTitle();
      this.dateTitle = this.date.toISOString();

      this.showSkeletonText = false;
    });

  }



  separateMonth(record, recordIndex, records) {

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];;

    let monthHeader = "";

    let date = new Date();

    if (recordIndex == 0) {
      date = new Date(record.TransactionDate);
    } else {

      let prevDate = new Date(records[recordIndex - 1].TransactionDate);
      let currentDate = new Date(record.TransactionDate);
      if (prevDate.getMonth() !== currentDate.getMonth()) {
        date = currentDate;
      } else {
        return null;
      }
    }

    return monthHeader = monthNames[date.getMonth()];

  }

  updateTransactions(){
    this.showSkeletonText = true;
    this.transactions = [];
    
    this.transactionService.getTransactionsByDateAccountType(this.databaseService.getCalendarDate(), this.currentAccountID, this.currentTransactionTypeID).then(data => {
      console.log(data)
      this.transactions = data;
      this.transactions.sort((a, b) => {
        return new Date(b.TransactionDate).getTime() - new Date(a.TransactionDate).getTime()
      })
      console.log(this.transactions)
      this.date = this.transactionService.getDateTitle();
      this.dateTitle = this.date.toISOString();
      this.showSkeletonText = false;
    });

    this.accountService.setCurrentAccountID(this.currentAccountID);
  }


}
