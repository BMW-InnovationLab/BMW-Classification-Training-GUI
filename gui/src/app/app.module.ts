import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { routingComponents } from './app-routing.module';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  NgZorroAntdModule,
  NzAlertModule, NzBadgeModule,
  NzCardModule,
  NzDividerModule,
  NzEmptyModule, NzFormModule,
  NzGridModule, NzInputModule, NzInputNumberModule, NzLayoutModule,
  NzListModule, NzModalModule,
  NzPaginationModule,
  NzPopconfirmModule,
  NzPopoverModule, NzSelectModule, NzStepsModule, NzToolTipModule
} from 'ng-zorro-antd';
import { StepperPageComponent } from './Components/stepper-page/stepper-page.component';
import { PrepareDatasetComponent } from './Components/stepper-page/forms/prepare-dataset/prepare-dataset.component';
import { GeneralSettingsComponent } from './Components/stepper-page/forms/general-settings/general-settings.component';
import { HyperParametersComponent } from './Components/stepper-page/forms/hyper-parameters/hyper-parameters.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { AdvancedHyperParametersComponent } from './Components/stepper-page/forms/advanced-hyper-parameters/advanced-hyper-parameters.component';

@NgModule({
    declarations: [
        AppComponent,
        routingComponents,
        StepperPageComponent,
        PrepareDatasetComponent,
        GeneralSettingsComponent,
        HyperParametersComponent,
        AdvancedHyperParametersComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzPopoverModule,
    NzEmptyModule,
    NzGridModule,
    NzCardModule,
    NzListModule,
    NzPaginationModule,
    NzPopconfirmModule,
    NzLayoutModule,
    NzStepsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule,
    NzAlertModule,
    NzToolTipModule,
    NzBadgeModule,
    NzModalModule,
    ScrollingModule,
    NgZorroAntdModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
