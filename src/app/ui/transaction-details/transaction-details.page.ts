import { Component, OnInit } from '@angular/core';
import { TransactionsService, Transactions } from 'src/app/services/transactions.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {

  private transactionID:any;
  private transaction :Transactions;

  constructor(private transactionService:TransactionsService,private activatedRoute:ActivatedRoute) {
    this.transactionID = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadTransactionDetails();
  }

  ngOnInit() {
  }

  loadTransactionDetails(){
    this.transactionService.getTransactionByID(this.transactionID).then((res: any)=>{
      this.transaction = res;
      console.log(this.transaction);
    });
    
  }

}
