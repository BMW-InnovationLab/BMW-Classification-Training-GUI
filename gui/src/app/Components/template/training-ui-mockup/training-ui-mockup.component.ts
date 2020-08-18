import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {JobsService} from '../../../Services/jobs.service';
import {Ijob} from '../../../Interfaces/ijob';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {MatDialog, MatSnackBar} from '@angular/material';
import {environment} from '../../../../environments/environment';
import {DialogComponent} from './dialog/dialog.component';
import {LogsComponent} from '../logs/logs.component';
import {DataGetter} from '../../../Services/data-getter.service';
import {Router} from '@angular/router';
import {IPorts} from "../../../Interfaces/Ports";


@Component({
  selector: 'app-training-ui-mockup',
  templateUrl: './training-ui-mockup.component.html',
  styleUrls: ['./training-ui-mockup.component.css']
})
export class TrainingUIMockupComponent implements OnInit, OnDestroy {
  jobs: string[];
  finishedJobs: string[];
  @Output() pageTitleOutput = new EventEmitter<string>();
  @Output() LogsOutput = new EventEmitter<string>();

  pageTitle = 'Classification Training GUI';
  showSpinner = true;
  baseUrl = environment.url;
  baseEndpoint = environment.baseEndPoint;
  downloadableModels: string[] = [];
  URL = this.baseUrl + this.baseEndpoint + '/models/';
  interval;


  constructor(private JobService: JobsService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private gpuGetterService: DataGetter,
              private router: Router) {
  }

  ngOnInit() {
    this.JobService.getAllJobs().subscribe((jobs: string[]) => {
      this.jobs = jobs;
      this.JobService.jobs.next(jobs);
      this.showSpinner = false;
    }, error => this.handleError(error));
    this.JobService.getDownloadableModels().subscribe((models: string[]) => {
      this.downloadableModels = models;
      this.JobService.downloadableModels.next(models);
    }, error => this.handleError(error));
    this.pageTitleOutput.emit(this.pageTitle);

    this.JobService.getFinishedJobs().subscribe(jobsDone => {
      this.finishedJobs = jobsDone;
    });

    this.startTimer();
  }

  ngOnDestroy(): void {
    this.pauseTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.JobService.getFinishedJobs().subscribe(jobsDone => {
        this.finishedJobs = jobsDone;
      });
    }, 30000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

   jobIsDone = (job: string) => {
    if (this.finishedJobs !== undefined) {
      return this.finishedJobs.indexOf(job);
    }
    return -1;
   }


  checkGpuAvailability() {
    // this.gpuGetterService.getAvailableGPUs().subscribe((AvailableGPUsResponse: number[]) => {
    //   if (AvailableGPUsResponse.length < 1) {
    //     this.snackBar.open('Can\'t Create Job, No GPU Available At this Time', '', {
    //       duration: 3000,
    //       panelClass: 'redSnackBar'
    //     });
    //   } else {
        this.router.navigate(['../newJob']);
    //   }
    // }, error1 => this.handleError(error1));
  }

  openDialog(jobName: string) {
    const dialogref = this.dialog.open(DialogComponent, {data: jobName, width: '25vw'});
    dialogref.afterClosed().subscribe(result => {
      this.JobService.getAllJobs().subscribe((jobs: string[]) => {
        this.jobs = jobs;
        this.JobService.jobs.next(jobs);
      });
    });
  }


  monitorJob(jobName: string) {
    const job: Ijob = {
      name: jobName
    };
    this.JobService.monitorJob(job).subscribe((jobPortResponse: IPorts) => {
      this.showSpinner = true;
      this.JobService.refreshMonitor(jobPortResponse.apiPort).subscribe( (resp: any) => {
        setTimeout(() => {
          this.showSpinner = false;
          window.open(environment.url + jobPortResponse.tensorboardPort, '_blank');
        }, 1500);
      });
    });
  }

  test() {
    window.open(environment.inferenceAPIUrl, '_blank');
  }

  getAvailableModelsToDownload() {
    this.JobService.getDownloadableModels().subscribe((models: string[]) => {
      this.downloadableModels = models;
      this.JobService.downloadableModels.next(models);
    }, error => this.handleError(error));
  }

  jobLogs(jobName: string) {
    const job: Ijob = {
      name: jobName
    };


    this.JobService.getJobLogs(job).subscribe((jobLogs: string[]) => {
      this.dialog.open(LogsComponent, {
        data: {jobLogs, Job: jobName}
      });
    });
  }

  handleError(error: HttpErrorResponse) {

    this.showSpinner = false;
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


  getNameOfModel = (model: string) => {
    const arr = model.split('-');
    let name = '';
    for ( let i = 0 ; i < arr.length - 1 ; i++) {
      if ( i === arr.length - 2 ) {
        name = name + arr[i];
      } else {
      name = name + arr[i] + '-';
      }
    }
    if ( arr.length === 1 ) {
      name = model;
    }

    return name;
  }

  getTypeOfModel = (model: string) => {
    const arr = model.split('-');
    if ( arr.length !== 1) {
    return arr[arr.length - 1];
    }
    // else {
    //   return model;
    // }
  }

}
