import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-hyper-parameters',
  templateUrl: './hyper-parameters.component.html',
  styleUrls: ['./hyper-parameters.component.css']
})
export class HyperParametersComponent implements OnInit {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      batch_size: [1, [Validators.required]],
      learning_rate: [0.01, [Validators.required]],
      epochs: [1, [Validators.required]],
    });
  }

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
