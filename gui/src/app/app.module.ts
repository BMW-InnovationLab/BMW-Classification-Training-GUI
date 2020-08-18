import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import {AppComponent} from './app.component';
import {TrainingUIMockupComponent} from './Components/template/training-ui-mockup/training-ui-mockup.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatButtonModule} from '@angular/material/button';
import {AppRoutingModule} from './app-routing.module';
import {RouteNotFoundComponent} from './Components/route-not-found/route-not-found.component';
import {PrepareDatasetsComponent} from './Components/template/create-job/prepare-datasets/prepare-datasets.component';
import {CreateJobComponent} from './Components/template/create-job/create-job.component';
import {ContainerSettingsComponent} from './Components/template/create-job/container-settings/container-settings.component';
import {HyperParametersComponent} from './Components/template/create-job/hyper-parameters/hyper-parameters.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule, MatCheckboxModule, MatInputModule, MatListModule, MatSlideToggleModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DialogComponent} from './Components/template/training-ui-mockup/dialog/dialog.component';
import {LogsComponent} from './Components/template/logs/logs.component';
// tslint:disable-next-line:max-line-length
import { AdvancedHyperParametersComponent } from './Components/template/create-job/advanced-hyper-parameters/advanced-hyper-parameters.component';
import {FlexModule} from '@angular/flex-layout';
import {MatMenuModule} from '@angular/material/menu';

// tslint:disable-next-line:max-line-length
@NgModule({
  declarations: [
    AppComponent,
    TrainingUIMockupComponent,
    RouteNotFoundComponent,
    PrepareDatasetsComponent,
    CreateJobComponent,
    ContainerSettingsComponent,
    HyperParametersComponent,
    DialogComponent,
    LogsComponent,
    AdvancedHyperParametersComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatButtonModule,
    AppRoutingModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    FlexModule,
    MatMenuModule,
    MatProgressBarModule

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent, LogsComponent],


})
export class AppModule {
}
