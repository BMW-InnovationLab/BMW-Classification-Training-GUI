import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {IHyperParameters} from '../../../../Interfaces/IHyperParameters';
import {MatSnackBar} from '@angular/material';
import {ConfigFileManagerService} from '../../../../Services/config-file-manager.service';

@Component({
  selector: 'app-hyper-parameters',
  templateUrl: './hyper-parameters.component.html',
  styleUrls: ['./hyper-parameters.component.css']
})
export class HyperParametersComponent implements OnInit {

  // hyperParameters: IHyperParameters = {
  //   // num_classes: 0,
  //   lr: 0,
  //   batch_size: 0,
  //   epochs: 0,
  //   // width: 0,
  //   // height: 0,
  //   // training_steps: 0,
  //   // eval_steps: 0
  // };
  FieldControl: FormGroup = new FormGroup({
    // num_classes: new FormControl(0, [Validators.required, this.checkIfIntValidator]),
    batch_size: new FormControl(1, [Validators.required, this.checkIfIntValidator]),
    learning_rate: new FormControl(0.01, [Validators.required, this.checkIfFloatValidator]),
    epochs: new FormControl(1, [Validators.required, this.checkIfIntValidator]),
    // width: new FormControl(0, [Validators.required, this.checkIfIntValidator]),
    // height: new FormControl(0, [Validators.required, this.checkIfIntValidator]),
    // training_steps: new FormControl(0, [Validators.required, this.checkIfIntValidator]),
    // eval_steps: new FormControl(0, [Validators.required, this.checkIfIntValidator])
  });
  // @Output() outputHyperParameters = new EventEmitter<IHyperParameters>();
  // // tslint:disable-next-line:no-input-rename
  // @Input('showImageControl') showImageControl: boolean;
  // // tslint:disable-next-line:no-input-rename
  // @Input('defaultHyperParameters') defaultHyperParameters: IHyperParameters;

  constructor(private snackBar: MatSnackBar,
              private configFileManager: ConfigFileManagerService) {
  }


  numCLassesValue;

  ngOnInit() {
    // console.log('entering hyper parameters');
    // const key = this.configFileManager.resetEnteringCreateJobComponent.value;
    // if ( key === 0 ) {
    //   this.configFileManager.resetEnteringCreateJobComponent.next(1);
    //   // console.log('key 0');
    //   this.FieldControl = new FormGroup({
    //       // num_classes: new FormControl(this.defaultHyperParameters.num_classes, [Validators.required, this.checkIfIntValidator]),
    //       batch_size: new FormControl(this.defaultHyperParameters.batch_size, [Validators.required, this.checkIfIntValidator]),
    //       learning_rate: new FormControl(this.defaultHyperParameters.lr, [Validators.required, this.checkIfFloatValidator]),
    //       // width: new FormControl(this.defaultHyperParameters.width, [Validators.required, this.checkIfIntValidator]),
    //       // height: new FormControl(this.defaultHyperParameters.height, [Validators.required, this.checkIfIntValidator]),
    //       // training_steps: new FormControl(this.defaultHyperParameters.training_steps, [Validators.required, this.checkIfIntValidator]),
    //       // eval_steps: new FormControl(this.defaultHyperParameters.eval_steps, [Validators.required, this.checkIfIntValidator])
    //     });
    // } else {
    //   // console.log('key else');
    //   this.FieldControl = new FormGroup({
    //     // num_classes: new FormControl(this.configFileManager.numClasses.value, [Validators.required, this.checkIfIntValidator]),
    //     batch_size: new FormControl(this.configFileManager.batchSize.value, [Validators.required, this.checkIfIntValidator]),
    //     learning_rate: new FormControl(this.configFileManager.learningRate.value, [Validators.required, this.checkIfFloatValidator]),
    //     // width: new FormControl(this.configFileManager.width.value, [Validators.required, this.checkIfIntValidator]),
    //     // height: new FormControl(this.configFileManager.height.value, [Validators.required, this.checkIfIntValidator]),
    //     // training_steps: new FormControl(this.configFileManager.trainingSteps.value, [Validators.required, this.checkIfIntValidator]),
    //     // eval_steps: new FormControl(this.configFileManager.evalSteps.value, [Validators.required, this.checkIfIntValidator])
    //   });
    // }
    //
    // this.configFileManager.resetEnteringCreateJobComponent.next(1);
    //
    // this.numCLassesValue = this.FieldControl.value.num_classes;

  }



  // ngOnDestroy(): void {
  //   // this.configFileManager.numClasses.next(this.FieldControl.value.num_classes);
  //   this.configFileManager.batchSize.next(this.FieldControl.value.batch_size);
  //   this.configFileManager.learningRate.next(this.FieldControl.value.learning_rate);
  //   // this.configFileManager.width.next(this.FieldControl.value.width);
  //   // this.configFileManager.height.next(this.FieldControl.value.height);
  //   // this.configFileManager.trainingSteps.next(this.FieldControl.value.training_steps);
  //   // this.configFileManager.evalSteps.next(this.FieldControl.value.eval_steps);
  // }

  checkIfIntValidator(value: AbstractControl): { [Key: string]: boolean } | null {
    if (String(value.value).match(/^[0-9]+$/)) {
      return null;
    }
    return {isNotInteger: true};
  }

  checkIfFloatValidator(value: AbstractControl): { [Key: string]: boolean } | null {
    if (String(value.value).match(/^[0]+(\.[0-9]{1,50})?$/)) {
      return null;
    }
    return {isNotFloat: true};
  }

  // validateData() {
  //   if (this.showImageControl === false) {
  //     this.FieldControl.get('width').setErrors(null);
  //     this.FieldControl.get('height').setErrors(null);
  //   }
  //   if (this.FieldControl.valid) {
  //     this.hyperParameters = this.FieldControl.value;
  //     this.outputHyperParameters.emit(this.hyperParameters);
  //     console.log(this.hyperParameters);
  //   } else {
  //     this.openSnackBar('Please enter the correct values before continuing', true);
  //   }
  //   return this.FieldControl.valid;
  // }
  // openSnackBar(message: string, isError: boolean) {
  //   this.snackBar.open(message, '', {
  //     duration: 3000, panelClass: isError ? 'redSnackBar' : 'greenSnackBar'
  //   });
  // }
}
