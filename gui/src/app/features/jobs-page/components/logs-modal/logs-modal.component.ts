import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-logs-modal',
  templateUrl: './logs-modal.component.html',
  styleUrls: ['./logs-modal.component.css']
})
export class LogsModalComponent implements OnInit {
  @Input() modalSettings = {
    isVisible: false,
    specificLogsJobTitle: ''
  };
  @Input() data: string[];
  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  public hideModal() {
    this.modalSettings.isVisible = false;
  }

  public downloadLogs(): void {
    const downloadableData = this.data.join('\n');
    const blob = new Blob([downloadableData], {type: 'text/txt; charset=utf-8'});
    fileSaver.saveAs(blob, this.modalSettings.specificLogsJobTitle + '_logs ' + new Date().toDateString() + '.txt');
  }

  public handleRefreshMiddle() {
    this.refresh.emit();
  }
}
