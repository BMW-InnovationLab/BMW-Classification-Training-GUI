import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataGetterFirstApiService} from '../../core/services/data-getter-first-api.service';
import {DataSenderFirstApiService} from '../../core/services/data-sender-first-api.service';
import {forkJoin} from 'rxjs';
import {tap} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {HeaderTitle} from '../../core/domain/enums/header-title';

@Component({
    selector: 'app-jobs-page',
    templateUrl: './jobs-page.component.html',
    styleUrls: ['./jobs-page.component.css']
})
export class JobsPageComponent implements OnInit, OnDestroy {
    private specificJob;
    private refreshInterval;
    public readonly title: HeaderTitle = HeaderTitle.DISPLAY;
    public readonly PAGE_SIZE = 5;
    public downloadableModels: any;
    public jobsToDisplay: Array<string> = [];
    public allJobs: Array<string> = [];
    public pageIndex = 1;
    public finishedJobs: Array<string> = [];
    public logsModalSettings = {
        isVisible: false,
        specificLogsJobTitle: ''
    };
    public logs: Array<string> = [];
    public mobile: boolean;
    public windowHeightSmall: boolean;

    constructor(private dataGetterFirstApi: DataGetterFirstApiService,
                private dataSenderFirstApi: DataSenderFirstApiService,
                private message: NzMessageService) {
    }


    ngOnInit(): void {
        this.initializeScreenSettings();
        this.dataGetterFirstApi.getAllJobs()
            .subscribe((allJobs) => {
                this.allJobs = allJobs;
                this.updatePage();
            }, (error) => this.message.error(error));

        this.initPage();
        this.refreshInterval = setInterval(this.initPage, 5000);
    }

    ngOnDestroy() {
        clearInterval(this.refreshInterval);
    }

    private initPage = () => {
        return forkJoin([this.dataGetterFirstApi.getFinishedJobs()
            .pipe(tap((finishedJobs) => this.finishedJobs = finishedJobs)),
            this.dataGetterFirstApi.getDownloadableModels()
                .pipe(tap((models) => this.downloadableModels = models))
        ]).subscribe(() => this.updatePage(),
            (error) => this.message.error(error));
    }

    private initializeScreenSettings() {
        this.mobile = window.screen.width <= 1024;
        this.windowHeightSmall = window.screen.height < 710;
        window.onresize = () => {
            this.mobile = window.screen.width <= 1024;
            this.windowHeightSmall = window.screen.height < 710;
        };
    }

    private updatePage() {
        this.jobsToDisplay = [...this.allJobs].splice
        ((this.pageIndex - 1) * this.PAGE_SIZE, this.PAGE_SIZE);
    }

    // function to manage pagination
    public moveToPage($event) {
        this.pageIndex = $event;
        this.updatePage();
    }


    // returns the logs list of a certain job
    public logsButton(jobs: string) {
        this.logsModalSettings.specificLogsJobTitle = jobs;
        this.specificJob = jobs;
        this.dataSenderFirstApi.logs({name: jobs})
            .subscribe((logs) => {
                this.logs = logs;
            }, (error) => this.message.error(error));
        this.logsModalSettings.isVisible = true;
    }

    // deletes the selected value from the APIs list
    public onJobRemove(jobs: string) {
        const indexToRemove = this.allJobs.indexOf(jobs);
        this.allJobs.splice(indexToRemove, 1);
        this.updatePage();
        this.dataSenderFirstApi.removeJob({name: jobs})
            .subscribe(() => {
            }, (e) => {
                this.allJobs.unshift(jobs);
                this.updatePage();
                this.message.error(e);
            });
    }

    // linked to the button inside the logs modal to update the logs list
    public handleRefreshMiddle(): void {
        this.dataSenderFirstApi.logs({name: this.specificJob})
            .subscribe((logs) =>  this.logs = logs, (error) => this.message.error(error));
    }
}
