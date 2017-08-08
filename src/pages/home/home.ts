import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Platform } from 'ionic-angular';
import { ChecklistModel } from '../../models/checklist-model';
import { DataProvider } from '../../providers/data/data';
import { Keyboard } from '@ionic-native/keyboard';
import { ItemSliding } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tab1Root: any = "LocationPage";
  tab2Root: any = "MyDetailsPage";
  tab3Root: any = "CampDetailsPage";

  constructor(public navCtrl: NavController,
              public dataService:DataProvider,
              public platform: Platform,
              public keyboard: Keyboard
  ){


  }

  ionViewDidLoad(){

    this.platform.ready().then( ()=> {


    });

  }

}
