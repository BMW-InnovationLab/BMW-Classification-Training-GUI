import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';

@Component({
  selector: 'app-advanced-hyper-parameters',
  templateUrl: './advanced-hyper-parameters.component.html',
  styleUrls: ['./advanced-hyper-parameters.component.css']
})
export class AdvancedHyperParametersComponent {
  public advancedParametersForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.advancedParametersForm = this.fb.group({
      batch_size: [1, [Validators.required], [this.checkIfIntValidator]],
      lr: [0.01, [Validators.required], [this.checkIfFloatValidator]],
      epochs: [1, [Validators.required], [this.checkIfIntValidator]],
      momentum: [0.9, [Validators.required], [this.checkIfFloatValidator]],
      wd: [0.0001, [Validators.required], [this.checkIfFloatValidator]],
      lr_factor: [0.75, [Validators.required], [this.checkIfFloatValidator]],
      num_workers: [1, [Validators.required], [this.checkIfIntValidator]],
      jitter_param: [0.4, [Validators.required], [this.checkIfFloatValidator]],
      lighting_param: [0.1, [Validators.required], [this.checkIfFloatValidator]],
      processor: ['CPU', [Validators.required]],
      Xavier: [true, [Validators.required]],
      MSRAPrelu: [false, [Validators.required]],
      data_augmenting: [true, [Validators.required]],
    });
  }


  public checkIfFloatValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      if (!String(control.value).match(/^[0]+(\.[0-9]{1,50})?$/)) {
        observer.next({ error: true, notFloat: true });
      } else {
        observer.next(null);
      }
      observer.complete();
    })

  public checkIfIntValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      if (!String(control.value).match(/^[0-9]+$/)) {
        observer.next({ error: true, notInt: true });
      } else {
        observer.next(null);
      }
      observer.complete();
    })

  public formValid(): boolean {
    // tslint:disable-next-line:forin
    for (const key in this.advancedParametersForm.controls) {
      this.advancedParametersForm.controls[key].markAsDirty();
      this.advancedParametersForm.controls[key].updateValueAndValidity();
    }
    return this.advancedParametersForm.valid;
  }
}
