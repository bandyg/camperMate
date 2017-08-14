import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ConnectivityProvider } from '../connectivity/connectivity';
import { Geolocation } from '@ionic-native/geolocation'

/*
 Generated class for the GoogleMapsProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class GoogleMapsProvider {

    mapElement: any;
    pleaseConnect: any;
    map: any;
    mapInitialized: boolean = false;
    mapLoaded: boolean = false;
    mapLoadedObserver: any;
    mapCurrentMarker: any;
    mapAPIKey: string = "AIzaSyCiqEwcI_u5BvdLJ4casY4tHnS_ne1l_YU";

    constructor(public connectivity: ConnectivityProvider,
                public geoLocation: Geolocation) {

        console.log('Hello GoogleMapsProvider Provider');
    }

    init(mapElement: any, pleaseConnect: any): Promise<any> {

        this.mapElement = mapElement;
        this.pleaseConnect = pleaseConnect;

        return this.loadGoogleMap();

    }

    loadGoogleMap(): Promise<any> {

        return new Promise((resolve) => {

            if(typeof google == "undefined" || typeof google.maps == "undefined"){

                console.log("Google maps JavaScript needs to be loaded.");
                this.disableMap();

                if(this.connectivity.isOnline()){

                    window['mapInit'] = () => {

                        this.initMap().then(() => {
                            resolve(true);
                        });

                        this.enableMap();
                    };

                    let script = document.createElement("script");
                    script.id = "googleMaps";

                    if(this.mapAPIKey){

                        script.src = 'http://maps.google.com/maps/api/js?key=' + this.mapAPIKey + '&callback=mapInit';
                    } else {

                        script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
                    }

                    document.body.appendChild(script);

                }
            } else {

                if(this.connectivity.isOnline()){
                    this.initMap();
                    this.enableMap();
                }
                else {
                    this.disableMap();
                }

            }

            this.addConnectivityListener();

        });

    }

    initMap(): Promise<any> {

        this.mapInitialized = true;

        return new Promise((resolve) => {

            this.geoLocation.getCurrentPosition().then((position) => {

                let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                let mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                this.map = new google.maps.Map(this.mapElement, mapOptions);
                resolve(true);

            });

        });

    }

    disableMap(): void {

        if(this.pleaseConnect){
            this.pleaseConnect.style.display = "block";
        }
    }

    enableMap(): void {

        if(this.pleaseConnect){
            this.pleaseConnect.style.display = "none";
        }
    }

    addConnectivityListener(): void {

        this.connectivity.watchOnline().subscribe(() => {

            console.log("online");

            setTimeout(() => {

                if(typeof google == "undefined" || typeof google.maps == "undefined"){
                    this.loadGoogleMap();
                }
                else {
                    if(!this.mapInitialized){
                        this.initMap();
                    }

                    this.enableMap();
                }

            }, 2000);

        });

        this.connectivity.watchOffline().subscribe(() => {

            console.log("offline");

            this.disableMap();

        });

    }

    changeMarker(lat: number, lng: number): void {


        let latLng = new google.maps.LatLng(lat, lng);

        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });

        if(this.mapCurrentMarker){
            this.mapCurrentMarker.setMap(null);
        }

        this.mapCurrentMarker = marker;

    }



}
