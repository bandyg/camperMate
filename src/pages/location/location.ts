import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController } from 'ionic-angular';
//import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { AMapsProvider } from '../../providers/google-maps/amaps';
//import { QQMapsProvider } from '../../providers/google-maps/qqmaps';
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
    @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

    latitude: number;
    longitude: number;

    constructor(public navCtrl: NavController,
                public platform: Platform,
                public dataService: DataProvider,
                public alertCtrl: AlertController,
                public geolocation: Geolocation,
                public maps: AMapsProvider
    ) {
    }

    ionViewDidLoad() {

        this.platform.ready().then(() => {

            this.dataService.getLocation().then((location) => {

                let savedLocation: any = false;

                if(location && typeof(location) != "undefined"){
                    savedLocation = JSON.parse(location);
                }

                let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

                    if(savedLocation){

                        this.latitude = savedLocation.latitude;
                        this.longitude = savedLocation.longitude;

                        this.maps.changeMarker(this.latitude, this.longitude);

                    }

                });

            });

        });

    }

    setLocation(): void {

    }

    takeMeHome(): void {

    }

}
