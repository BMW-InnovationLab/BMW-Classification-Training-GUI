import {Ijob} from '../../../../Interfaces/ijob';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Config} from 'codelyzer';
import {JobsService} from '../../../../Services/jobs.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {throwError} from 'rxjs';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private JobService: JobsService, private snackBar: MatSnackBar) {
  }


  ngOnInit() {

  }

  stopJob() {
    const job: Ijob = {
      name: this.data
    };
    this.JobService.stopJob(job).subscribe(() => {
    }, error => this.handleError(error));
    this.snackBar.open('Job Deleted !', '', {duration: 4000});

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
