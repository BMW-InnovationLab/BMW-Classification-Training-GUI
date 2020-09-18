import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';

@Component({
  selector: 'app-advanced-hyper-parameters',
  templateUrl: './advanced-hyper-parameters.component.html',
  styleUrls: ['./advanced-hyper-parameters.component.css']
})
export class AdvancedHyperParametersComponent implements OnInit {

  validateForm: FormGroup;
  selectedProcessor = 'CPU';
  selectedXavier = true;
  selectedMSRAPrelu = false;
  selectedDataAugmenting = true;

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      batch_size: [1, [Validators.required], [this.checkIfIntValidator]],
      learning_rate: [0.01, [Validators.required], [this.checkIfFloatValidator]],
      epochs: [1, [Validators.required], [this.checkIfIntValidator]],
      momentum: [0.9, [Validators.required], [this.checkIfFloatValidator]],
      wd: [0.0001, [Validators.required], [this.checkIfFloatValidator]],
      lr_factor: [0.75, [Validators.required], [this.checkIfFloatValidator]],
      num_workers: [8, [Validators.required], [this.checkIfIntValidator]],
      jitter_param: [0.4, [Validators.required], [this.checkIfFloatValidator]],
      lighting_param: [0.1, [Validators.required], [this.checkIfFloatValidator]],
      processor: [this.selectedProcessor, [Validators.required]],
      Xavier: [this.selectedXavier, [Validators.required]],
      MSRAPrelu: [this.selectedMSRAPrelu, [Validators.required]],
      data_augmenting: [this.selectedDataAugmenting, [Validators.required]],
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

  submitForm(value: { batch_size: number; learning_rate: number; epochs: number; momentum: number; wd: number; lr_factor: number;
  num_workers: number; jitter_param: number; lighting_param: number; processor: string; Xavier: boolean; MSRAPrelu: boolean;
  data_augmenting: boolean}): void {
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  ngOnInit(): void {
  }

}
