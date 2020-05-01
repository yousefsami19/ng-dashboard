import {
  Component,
  Output,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  AfterContentInit,
  ElementRef,
  Input,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { error } from '../../services/common';
import { BehaviorSubject, Subscription, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'ngd-day-picker',
  templateUrl: './day-picker.component.html',
  styleUrls: ['./day-picker.component.scss'],
})
export class DayPickerComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChildren('dayButton') buttons: QueryList<ElementRef>;
  @Input() public params = { day: 1 };

  public error = error;
  public days = Array.from(new Array(31)).map((t, index) => index + 1);

  @Output() public data: BehaviorSubject<any> = new BehaviorSubject(null);
  public subscribe: Subscription = null;

  public form = new FormGroup({
    day: new FormControl(),
  });

  ngOnInit() {
    this.subscribe = this.form.valueChanges.subscribe((data) => {
      this.data.next({
        ...this.form.value,
      });
    });
  }

  ngAfterContentInit() {
    of(null)
      .pipe(
        delay(0),
        tap(() => {
          if (this.params.day) {
            this.form.patchValue({ day: this.params.day });
          }
        }),
        tap(() =>
          this.buttons.toArray()[this.form.value.day - 1].nativeElement.focus()
        )
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }

  public dayButtonClick(day: number) {
    this.form.patchValue({ day });
  }
}