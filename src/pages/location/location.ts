import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController } from 'ionic-angular';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { DataProvider } from "../../providers/data/data";
import { Geolocation } from '@ionic-native/geolocation'

/**
 * Generated class for the LocationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') conElement: ElementRef;

  latitude: number;
  longitude: number;

  constructor(public navCtrl: NavController,
              public map: GoogleMapsProvider,
              public platform: Platform,
              public dataService: DataProvider,
              public alertCtrl: AlertController,
              public geolocation: Geolocation
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
  }

  setLocation(): void {

  }

  takeMeHome(): void {

  }

}
