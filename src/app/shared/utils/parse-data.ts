import * as Papa from 'papaparse';
export class ParseData {
  static parseCSV(base64: string): any[] {
    try {
      const csvContent = atob(base64.split(',')[1]);
      const parsed = Papa.parse(csvContent.trim(), {
        header: true,        // Or false if you don’t want to use first row as headers
        skipEmptyLines: true,
        dynamicTyping: true, 
      });
      return parsed.data;
    }catch(e){
      console.error('Failed to parse CSV from base64:', e);
      return [];
    }
  }
}
