import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataGetterFirstApiService } from '../../../../Services/data-getter-first-api.service';

@Component({
  selector: 'app-prepare-dataset',
  templateUrl: './prepare-dataset.component.html',
  styleUrls: ['./prepare-dataset.component.css']
})
export class PrepareDatasetComponent implements OnInit {

  constructor(private fb: FormBuilder, private dataGetterFirstApi: DataGetterFirstApiService) {
    this.validateForm = this.fb.group({
      dataset_name: ['', [Validators.required]],
      training: [80, [Validators.required]],
      validation: [10, [Validators.required]],
      testing: [10, [Validators.required]]
    });
  }

  validateForm: FormGroup;
  availableFiles: string[] = [];
  sum = 0;
  parserPercent = (value: string) => value.replace(/[.]\d*/, '');

  submitForm(value: { dataset_name: string; training: string; validation: string; testing: string}): void {
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.sum = this.validateForm.value.training + this.validateForm.value.validation + this.validateForm.value.testing;
  }

  ngOnInit(): void {
    this.dataGetterFirstApi.getDataSets().subscribe((availableFolders: string[]) => {
      this.availableFiles = availableFolders;
    });
  }

}
