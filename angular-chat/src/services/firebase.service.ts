import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { LocalStorageService } from './localstorage.service';

@Injectable({
    providedIn: 'root'
})
export class FireBaseService {

    constructor(private localStorageService: LocalStorageService) { }

    private getReference(route: string): firebase.database.Reference {
        return firebase.database().ref(route);
    }

    public addOrEdit(
        route: string,
        property: string,
        incomingObject: any,
        editCallBack: (arg: string) => void,
        addCallBack: (arg: string) => void): void {
        const value = incomingObject[property];
        this.getReference(route).orderByChild(property).equalTo(value).once('value', snapshot => {
            if (snapshot.exists()) {
                this.editItem(property, value);
                editCallBack(value as string);
            } else {
                this.addItem(route, incomingObject, property, value);
                addCallBack(value as string);
            }
        });
    }

    private snapshotToArray(currentSnapshot: firebase.database.DataSnapshot): firebase.database.DataSnapshot[] {
        const returnArray = [];
        currentSnapshot.forEach((childSnapshot: firebase.database.DataSnapshot) => {
            const item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArray.push(item);
        });

        return returnArray;
    }

    public sendRequest(route: string): firebase.database.DataSnapshot[] {
        let returnArray = [];
        this.getReference(route).on('value', response => {
            returnArray = this.snapshotToArray(response);
        });
        return returnArray;
    }

    public addItemToFirebase(route: string, incomingObject: any): void {
        const newValue = this.getReference(route).push();
        newValue.set(incomingObject);
    }

    public editItemInFirebase(route: string, incomingObject: any): void {
        const userRef = firebase.database().ref(route);
        userRef.update(incomingObject);
    }

    private addItem(route: string, incomingObject: any, property: string, value: any): void {
        this.addItemToFirebase(route, incomingObject);
        this.localStorageService.setItem(property, value);
    }

    private editItem(property: string, value: any): void {
        this.localStorageService.setItem(property, value);
    }

    public subscribeToFirebase(route: string, path: string, specifiedValue: string): any[] {
        let roomuser = [];
        this.getReference(route).orderByChild(path).equalTo(specifiedValue).on('value', response => {
            roomuser = this.snapshotToArray(response);
        });
        return roomuser;
    }

    public listenOnceToFirebase(
        route: string,
        specifiedValue: string,
        incomingRoute: string,
        incomingObject: any,
        editCallBack: () => void,
        newCallBack: () => void
    ): void {
        this.getReference(route).equalTo(specifiedValue).once('value', (snapshot: firebase.database.DataSnapshot) => {
            if (snapshot.exists()) {
                editCallBack();
            } else {
                this.addItemToFirebase(incomingRoute, incomingObject);
                newCallBack();
            }
        });
    }
}
