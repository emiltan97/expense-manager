import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'manage-account',
        loadChildren: '../manage-account/manage-account.module#ManageAccountPageModule'
      },
      {
        path: 'home',
        loadChildren: '../home/home.module#HomePageModule'
      },
      {
        path: 'add-account',
        loadChildren: '../add-account/add-account.module#AddAccountPageModule'
      },
      {
        path: 'edit-transaction/:id',
        loadChildren: '../edit-transaction/edit-transaction.module#EditTransactionPageModule'
      },
      {
        path: 'add-transaction/:accountID',
        loadChildren: '../add-transaction/add-transaction.module#AddTransactionPageModule'
      },
      {
        path: 'calendar',
        loadChildren: '../calendar/calendar.module#CalendarPageModule',
      },
      {
        path: 'transaction-history',
        loadChildren: '../transaction-history/transaction-history.module#TransactionHistoryPageModule'
      },
      {
        path: 'transaction-history/:accountID',
        loadChildren: '../transaction-history/transaction-history.module#TransactionHistoryPageModule'
      },
      {
        path: 'transaction-details/:id',
        loadChildren: '../transaction-details/transaction-details.module#TransactionDetailsPageModule'
      },
      // {
      //    path: 'home',
      //    loadChildren: './ui/home/home.module#HomePageModule'
      // }
    ]
  },
  {
    path: '',
    redirectTo: '/menu/home'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule { }
