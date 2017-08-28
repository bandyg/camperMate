import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {ChecklistModel} from "../../models/checklist-model";
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';

/*
 Generated class for the DataProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class DataProvider {

    constructor( public storage: Storage ) {
        console.log('Hello DataProvider Provider');
    }

    getIntroFlag( ): Promise<boolean> {

        return this.storage.get('IntroFlag');
    }

    setIntroFlag( flag: boolean ): void {

        this.storage.set( 'IntroFlag', flag );
    }

    setSampleData(): void {


    }

    getLocation(): Promise<any> {
        return this.storage.get('location');
    }

    getCampDetails(): Promise<any> {
        return this.storage.get('campdetails');
    }

    getMyDetails(): Promise<any> {
        return this.storage.get('mydetails');
    }

    setLocation(object: Object) {

        let data = JSON.stringify(object);
        this.storage.set('location', data);
    }

    setCampDetails(object: Object) {

        let data = JSON.stringify(object);
        this.storage.set('campdetails', data);
    }

    setMyDetails(object: Object) {

        let data = JSON.stringify(object);
        this.storage.set('mydetails', data);
    }

}
