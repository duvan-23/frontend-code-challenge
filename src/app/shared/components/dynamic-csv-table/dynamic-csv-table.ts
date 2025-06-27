import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParseData } from '@shared/utils/parse-data';

@Component({
  selector: 'app-dynamic-csv-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-csv-table.html'
})
export class DynamicCsvTable {
  @Input() dataBase64: string = '';
  @Input() title: string = '';

  csvHeaders: WritableSignal<string[]> = signal([]);
  csvData: WritableSignal<Record<string, any>[]> = signal([]);
  pagedCsvData: WritableSignal<Record<string, any>[]> = signal([]);
  filteredCsvData: WritableSignal<Record<string, any>[]> = signal([]);

  private readonly rowsPerPage = 10;
  currentPage = signal(1);
  totalPages = signal(1);
  searchTerm = signal('');
  showTable = signal(false);

  ngOnInit() {
    this.checkData();
  }

  // Parses CSV from base64 and initializes view
  private checkData() {
    if (this.dataBase64 != '') {
      this.csvData.set(ParseData.parseCSV(this.dataBase64));
      this.loadCsvData();
      this.showTable.set(true);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataBase64']) {
      this.searchTerm.set('');
      this.checkData();
    }
  }

  // Initializes headers, pagination, and filtered data
  loadCsvData() {
    this.csvHeaders.set(Object.keys(this.csvData()[0] || {}));
    this.filteredCsvData.set(this.csvData());
    this.totalPages.set(Math.ceil(this.csvData().length / this.rowsPerPage));
    this.pagedCsvData.set(this.csvData().slice(0, this.rowsPerPage));
    this.updatePagedData();
  }

  // Updates the visible page of data based on filters and current page
  updatePagedData() {
    const data = this.searchTerm() ? this.filteredCsvData() : this.csvData();
    const start = (this.currentPage() - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.pagedCsvData.set(data.slice(start, end));
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((v) => v - 1);
      this.updatePagedData();
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((v) => v + 1);
      this.updatePagedData();
    }
  }

  // Filters CSV content based on search term
  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    const term = this.searchTerm().toLowerCase();

    this.filteredCsvData.set(
      this.csvData().filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(term)
        )
      )
    );

    this.totalPages.set(
      Math.ceil(this.filteredCsvData().length / this.rowsPerPage)
    );
    this.currentPage.set(1);
    this.updatePagedData();
  }
}
