import { Component, OnInit } from '@angular/core';
import { TransactionsService, Transactions } from 'src/app/services/transactions.service';
import { LoadingController } from '@ionic/angular';
import { AccountService, Account } from 'src/app/services/account.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.page.html',
  styleUrls: ['./add-transaction.page.scss'],
})
export class AddTransactionPage implements OnInit {

  TransactionAmount: string;
  TransactionName: string;
  TransactionTypeID: number;

  transaction: Transactions = {
    TransactionName: '',
    TransactionAmount: 0,
    TransactionDate: new Date(),
    TransactionTypeID: 0,
    AccountID: 1
  };

  accounts:Account[];
  defaultAccount: number;


  constructor(private transactionService: TransactionsService, private loadingCtrl: LoadingController, private accountService: AccountService, private activatedRoute:ActivatedRoute) {

    this.accounts = this.accountService.loadAllAccounts();
    console.log(this.accounts);
    
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.TransactionAmount = "";
    this.TransactionName = "";
    this.TransactionTypeID = 1;

    this.defaultAccount = parseInt(this.activatedRoute.snapshot.paramMap.get('accountID'));
    console.log(this.defaultAccount);
  }

  async insertTransaction() {

    let todayDate = new Date();
    const transactionDate = this.transactionService.formatDate(todayDate);
    console.log(transactionDate);

    this.transaction.TransactionName = this.TransactionName;
    this.transaction.TransactionAmount = parseFloat(this.TransactionAmount);
    this.transaction.TransactionTypeID = this.TransactionTypeID;
    this.transaction.TransactionDate = transactionDate;
    this.transaction.AccountID = this.defaultAccount;

    const loading = await this.loadingCtrl.create({
      message: 'Adding...',
      spinner: "crescent"
    });
    await loading.present();

    this.transactionService.addTransactions(this.transaction).then(() => {
      alert("Insert Successfully");
      this.transactionService.getAllTransactions();
      loading.dismiss();
      this.TransactionAmount = "";
      this.TransactionName = "";
      this.TransactionTypeID = 1;
    }).catch(err => {
      console.log(err);
      loading.dismiss();
    });


  }

}
