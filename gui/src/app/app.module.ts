import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {
    NgZorroAntdModule,
    NzAlertModule,
    NzBadgeModule, NzCardModule, NzDividerModule, NzEmptyModule, NzFormModule, NzGridModule, NzInputModule, NzInputNumberModule,
    NzLayoutModule, NzListModule, NzModalModule, NzPaginationModule,
    NzPopconfirmModule,
    NzPopoverModule, NzSelectModule,
    NzStepsModule, NzToolTipModule
} from 'ng-zorro-antd';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ErrorHandler} from './core/interceptors/error-handler';
import {LandingPageComponent} from './core/components/landing-page/landing-page.component';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {HeaderComponent} from './shared/components/header/header.component';
import {HyperParametersComponent} from './features/stepper-page/components/hyper-parameters/hyper-parameters.component';
import {GeneralSettingsComponent} from './features/stepper-page/components/general-settings/general-settings.component';
import {PrepareDatasetComponent} from './features/stepper-page/components/prepare-dataset/prepare-dataset.component';
import {StepperPageComponent} from './features/stepper-page/stepper-page.component';
import {AdvancedHyperParametersComponent} from './features/stepper-page/components/advanced-hyper-parameters/advanced-hyper-parameters.component';
import {JobsPageComponent} from './features/jobs-page/jobs-page.component';
import { JobItemComponent } from './features/jobs-page/components/job-item/job-item.component';
import { LogsModalComponent } from './features/jobs-page/components/logs-modal/logs-modal.component';
import {NotFoundComponent} from './core/components/not-found/not-found.component';

registerLocaleData(en);


@NgModule({
    declarations: [
        AppComponent,
        LandingPageComponent,
        JobsPageComponent,
        StepperPageComponent,
        PrepareDatasetComponent,
        GeneralSettingsComponent,
        HyperParametersComponent,
        AdvancedHyperParametersComponent,
        HeaderComponent,
        JobItemComponent,
        LogsModalComponent,
        NotFoundComponent,
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
        NzMessageModule,
    ],
    providers: [
        {
            provide: NZ_I18N, useValue: en_US
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandler,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
