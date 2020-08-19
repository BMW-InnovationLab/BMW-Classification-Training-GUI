import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
      batch_size: [1, [Validators.required]],
      learning_rate: [0.01, [Validators.required]],
      epochs: [1, [Validators.required]],
      momentum: [0.9, [Validators.required]],
      wd: [0.0001, [Validators.required]],
      lr_factor: [0.75, [Validators.required]],
      num_workers: [8, [Validators.required]],
      jitter_param: [0.4, [Validators.required]],
      lighting_param: [0.1, [Validators.required]],
      processor: [this.selectedProcessor, [Validators.required]],
      Xavier: [this.selectedXavier, [Validators.required]],
      MSRAPrelu: [this.selectedMSRAPrelu, [Validators.required]],
      data_augmenting: [this.selectedDataAugmenting, [Validators.required]],
    });
  }

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
