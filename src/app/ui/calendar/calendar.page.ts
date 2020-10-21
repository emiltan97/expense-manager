import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Transactions, TransactionsService } from 'src/app/services/transactions.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  income : number = 0;
  expense : number = 0;
  netWorth : number = 0;
  date: any;
  currentDate: any;
  datePicker: any;
  monthNames: string[];
  currentYear: any;
  currentMonth: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  currentMonthTransactions: Transactions[];
  lastMonthTransactions: Transactions[];
  nextMonthTransactions: Transactions[];
  currentDayTransactions: Transactions[];
  expenseHistory: Transactions[];
  incomeHistory: Transactions[];

  selectedDay:number = new Date().getDate();

  constructor(private transactionService:TransactionsService,private databaseService:DatabaseService,private navController:NavController) {
    this.date = new Date();
    this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.currentDate = new Date();
    this.datePicker = moment().format();
    this.getDaysOfMonth();
    this.getMonthlyTransactions();
    this.getLastMonthTransactions();
    this.getNextMonthTransactions();
  }

  getMonthlyTransactions(){
    this.currentMonthTransactions = [];
    this.transactionService.getTransactionsByDate(this.date).then((data:any)=>{
      this.currentMonthTransactions = data;
    });
  }

  getLastMonthTransactions(){
    this.lastMonthTransactions = [];
    this.transactionService.getTransactionsByDate(new Date(this.date.getFullYear(), this.date.getMonth()-1, 1)).then((data:any) => {
      this.lastMonthTransactions = data;
    });
  }

  getNextMonthTransactions(){
    this.nextMonthTransactions = [];
    this.transactionService.getTransactionsByDate(new Date(this.date.getFullYear(), this.date.getMonth()+1, 1)).then((data:any) => {
      this.nextMonthTransactions = data;
    });
  }

  checkExpense(day, monthIndicator) {
    this.loadTransactionsHistory(day, monthIndicator);
    this.expenseHistory = this.currentDayTransactions.filter((transactions) => {
      return transactions.TransactionTypeID === 2;
    });
    if (this.expenseHistory.length > 0) {
      return true;
    }
    return false;
  }

  checkIncome(day, monthIndicator) {

    this.loadTransactionsHistory(day, monthIndicator);
    this.incomeHistory = this.currentDayTransactions.filter((transactions) => {
      return transactions.TransactionTypeID === 1;
    });
    if (this.incomeHistory.length > 0){ return true; }
    return false;
  }

  loadTransactionsHistory(day, monthIndicator) {
    const currentDate = new Date(this.date.getFullYear(), this.date.getMonth() + monthIndicator, day);
    const formattedDate = this.transactionService.formatDate(currentDate);
    if (monthIndicator === 0){
      this.currentDayTransactions = this.currentMonthTransactions.filter((transactions) => {
        return (transactions.TransactionDate === formattedDate);
      });
    }
    else if (monthIndicator === 1){
      this.currentDayTransactions = this.nextMonthTransactions.filter((transactions) => {
        return (transactions.TransactionDate === formattedDate);
      });
    }
    else if (monthIndicator === -1){
      this.currentDayTransactions = this.lastMonthTransactions.filter((transactions) => {
        return (transactions.TransactionDate === formattedDate);
      });
    }
  }

  async getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if (this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }

    let firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDay();
    let prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for (let i = prevNumOfDays - (firstDayThisMonth); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    let thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    for (let j = 0; j < thisNumOfDays; j++) {
      this.daysInThisMonth.push(j + 1);
    }

    let lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();


    for (let k = 0; k < (6 - lastDayThisMonth); k++) {
      this.daysInNextMonth.push(k + 1);
    }
    let totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
    if (totalDays < 36) {
      for (let l = (7 - lastDayThisMonth); l < ((7 - lastDayThisMonth) + 7); l++) {
        this.daysInNextMonth.push(l);
      }
    }
  }

  goToLastMonth(){
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()-1, 1);
    this.datePicker = moment(this.date).format();
  }

  goToNextMonth(){
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
    this.datePicker = moment(this.date).format();
  }

  goToPickerMonth(){
    this.date = new Date(moment(this.datePicker).year(), moment(this.datePicker).month(), 1);
    this.getDaysOfMonth();
    this.getMonthlyTransactions();
    this.getLastMonthTransactions();
    this.getNextMonthTransactions();
  }

  swipeDateEvent(event){
    console.log(event);
    if (event.direction == 2)
    {
      this.goToNextMonth();
    }
    else if (event.direction == 4)
    {
      this.goToLastMonth();
    }
  }

  navigateToIncomeHistory(){
    this.databaseService.setCurrentTransactionType(1);
    let date = new Date(this.datePicker);
    date.setDate(this.selectedDay);
    this.transactionService.setDateTitle(date);
    let formattedDate:string = this.transactionService.formatDate(date);
    this.databaseService.setCalendarDate(formattedDate);
    this.databaseService.setCondition(true);
    this.navController.navigateForward(['/menu/transaction-history/']);
  }

  navigateToExpenseHistory(){
    this.databaseService.setCurrentTransactionType(2);
    let date = new Date(this.datePicker);
    date.setDate(this.selectedDay);
    this.transactionService.setDateTitle(date);
    let formattedDate:string = this.transactionService.formatDate(date);
    this.databaseService.setCalendarDate(formattedDate);
    this.databaseService.setCondition(true);
    this.navController.navigateForward(['/menu/transaction-history/']);
  }

  navigateToAllHistory(){
    this.databaseService.setCurrentTransactionType(0);
    let date = new Date(this.datePicker);
    date.setDate(this.selectedDay);
    this.transactionService.setDateTitle(date);
    let formattedDate:string = this.transactionService.formatDate(date);
    this.databaseService.setCalendarDate(formattedDate);
    this.navController.navigateForward(['/menu/transaction-history/']);
  }

  selectInNextMonth(day){

    this.selectedDay = day;
    this.checkExpense(day, 1);
    this.checkIncome(day, 1);

    this.expense = 0;
    if (this.expenseHistory.length > 0){
      for (let i = 0; i < this.expenseHistory.length; i++){
        this.expense += this.expenseHistory[i].TransactionAmount;
      }
    }

    this.income = 0;
    if (this.incomeHistory.length > 0){
      for (let i = 0; i < this.incomeHistory.length; i++){
        this.income += this.incomeHistory[i].TransactionAmount;
      }
    }

    this.netWorth = this.income - this.expense;
    this.goToNextMonth();

  }


  selectInLastMonth(day){

    this.selectedDay = day;
    this.checkExpense(day, 1);
    this.checkIncome(day, 1);

    this.expense = 0;
    if (this.expenseHistory.length > 0){
      for (let i = 0; i < this.expenseHistory.length; i++){
        this.expense += this.expenseHistory[i].TransactionAmount;
      }
    }

    this.income = 0;
    if (this.incomeHistory.length > 0){
      for (let i = 0; i < this.incomeHistory.length; i++){
        this.income += this.incomeHistory[i].TransactionAmount;
      }
    }

    this.netWorth = this.income - this.expense;
    this.goToLastMonth();
  }

  selectInCurrentMonth(day){
    this.selectedDay = day;
    this.checkExpense(day, 0);
    this.checkIncome(day, 0);

    this.expense = 0;
    if (this.expenseHistory.length > 0){
      for (let i = 0; i < this.expenseHistory.length; i++){
        this.expense += this.expenseHistory[i].TransactionAmount;
      }
    }

    this.income = 0;
    if (this.incomeHistory.length > 0){
      for (let i = 0; i < this.incomeHistory.length; i++){
        this.income += this.incomeHistory[i].TransactionAmount;
      }
    }

    this.netWorth = this.income - this.expense;
  }

  checkSelected(days){
    if (this.selectedDay === days){return true;}
    return false;
  }
}
