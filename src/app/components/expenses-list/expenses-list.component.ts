import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExpensesService } from '../../core/services/expenses.service';
import { ExpenseModel } from '../../core/models/expense.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.sass']
})
export class ExpensesListComponent implements OnInit, OnDestroy {
  expensesList: ExpenseModel[] = [];
  private destroy$ = new Subject();

  constructor(private expensesService: ExpensesService) { }

  ngOnInit(): void {
    this.expensesService.getList()
      .pipe(takeUntil(this.destroy$))
      .subscribe( data => this.expensesList = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
