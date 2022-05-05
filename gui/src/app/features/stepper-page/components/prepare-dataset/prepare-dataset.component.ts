import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataGetterFirstApiService } from '../../../../core/services/data-getter-first-api.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-prepare-dataset',
  templateUrl: './prepare-dataset.component.html',
  styleUrls: ['./prepare-dataset.component.css']
})
export class PrepareDatasetComponent implements OnInit {
  public prepareDatasetForm: FormGroup;
  public availableFoldersKeys = [];
  public availableFoldersValue = [];
  // private sum: number;

  constructor(private fb: FormBuilder,
              private dataGetterFirstApi: DataGetterFirstApiService,
              private message: NzMessageService) {
    this.prepareDatasetForm = this.fb.group({
      dataset_name: ['', [Validators.required]],
      training_ratio: [80, [Validators.required]],
      validation_ratio: [10, [Validators.required]],
      testing_ratio: [10, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.dataGetterFirstApi.getDataSets().subscribe((availableFolders: string[]) => {
      for (const [key, value] of Object.entries(availableFolders)) {
        this.availableFoldersKeys.push(key);
        this.availableFoldersValue.push(value);
      }
    }, (error) => this.message.error(error));
  }


  public parserPercent = (value: string) => value.replace(/[.]\d*/, '');

  private submitForm(): boolean{
    // tslint:disable-next-line:forin
    for (const key in this.prepareDatasetForm.controls) {
      this.prepareDatasetForm.controls[key].markAsDirty();
      this.prepareDatasetForm.controls[key].updateValueAndValidity();
    }
    return this.prepareDatasetForm.valid;
  }
  private sumValid(): boolean{
    const sum: number = this.prepareDatasetForm.value.training_ratio + this.prepareDatasetForm.value.validation_ratio +
        this.prepareDatasetForm.value.testing_ratio;
    if (sum !== 100){
      this.message.error('Sum of split percentage is not 100', {
        nzDuration: 3000
      });
      return false;
    }
    return true;
  }

  public formValid(): boolean{
    return this.submitForm() && this.sumValid();
  }
}
