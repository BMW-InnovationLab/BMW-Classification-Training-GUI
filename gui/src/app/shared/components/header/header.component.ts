import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {HeaderTitle} from '../../../core/domain/enums/header-title';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges {
    @Input() title: HeaderTitle;
    @Input() downloadableModels = [];
    @Input() finishedJobs = [];
    @Input() allJobs?: Array<string> = [];
    public readonly modelsUrl = environment.url + environment.baseEndPoint + '/models/';
    public downloadableModelsKeys = [];
    public downloadableModelsValues = [];
    public popoverPlacement = 'bottomRight' || 'bottom';
    public updateInJobs = false;
    public headerSettings: Record<HeaderTitle, any>;
    public mobile: boolean;


    constructor() {
    }

    ngOnInit(): void {
        this.initializeScreenSettings();
        this.headerSettings = {
            [HeaderTitle.DISPLAY]: {
                link: '/stepper',
                tooltip: 'Create Job',
                iconType: 'plus-circle',
                theme: 'fill'
            },
            [HeaderTitle.CREATE]: {
                link: '/jobs',
                tooltip: 'All Jobs',
                iconType: 'unordered-list',
                theme: 'outline'
            }
        };
    }

    ngOnChanges() {
        this.downloadableModels !== undefined ? this.setDownloadableModels() : this.updateInJobs = false;
    }

    public onDownloadableModelClick() {
        this.updateInJobs = false;
        if (!this.mobile) {
            const largeNamesInModels = this.downloadableModelsKeys
                .filter(key => key.slice(0, -4).length > 6);
            this.popoverPlacement = (largeNamesInModels.length > 0) ? 'bottomRight' : 'bottom';
        }
    }

    public testWithSwagger() {
        window.open(environment.inferenceAPIUrl, '_blank');
    }

    public jobIsDone = (jobs: string) => {
        if (this.finishedJobs !== undefined) {
            return this.finishedJobs.indexOf(jobs);
        }
        return -1;
    }

    private initializeScreenSettings() {
        this.mobile = window.screen.width <= 768;
        window.onresize = () => {
            this.mobile = window.screen.width <= 768;
        };
    }

    private setDownloadableModels() {
        if (this.downloadableModelsKeys.length < this.downloadableModels.length) {
            this.updateInJobs = true; // a new job is available to download
        }
        this.downloadableModelsKeys = [];
        this.downloadableModelsValues = [];
        for (const [key, value] of Object.entries(this.downloadableModels)) {
            this.downloadableModelsKeys.push(key);
            this.downloadableModelsValues.push(value);
        }
    }

    public inStepperPage(): boolean{
        return this.title === HeaderTitle.CREATE;
    }

    public makeUrl(index){
        return this.modelsUrl + encodeURIComponent(this.downloadableModelsValues[index]) + '/' + this.downloadableModelsKeys[index];
    }
}
