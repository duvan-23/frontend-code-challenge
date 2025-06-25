import { Component, inject, signal } from '@angular/core';
import { SummaryData } from '@shared/models/summary.interface';
import { SessionStorage } from '@shared/services/session-storage';
import { Crypto } from '@shared/utils/crypto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicCsvTable } from '@shared/components/dynamic-csv-table/dynamic-csv-table';
import { MatDialog } from '@angular/material/dialog';
import { EditSummary } from './components/edit-summary/edit-summary';
import { FileConvert } from '@shared/utils/file-convert';

@Component({
  selector: 'app-summary',
  imports: [CommonModule, FormsModule, DynamicCsvTable],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
})
export class Summary {
  private sessionStorageService = inject(SessionStorage);
  private dialog = inject(MatDialog);
  dataSummary!: SummaryData;
  tableTitle = 'CSV information';
  tableInfo = signal('');
  
  ngOnInit() {
    this.readSummary();
  }

  readSummary() {
    this.dataSummary = this.sessionStorageService.getItem<any>('formData');
    this.dataSummary.password = Crypto.decrypt(this.dataSummary.password);

    if (this.dataSummary) {
      if (this.dataSummary.csv && this.dataSummary.csv.content) {
        this.tableInfo.set(this.dataSummary.csv.content);
      }
    }
  }

  editForm() {
    const dialogRef = this.dialog.open(EditSummary, {
      width: '600px',
      data: this.dataSummary,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && result.email) {
        if (result.csv) {
          result.csv = {
            name: result.csv.name,
            content: await FileConvert.fileToBase64(result.csv),
          };
        } else {
          result.csv = this.dataSummary.csv;
        }

        result.password = Crypto.encrypt(result.password);
        this.sessionStorageService.setItem('formData', result);
        this.readSummary();
      }
    });
  }
}
