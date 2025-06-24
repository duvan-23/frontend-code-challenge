import { CommonModule } from '@angular/common';
import { Component, Input, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParseData } from '@shared/utils/parse-data';

@Component({
  selector: 'app-dynamic-csv-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-csv-table.html',
  styleUrl: './dynamic-csv-table.css',
})
export class DynamicCsvTable {
  @Input() dataBase64: string = '';
  @Input() title: string = '';

  csvHeaders: string[] = [];
  csvData: Record<string, any>[] = [];
  pagedCsvData: Record<string, any>[] = [];

  rowsPerPage = 10;
  currentPage = 1;
  totalPages = 1;
  searchTerm: string = '';
  filteredCsvData: Record<string, any>[] = [];
  showTable = false;

  ngOnInit() {
    this.checkData();
  }

  checkData() {
    if (this.dataBase64 != '') {
      this.csvData = ParseData.parseCSV(this.dataBase64);
      console.log('csv Json', this.csvData);
      this.loadCsvData();
      this.showTable = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataBase64']) {
      this.checkData();
    }
  }

  loadCsvData() {
    this.csvHeaders = Object.keys(this.csvData[0] || {});
    this.filteredCsvData = this.csvData;
    this.totalPages = Math.ceil(this.csvData.length / this.rowsPerPage);
    this.pagedCsvData = this.csvData.slice(0, this.rowsPerPage);
    this.updatePagedData();
  }

  updatePagedData() {
    const data = this.searchTerm ? this.filteredCsvData : this.csvData;
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.pagedCsvData = data.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedData();
    }
  }

  onSearchChange() {
    const term = this.searchTerm.toLowerCase();

    this.filteredCsvData = this.csvData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );

    this.totalPages = Math.ceil(this.filteredCsvData.length / this.rowsPerPage);
    this.currentPage = 1;
    this.updatePagedData();
  }
}
