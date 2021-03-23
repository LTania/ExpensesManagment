import { Injectable } from '@angular/core';
import { ExpenseModel } from '../models/expense.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  expensesList: ExpenseModel[] = [];
  private accessKey = '74f94f34eca705043658516ba1c75a90';
  constructor(private http: HttpClient) { }

  addExpense(expense: ExpenseModel): void{
    this.expensesList.push(expense);
  }

  deleteByDate(date: Date): void{
    this.expensesList = this.expensesList.filter((f) => f.occurredDate.getTime() !== date.getTime());
  }

  getList(): Observable<ExpenseModel[]>{
    return of(this.expensesList);
  }

  getCurrencyInfo(){
    return this.http.get<any>(`http://data.fixer.io/api/latest?access_key=${this.accessKey}`);
  }
}
