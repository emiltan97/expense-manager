import { Component, OnInit } from '@angular/core';
import { Transactions, TransactionsService } from 'src/app/services/transactions.service';
import { ActivatedRoute } from '@angular/router';
import { AccountService, Account } from 'src/app/services/account.service';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.page.html',
  styleUrls: ['./edit-transaction.page.scss'],
})
export class EditTransactionPage implements OnInit {

  private transactionID:any;
  private transaction :Transactions;
  TransactionAmount: string;
  TransactionName: string;
  TransactionTypeID: number;
  defaultAccount:number;
  accounts:Account[];

  constructor(private transactionService:TransactionsService,private activatedRoute:ActivatedRoute,private accountService: AccountService) { 
    this.transactionID = this.activatedRoute.snapshot.paramMap.get('id');
    
  }

  ngOnInit() {
    this.loadTransactionDetails();
    this.accounts = this.accountService.loadAllAccounts();
  }

  loadTransactionDetails(){
    this.transactionService.getTransactionByID(this.transactionID).then((res: any)=>{
      this.transaction = res;
      console.log(this.transaction);
      this.setInfo();
    });
    
  }

  setInfo(){
    this.TransactionAmount = this.transaction.TransactionAmount.toString();
    this.TransactionName = this.transaction.TransactionName;
    this.TransactionTypeID = this.transaction.TransactionTypeID;
    this.defaultAccount = this.transaction.AccountID;
  }

  updateTransaction(){
    

    this.transaction.TransactionAmount = parseInt(this.TransactionAmount);
    this.transaction.TransactionName = this.TransactionName;
    this.transaction.TransactionTypeID = this.TransactionTypeID;
    this.transaction.AccountID = this.defaultAccount;


    this.transactionService.UpdateTransaction(this.transaction).then(()=>{
      console.log("OK")
    });


  }

}
