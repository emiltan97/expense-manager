import { Component, OnInit } from '@angular/core';
import { AccountService, Account } from '../../services/account.service';
import { AlertController } from '@ionic/angular';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.page.html',
  styleUrls: ['./manage-account.page.scss'],
})
export class ManageAccountPage implements OnInit {

  accounts: Account[];

  constructor(private accountService: AccountService, public alertController: AlertController,private transactionsService:TransactionsService) {}

  ngOnInit() {}

  async deleteAccount(id) {
    this.transactionsService.DeleteTransactionsByAccountID(id);
    this.accountService.deleteAccount(id);
    this.accountService.setCurrentAccountID(0);
    this.accounts = this.accountService.loadAllAccounts();
    alert("Delete Successfully");
  }

  async updateAccount(id, account) {
    const temp: Account = account;
    const alert = await this.alertController.create({
      header: 'Edit account',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Type the new name'
        },
        {
          name: 'startingBalance',
          type: 'number',
          placeholder: 'New starting balance'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {
            console.log(temp);
            temp.AccountName = data.name;
            temp.StartingBalance = data.startingBalance;
            temp.AccountID = id;
            this.accountService.updateAccount(temp);
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter() { this.accounts = this.accountService.loadAllAccounts(); }
}

