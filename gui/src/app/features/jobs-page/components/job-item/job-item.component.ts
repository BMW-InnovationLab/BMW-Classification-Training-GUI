import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.css']
})
export class JobItemComponent implements OnInit {
  @Input() job: string;
  @Input() finishedJobs: Array<string> = [];
  @Input() downloadableModels: any = [];
  @Output() jobRemoved: EventEmitter<string> = new EventEmitter<string>();
  @Output() logsRequested: EventEmitter<string> = new EventEmitter<string>();
  public readonly modelsUrl = environment.url + environment.baseEndPoint + '/models/';
  public mobile: boolean;
  public windowHeightSmall: boolean;
  public removePopupText = 'Cancel Job?';

  constructor() { }

  ngOnInit(): void {
    this.initializeScreenSettings();
  }

  private initializeScreenSettings() {
    this.mobile = window.screen.width <= 1024;
    this.windowHeightSmall = window.screen.height < 710;
    window.onresize = () => {
      this.mobile = window.screen.width <= 1024;
      this.windowHeightSmall = window.screen.height < 710;
    };
  }

  // checks if the job is done or still running
  public jobIsDone = (job: string): number => {
    return this.finishedJobs && this.finishedJobs.indexOf(job);
  }

  // checks if job is running or done to state whether the popup text should be 'cancel job' or 'close job'
  public jobRemovePopupText(jobs) {
    if (this.jobIsDone(jobs) !== -1) {
      this.removePopupText = 'Close Job?';
    }
  }

  // gets the value of a model since the model is a dictionary list and is split into ModelKeys array and ModeValues array
  public getSpecificJobDownloadableModelValue = (jobs: string) => {
    if (this.downloadableModels !== undefined) {
      let value = '';
      Object.keys(this.downloadableModels).forEach(key => {
        if (jobs + '.zip' === key) {
          value =  this.downloadableModels[key];
        }
      });
      return value;
    }
  }

  public onJobRemove(job){
    this.jobRemoved.emit(job);
  }

  logsButton(job: string) {
    this.logsRequested.emit(job);
  }
}
