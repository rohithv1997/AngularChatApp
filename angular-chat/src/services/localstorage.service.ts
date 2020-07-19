import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    constructor() { }

    public checkItemExists(property: string): boolean {
        return localStorage.getItem(property) !== null;
    }

    public getItem(property: string): string {
        return localStorage.getItem(property);
    }

    public setItem(property: string, value: any): void {
        localStorage.setItem(property, value);
    }

    public removeItem(property: string): void {
        localStorage.removeItem(property);
    }
}
