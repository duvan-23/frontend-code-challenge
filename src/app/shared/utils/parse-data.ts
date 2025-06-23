export class ParseData {

  static parseCSV(csv: string): any[] {
    const [headerLine, ...lines] = csv.split('\n').map((line) => line.trim());
    const headers = headerLine.split(',');

    return lines
      .filter((line) => line)
      .map((line) => {
        const values = line.split(',');
        return headers.reduce((obj, key, i) => {
          obj[key] = values[i];
          return obj;
        }, {} as Record<string, string>);
    });
  }
  
}
