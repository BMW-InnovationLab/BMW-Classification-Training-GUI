import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';

@Component({
  selector: 'app-hyper-parameters',
  templateUrl: './hyper-parameters.component.html',
  styleUrls: ['./hyper-parameters.component.css']
})
export class HyperParametersComponent implements OnInit {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      batch_size: [1, [Validators.required], [this.checkIfIntValidator]],
      learning_rate: [0.01, [Validators.required], [this.checkIfFloatValidator]],
      epochs: [1, [Validators.required], [this.checkIfIntValidator]],
    });
  }

  checkIfFloatValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
        if (!String(control.value).match(/^[0]+(\.[0-9]{1,50})?$/)) {
          observer.next({ error: true, notFloat: true });
        } else {
          observer.next(null);
        }
        observer.complete();
    })

  checkIfIntValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      if (!String(control.value).match(/^[0-9]+$/)) {
        observer.next({ error: true, notInt: true });
      } else {
        observer.next(null);
      }
      observer.complete();
    })

  submitForm(value: { batch_size: number; learning_rate: number; epochs: number; }): void {
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  ngOnInit(): void {
  }

}
