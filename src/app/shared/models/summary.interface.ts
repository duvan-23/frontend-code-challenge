export interface SummaryData {
  csv?: Csv;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  subscription: string;
}

export interface Csv {
  name?: string;
  content?: string;
}
