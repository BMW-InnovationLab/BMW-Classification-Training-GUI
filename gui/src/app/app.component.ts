import {Component, OnInit} from '@angular/core';
import {JobsService} from './Services/jobs.service';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = '';
  link = '';
  runningJobs = [];

  constructor(public JobService: JobsService, private snackBar: MatSnackBar) {
    this.link = window.location.href.split('/')[3];
  }


  getRunningJobs() {
    this.JobService.getAllJobs().subscribe((jobs: string[]) => {
      this.runningJobs = jobs;
    }, error => this.handleError(error));
  }

  onActivate(componentReference) {
    componentReference.pageTitleOutput.subscribe((data) => {
      this.pageTitle = data;
    });
    this.link = window.location.href.split('/')[3];
  }

  handleError(error: HttpErrorResponse) {

    if (error.status === 404) {
      // A client-side or network error occurred. Handle it accordingly.
      this.snackBar.open('API unreachable', '', {duration: 3000, panelClass: 'redSnackBar'});
    }
    if (error.status === 400) {
      this.snackBar.open('Bad Request', '', {duration: 3000, panelClass: 'redSnackBar'});
    }
    if (error.status === 422) {
      this.snackBar.open('Validation error', '', {duration: 3000, panelClass: 'redSnackBar'});
    }
    if (error.status === 500) {
      this.snackBar.open('internal server error', '', {duration: 3000, panelClass: 'redSnackBar'});
    }
    if (error.status === 0) {
      this.snackBar.open('API down or unknown error ', '', {duration: 3000, panelClass: 'redSnackBar'});
    } else {
      this.snackBar.open(error.message, '', {duration: 3000, panelClass: 'redSnackBar'});
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}
