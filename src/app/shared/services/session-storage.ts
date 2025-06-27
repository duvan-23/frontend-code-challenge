import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorage {

  setItem<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to sessionStorage: ${key}`, error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading from sessionStorage: ${key}`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear() {
    sessionStorage.clear();
  }
}
