import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ConnectivityProvider } from '../connectivity/connectivity';

declare var qq;
/*
 Generated class for the QQMapsProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class QQMapsProvider {

    mapElement: any;
    pleaseConnect: any;
    map: any;
    geolocation: any;
    mapInitialized: boolean = false;
    mapLoaded: boolean = false;
    mapLoadedObserver: any;
    mapCurrentMarker: any;
    mapAPIKey: string = "M6QBZ-NEJW3-OQK32-374UL-V4UEH-BMB5Q";

    constructor(public connectivity: ConnectivityProvider,
                public platform:Platform) {

        console.log('Hello QQMapsProvider Provider');
    }

    init(mapElement: any, pleaseConnect: any): Promise<any> {

        this.mapElement = mapElement;
        this.pleaseConnect = pleaseConnect;

        return this.loadBaiduMap();

    }

    loadBaiduMap(): Promise<any> {

        return new Promise((resolve) => {

            if(typeof google == "undefined" || typeof google.maps == "undefined"){

                console.log("Baidu maps JavaScript needs to be loaded.");
                this.disableMap();

                if(this.connectivity.isOnline()){

                    window['message'] = () => {

                        this.initMap().then(() => {

                            resolve(true);
                        });

                        this.enableMap();
                    };

                    let script = document.createElement("script");
                    script.id = "QQMaps";

                    if(this.mapAPIKey){

                        let geolocation = new qq.maps.Geolocation(this.mapAPIKey, "camperMate");
                        let options = {timeout: 8000};
                        geolocation.getLocation( (position) => {
                            console.log( JSON.stringify(position) );
                        }, () => {
                            console.log("qq error");
                        }, options);
                        //script.src = 'https://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js';
                    } else {

                        //script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
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
        let curLocation: any;

        return new Promise((resolve) => {

        });
    }

    /*    setCurrentPos(data) {
     if(data.status === 0) {
     var marker = new BMap.Marker(data.points[0]);
     this.map.addOverlay(marker);
     var label = new BMap.Label("转换后的百度标注（正确）",{offset:new BMap.Size(20,-10)});
     marker.setLabel(label); //添加百度label
     this.map.setCenter(data.points[0]);
     }
     }*/

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
                    this.loadBaiduMap();
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