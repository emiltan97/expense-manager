import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './ui/menu/menu.module#MenuPageModule' },
  // { path: 'transaction-details:/id', loadChildren: './ui/transaction-details/transaction-details.module#TransactionDetailsPageModule' },

  // { path: 'transaction-history', loadChildren: './ui/transaction-history/transaction-history.module#TransactionHistoryPageModule' },

  // { path: 'menu', loadChildren: './ui/menu/menu.module#MenuPageModule' },
  // { path: 'add-account', loadChildren: './ui/add-account/add-account.module#AddAccountPageModule' },
  // { path: 'add-transaction', loadChildren: './ui/add-transaction/add-transaction.module#AddTransactionPageModule' },
  // { path: 'calendar', loadChildren: './ui/calendar/calendar.module#CalendarPageModule' },
  // { path: 'manage-account', loadChildren: './ui/manage-account/manage-account.module#ManageAccountPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
