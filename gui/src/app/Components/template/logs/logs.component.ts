import {Component, OnInit, Inject, ViewChild, ChangeDetectorRef, ElementRef} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {JobsService} from '../../../Services/jobs.service';
import {Ijob} from '../../../Interfaces/ijob';
import {CdkVirtualScrollViewport, ScrollDispatcher} from '@angular/cdk/scrolling';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private jobService: JobsService) {
  }

  // @ts-ignore
  @ViewChild(CdkVirtualScrollViewport)
  public virtualScrollViewport?: CdkVirtualScrollViewport;

  ngOnInit() {
    setTimeout(() => {
      this.virtualScrollViewport.scrollTo({bottom: 0});
    } , 1);
  }

  refreshLogs() {
    const job: Ijob = {
      name: this.data.Job
    };
    this.jobService.getJobLogs(job).subscribe((jobLogs: string[]) => {
      this.data.jobLogs = jobLogs;
      this.virtualScrollViewport.scrollTo({bottom: 0});
    });

  }

  downloadLogs() {
    let downloadableData = '';
    for (const key of this.data.jobLogs.values()) {
      downloadableData = downloadableData + key + '\n';
    }
    const blob = new Blob( [downloadableData] , { type: 'text/txt; charset=utf-8' });
    fileSaver.saveAs(blob, this.data.Job + '_logs ' + new Date().toDateString() + '.txt');
  }


}
