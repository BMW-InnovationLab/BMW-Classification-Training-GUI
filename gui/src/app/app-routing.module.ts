import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {JobsPageComponent} from './features/jobs-page/jobs-page.component';
import {LandingPageComponent} from './core/components/landing-page/landing-page.component';
import {StepperPageComponent} from './features/stepper-page/stepper-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'jobs',
    component: JobsPageComponent
  },
  {
    path: 'stepper',
    component: StepperPageComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
