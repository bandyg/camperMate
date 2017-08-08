import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, ItemSliding} from 'ionic-angular';
import {ChecklistModel} from "../../models/checklist-model";
import { Dialogs } from '@ionic-native/dialogs';

/**
 * Generated class for the ChecklistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-checklist',
  templateUrl: 'checklist.html',
})
export class ChecklistPage {

  checklist: ChecklistModel;

  constructor( public navCtrl: NavController,
               public navParams: NavParams,
               public alertCtrl: AlertController,
               public dialog: Dialogs ) {

    this.checklist = this.navParams.get( 'checklist' );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChecklistPage');
  }

  addItem( ): void {

    /*let alert = this.alertCtrl.create({
      title: 'Add Item',
      message: 'Enter the new name of task for this checklist below:',
      inputs: [
        {
          name: 'itemName',
          placeholder: 'task'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: (data) => {

            this.checklist.addItem( data.itemName );
          }
        }
      ]
    });
    alert.present();*/
    this.dialog.prompt('Enter the new name of task for this checklist below:', 'Add Item', ["Save","Cancel"]).then( (params)=> {

      this.checklist.addItem( params.input1 );

    }).catch(e => console.log('Error displaying dialog', e));


  }

  toggleItem( item ): void {

    this.checklist.toggleItem( item );
  }

  removeItem( item ): void {

    this.checklist.removeItem( item );
  }

  renameItem( item, slidingItem: ItemSliding ): void {

    /*let alert = this.alertCtrl.create({
      title: 'Rename Item',
      message: 'Enter the new name of task for this checklist below:',
      inputs: [
        {
          name: 'itemName',
          placeholder: 'task',
          value: item.title
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

            console.log('Cancel clicked');
            slidingItem.close();
          }
        },
        {
          text: 'Save',
          handler: (data) => {

            this.checklist.renameItem( item, data.itemName );
            slidingItem.close();
          }
        }
      ]
    });
    alert.present();*/

    this.dialog.prompt('Enter the new name of task for this checklist below:', 'Rename Item', ["Save","Cancel"], item.title).then( (params)=> {

      this.checklist.renameItem( item, params.input1 );
      slidingItem.close();

    }).catch(e => console.log('Error displaying dialog', e));

  }

  uncheckItems(): void {

    this.checklist.items.forEach( item => {

      if( item.checked ) {

        this.checklist.toggleItem( item );
      }
    });

  }

  updateProgress(): void {

    let checkItemsNum = 0;

    this.checklist.items.forEach( item => {

      if( item.checked ) {

        ++checkItemsNum;
      }
    });

    this.checklist.progress = checkItemsNum + "/" + this.checklist.items.length;
    console.log( this.checklist.progress );
  }

  ionViewWillLeave() {

//    console.log( "leave checklist page" );
    this.updateProgress();
  }

  changeItemNote( item, slidingItem: ItemSliding ): void {

    /*let alert = this.alertCtrl.create({
      title: 'Item note',
      inputs: [
        {
          name: 'itemNote',
          value: item.note
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

            console.log('Cancel clicked');
            slidingItem.close();
          }
        },
        {
          text: 'Save',
          handler: (data) => {

            this.checklist.setNote( item, data.itemNote );
            slidingItem.close();
          }
        }
      ]
    });
    alert.present();*/

    this.dialog.prompt('Enter note below:', 'Item note', ["Save","Cancel"], item.note).then( (params)=> {

      this.checklist.setNote( item, params.input1 );
      slidingItem.close();

    }).catch(e => console.log('Error displaying dialog', e));

  }

}
