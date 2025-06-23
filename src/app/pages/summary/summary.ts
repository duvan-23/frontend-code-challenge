import { Component, inject } from '@angular/core';
import { SessionStorage } from '@shared/services/session-storage';
import { ParseData } from '@shared/utils/parse-data';

@Component({
  selector: 'app-summary',
  imports: [],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export class Summary {
  private sessionStorageService = inject(SessionStorage);

  ngOnInit(){
    const data = this.sessionStorageService.getItem<any>('formData');
    console.log(data)
    if (data) {
      if(data.csv){
        const csvContent = atob(data.csv.split(',')[1]);
        console.log('csv Json', ParseData.parseCSV(csvContent));
      }
    }
  }
}
