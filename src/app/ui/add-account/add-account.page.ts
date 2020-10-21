import { Component, OnInit } from '@angular/core';
import { AccountService, Account } from '../../services/account.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.page.html',
  styleUrls: ['./add-account.page.scss'],
})
export class AddAccountPage implements OnInit {

  accountName: string;
  startingBalance: number;
  accountTypeID: number;

  accounts: Account = {
    AccountName: '',
    StartingBalance: 0,
    CurrentBalance: 0,
    CreatedDate: new Date(),
    AccountTypeID: 1
  };

  constructor(private accountService: AccountService, private location: Location) { }

  ngOnInit() {
  }

  async addAccount() {
    const current = new Date();
    this.accounts.AccountName = this.accountName;
    this.accounts.StartingBalance = this.startingBalance;
    this.accounts.CurrentBalance = this.startingBalance;
    this.accounts.CreatedDate = current;
    this.accounts.AccountTypeID = this.accountTypeID;

    this.accountService.insertAccount(this.accounts).then(() => {
      alert('DONE');

      this.location.back();
    }).catch(err => {
      console.log(err);
    });
  }

}
