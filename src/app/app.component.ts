import { Component, OnInit } from '@angular/core';
import { ExpensesService } from './core/services/expenses.service';
import { ExpenseModel } from './core/models/expense.model';

export enum Command{ADD = 'add', LIST = 'list', CLEAR = 'clear', TOTAL = 'total'}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  title = 'expenses-management';
  command = 'add 2021-03-05 6 USD Cake';
  commandArr: any;
  message = '';
  isShownMessage = false;
  isShownList = false;
  currencyInfo: any;

  constructor(private expenseService: ExpensesService) {}

  ngOnInit(): void{
    this.expenseService.getCurrencyInfo().subscribe(info => this.currencyInfo = info)
  }

  run(): void{
    this.commandArr = this.command.match(/[^\s"]+|"([^"]*)"/gi)
    if (this.commandArr[0] === Command.ADD && this.commandArr.length === 5 ){
      if (this.isRealCurrency(this.commandArr[3])){
        this.addExpense();
      } else {
        this.message = `Try real currency like UAH not ${this.message[3]}`;
        this.isShownMessage = true;
      }
    } else if (this.commandArr[0] === Command.LIST && this.commandArr.length === 1){
      this.showList();
    } else if (this.commandArr[0] === Command.CLEAR && this.commandArr.length === 2){
      this.clearList();
    } else if (this.commandArr[0] === Command.TOTAL && this.commandArr.length === 2){
      this.getTotal();
    } else {
      this.message = `There aren't command ${this.commandArr[0]}`;
      this.isShownMessage = true;
    }
    this.command = '';
  }

  isRealCurrency(curr: string): boolean{
    if (this.currencyInfo.rates[curr]) {
      return true;
    } else {
      return false;
    }
  }

  addExpense(): void{
    const expense: ExpenseModel = {
      occurredDate: new Date(this.commandArr[1]),
      amountMoney: +this.commandArr[2],
      currency: this.commandArr[3],
      product: this.commandArr[4]
    };
    this.expenseService.addExpense(expense);
    this.message = `You added ${expense.product} to list`;
    this.isShownMessage = true;
    this.isShownList = false;
  }

  showList(): void{
    this.isShownMessage = false;
    this.isShownList = true;
  }

  clearList(): void{
    const dateToDelete = new Date(this.commandArr[1]);
    this.expenseService.deleteByDate(dateToDelete);
    this.message = `You deleted all products from ${this.commandArr[1]}`;
    this.isShownMessage = true;
    this.isShownList = false;
  }

  getTotal(): void{
    const curr = this.commandArr[1];
    let myList: ExpenseModel[] = [];
    let eurSum = 0;
    this.expenseService.getList().subscribe(l => myList = l);
    myList.forEach(item => {
      const eurMoney = item.amountMoney / +this.currencyInfo.rates[item.currency];
      eurSum += eurMoney;
    });
    const total = eurSum * +this.currencyInfo.rates[curr];
    if (!total){
      this.message = `Try real currency like UAH not ${curr}`;
    } else {
      this.message = `You spent ${total.toFixed(2)} ${curr}`;
    }
    this.isShownMessage = true;
    this.isShownList = false;
  }
}
