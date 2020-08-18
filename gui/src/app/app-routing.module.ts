import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TrainingUIMockupComponent} from './Components/template/training-ui-mockup/training-ui-mockup.component';
import {RouteNotFoundComponent} from './Components/route-not-found/route-not-found.component';
import {CreateJobComponent} from './Components/template/create-job/create-job.component';


const routes: Routes = [
  {path: 'training', component: TrainingUIMockupComponent},
  {path: 'newJob', component: CreateJobComponent},
  {path: '', redirectTo: 'training', pathMatch: 'full'},
  {path: '**', component: RouteNotFoundComponent}

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
