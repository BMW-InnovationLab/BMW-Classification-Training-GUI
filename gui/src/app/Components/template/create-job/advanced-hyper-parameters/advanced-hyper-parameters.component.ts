import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {AdvancedHyperParameters} from '../../../../Interfaces/advanced-hyper-parameters';
import {ConfigFileManagerService} from '../../../../Services/config-file-manager.service';

@Component({
  selector: 'app-advanced-hyper-parameters',
  templateUrl: './advanced-hyper-parameters.component.html',
  styleUrls: ['./advanced-hyper-parameters.component.css']
})
export class AdvancedHyperParametersComponent implements OnInit , OnDestroy {

  hyperParameters: AdvancedHyperParameters = {
    content: '',
    training_steps: 0,
    eval_steps: 0
  };

  FieldControl: FormGroup = new FormGroup({
    training_steps: new FormControl('', [Validators.required, this.checkIfIntValidator]),
    eval_steps: new FormControl('', [Validators.required, this.checkIfIntValidator]),
    content: new FormControl('', [Validators.required])
  });

  @Output() outputHyperParameters = new EventEmitter<AdvancedHyperParameters>();
  @Input() showImageControl: boolean;
  @Input() configFile = '';


  constructor(private snackBar: MatSnackBar,
              private configFileManager: ConfigFileManagerService) {
  }

  ngOnInit() {
    const key = this.configFileManager.resetEnteringCreateJobComponent.value;
    if ( key === 0 ) {
      // this.configFileManager.resetEnteringCreateJobComponentAvancedHyperParameters.next(1);
      this.FieldControl = new FormGroup({
        training_steps: new FormControl('', [Validators.required, this.checkIfIntValidator]),
        eval_steps: new FormControl('', [Validators.required, this.checkIfIntValidator]),
        content: new FormControl(this.configFile, [Validators.required])
      });
    } else {
      this.FieldControl = new FormGroup({
        // tslint:disable-next-line:max-line-length
        training_steps: new FormControl(this.configFileManager.trainingSteps.value, [Validators.required, this.checkIfIntValidator]),
        // tslint:disable-next-line:max-line-length
        eval_steps: new FormControl(this.configFileManager.evalSteps.value, [Validators.required, this.checkIfIntValidator]),
        content: new FormControl([this.configFile], [Validators.required])
      });
    }
  }

  ngOnDestroy(): void {
    this.configFileManager.trainingSteps.next(this.FieldControl.value.training_steps);
    this.configFileManager.evalSteps.next(this.FieldControl.value.eval_steps);
  }


  checkIfIntValidator(value: AbstractControl): { [Key: string]: boolean } | null {
    if (String(value.value).match(/^[0-9]+$/)) {
      return null;
    }
    return {isNotInteger: true};
  }

  // validateData() {
  //   // tslint:disable-next-line:max-line-length
  //   const trainingStepsField = this.FieldControl.get('trainingSteps').hasError('required')
  //   || this.FieldControl.get('trainingSteps').hasError('isNotInteger');
  //   // tslint:disable-next-line:max-line-length
  //   const evaluationSteps = this.FieldControl.get('evaluationSteps').hasError('required')
  //   || this.FieldControl.get('evaluationSteps').hasError('isNotInteger');
  //
  //   // tslint:disable-next-line:max-line-length
  //   if (!trainingStepsField && !evaluationSteps) {
  //     // tslint:disable-next-line:radix
  //     this.hyperParameters.training_steps = parseInt(this.trainingStepsField);
  //     // tslint:disable-next-line:radix
  //     this.hyperParameters.eval_steps = parseInt(this.evaluationStepsField);
  //     this.hyperParameters.content = this.configFile;
  //     this.outputHyperParameters.emit(this.hyperParameters);
  //     return true;
  //   }
  //   const trainingStepsFieldRequired = this.FieldControl.get('trainingSteps').hasError('required');
  //   const evaluationStepsRequired = this.FieldControl.get('evaluationSteps').hasError('required');
  //
  //   // tslint:disable-next-line:max-line-length
  //   if (trainingStepsFieldRequired || evaluationStepsRequired) {
  //     this.openSnackBar('Please finish assigning values before continuing', true);
  //   } else {
  //     this.openSnackBar('Please enter the correct values before continuing', true);
  //   }
  //   return false;
  // }

  validateData() {
    console.log(this.FieldControl.get('content').value);
    if (this.FieldControl.valid) {
      this.hyperParameters = this.FieldControl.value;
      // console.log(this.configFile);
      // this.hyperParameters.content = this.configFile;
      // this.hyperParameters.content = this.configFile;
      // this.hyperParameters.content = this.configFile;

      this.outputHyperParameters.emit(this.hyperParameters);
    } else {
      this.openSnackBar('Please enter the correct values before continuing', true);
    }
    return this.FieldControl.valid;
  }

  openSnackBar(message: string, isError: boolean) {
    this.snackBar.open(message, '', {
      duration: 3000, panelClass: isError ? 'redSnackBar' : 'greenSnackBar'
    });
  }

}
