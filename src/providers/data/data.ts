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

  getData( ): Promise<any> {

    return this.storage.get('checklists');
  }

  save( data: ChecklistModel[] ): void {

    let saveData = [];

    data.forEach( checklist => {

      saveData.push(
        {
          title: checklist.title,
          dateTime: checklist.dateTime,
          progress: checklist.progress,
          items: checklist.items,
        }
      );
    });

    let newData = JSON.stringify( saveData );
    console.log(newData);
    this.storage.set( 'checklists', newData );
  }

  setSampleData(): void {

    this.storage.set( 'checklists', '[{"title":"Sample","dateTime":1498634658451,"progress":"1/3","items":[{"title":"task1","checked":true,"note":"note1"},{"title":"task2","checked":false,"note":"note2"},{"title":"task3","checked":false,"note":"note3"}]}]' );
  }
}
