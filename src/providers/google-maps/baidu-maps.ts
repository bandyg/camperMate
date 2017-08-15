import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ConnectivityProvider } from '../connectivity/connectivity';
import { Geolocation } from '@ionic-native/geolocation'

declare var BMap;
/*
 Generated class for the BaiduMapsProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class BaiduMapsProvider {

    mapElement: any;
    pleaseConnect: any;
    map: any;
    mapInitialized: boolean = false;
    mapLoaded: boolean = false;
    mapLoadedObserver: any;
    mapCurrentMarker: any;
    mapAPIKey: string = "Sa3Mb0eKGnygErQsZtOVSkheRZrqXDT7";

    constructor(public connectivity: ConnectivityProvider,
                public geoLocation: Geolocation) {

        console.log('Hello BaiduMapsProvider Provider');
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

                    window['mapInit'] = () => {

                        this.initMap().then(() => {

                            resolve(true);
                        });

                        this.enableMap();
                    };

                    let script = document.createElement("script");
                    script.id = "BaiduMaps";

                    if(this.mapAPIKey){

                        script.src = 'https://api.map.baidu.com/api?v=2.0&ak=' + this.mapAPIKey + '&callback=mapInit';
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

        return new Promise((resolve) => {

            let options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            this.geoLocation.getCurrentPosition(options).then((position) => {

                //let latLng = new Point(position.coords.latitude, position.coords.longitude);

                /*let map = this.map = new BMap.Map(this.mapElement, { enableMapClick: true });//创建地图实例
                map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
                map.enableContinuousZoom();//连续缩放效果，默认禁用
                let point = new BMap.Point(116.06827, 22.549284);//position.coords.latitude, position.coords.longitude);
                map.centerAndZoom(point, 16);*/
                let point = new BMap.Point(position.coords.longitude, position.coords.latitude);
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(point);
                convertor.translate(pointArr, 3, 5, (data) => {
                    if(data.status === 0) {
                        var marker = new BMap.Marker(data.points[0]);
                        this.map.addOverlay(marker);
                        var label = new BMap.Label("My position",{offset:new BMap.Size(20,-10)});
                        marker.setLabel(label);
                        this.map.setCenter(data.points[0]);
                    }
                });
                this.map = new BMap.Map(this.mapElement);
                this.map.centerAndZoom(point,15);
                resolve(true);

            });

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
