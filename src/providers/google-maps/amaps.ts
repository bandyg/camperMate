import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ConnectivityProvider } from '../connectivity/connectivity';
import { Geolocation } from '@ionic-native/geolocation'
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Http } from '@angular/http'
//Ben TODO: get familar with the amap functionality
declare var AMap;
/*
 Generated class for the AMapsProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class AMapsProvider {

    mapElement: any;
    pleaseConnect: any;
    map: any;
    geolocation: any;
    mapInitialized: boolean = false;
    mapLoaded: boolean = false;
    mapLoadedObserver: any;
    mapCurrentMarker: any;
    mapAPIKey: string = "835c2dddfc5ed67274f2eb60a07caa8b";
    mapAPIServKey: string = "0d8ecf83021c5cc3be34752cd34cf06f";
    zoomLevel = 14;
    cityZoomLevel = 12;

    constructor(public connectivity: ConnectivityProvider,
                //public geoLocation: Geolocation,
                private backgroundGeolocation: BackgroundGeolocation,
                public platform:Platform,
                public http: Http) {

        console.log('Hello AMapsProvider Provider');
    }

    init(mapElement: any, pleaseConnect: any): Promise<any> {

        this.mapElement = mapElement;
        this.pleaseConnect = pleaseConnect;

        return this.loadAMap();

    }

    loadAMap(): Promise<any> {

        return new Promise((resolve) => {

            if(typeof AMap == "undefined" || typeof AMap.Map == "undefined"){

                console.log("AMap maps JavaScript needs to be loaded.");
                this.disableMap();

                if(this.connectivity.isOnline()){

                    window['mapInit'] = () => {

                        this.initMap().then(() => {

                            resolve(true);
                            this.mapLoaded = true;
                        });

                        this.enableMap();
                    };

                    let script = document.createElement("script");
                    script.id = "AMaps";

                    if(this.mapAPIKey){

                        script.src = 'http://webapi.amap.com/maps?v=1.3&key=' + this.mapAPIKey + '&callback=mapInit';
                    } else {

                        console.log("load AMap script failed! Need the API key.");
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
        //let curLocation: any;

        return new Promise((resolve) => {

            // If you wish to turn OFF background-tracking, call the #stop method.
            // backgroundGeolocation.stop();

            this.createMap();

            this.initLocation();

            // BackgroundGeolocation is highly configurable. See platform specific configuration options
            /*if( this.platform.is('cordova') ) {

                const config: BackgroundGeolocationConfig = {
                    desiredAccuracy: 10,
                    stationaryRadius: 5,
                    distanceFilter: 5,
                    debug: true, //  enable this hear sounds for background-geolocation life-cycle.
                    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
                    startForeground:true,
                    interval: 10,
                    fastestInterval: 5,
                    activitiesInterval: 10
                };

                this.backgroundGeolocation.configure(config)
                    .subscribe((location: BackgroundGeolocationResponse) => {

                        console.log(location);
                        this.getGps2AMapPos( location.longitude, location.latitude ).subscribe( val => {
                            console.log( val._body );
                            let resp = JSON.parse(val._body);
                            if( resp.status == "1" ) {

                                let posArray = resp.locations.split(",");
                                let positions = new AMap.LngLat( posArray[0], posArray[1] );
                                this.map.setZoomAndCenter(15, positions );
                                var marker = new AMap.Marker({
                                    map: this.map,
                                    position: positions
                                });
                                console.log("setCenter");
                            }

                        });
                        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                        // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
                        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                        //this.backgroundGeolocation.finish(); // FOR IOS ONLY


                    });

                // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
                this.backgroundGeolocation.start();
            }*/
            this.initBackgroundLocating();

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
                    this.loadAMap();
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

    changeMarker(lng: number, lat: number): void {

        let lngLat = new AMap.LngLat(lng, lat);

        this.map.setZoomAndCenter(this.zoomLevel, lngLat);

        var marker = new AMap.Marker({
            map: this.map,
            position: lngLat,
            draggable: true,
            raiseOnDrag: true,
            animation: "AMAP_ANIMATION_DROP"
        });

        if(this.mapCurrentMarker){
            this.mapCurrentMarker.setMap(null);
        }

        this.mapCurrentMarker = marker;

    }


    public getGps2AMapPos(longtitude:number, latitude:number): any {

        console.log( "step into getGps2AMapPos" );
        let url = 'http://restapi.amap.com/v3/assistant/coordinate/convert?key=' + this.mapAPIServKey+
            '&locations=' + longtitude +','+ latitude + '&coordsys=gps';
        return this.http.get(url);
    }

    public startLocationTracking() {

        this.backgroundGeolocation.start();
    }

    public stopLocationTracking() {

        this.backgroundGeolocation.stop();
    }

    public initBackgroundLocating() {

        if( this.platform.is('cordova') ) {

            const config: BackgroundGeolocationConfig = {
                desiredAccuracy: 10,
                stationaryRadius: 5,
                distanceFilter: 5,
                debug: true, //  enable this hear sounds for background-geolocation life-cycle.
                stopOnTerminate: false, // enable this to clear background location settings when the app terminates
                startForeground:true,
                interval: 10,
                fastestInterval: 5,
                activitiesInterval: 10
            };

            this.backgroundGeolocation.configure(config)
                .subscribe((location: BackgroundGeolocationResponse) => {

                    console.log(location);
                    this.getGps2AMapPos( location.longitude, location.latitude ).subscribe( val => {
                        console.log( val._body );
                        let resp = JSON.parse(val._body);
                        if( resp.status == "1" ) {

                            let posArray = resp.locations.split(",");
                            this.changeMarker(posArray[0], posArray[1]);
                            /*let positions = new AMap.LngLat( posArray[0], posArray[1] );
                            this.map.setZoomAndCenter(this.zoomLevel, positions );
                            var marker = new AMap.Marker({
                                map: this.map,
                                position: positions
                            });*/
                            console.log("setCenter");
                        }

                    });
                    // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                    // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
                    // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                    //this.backgroundGeolocation.finish(); // FOR IOS ONLY


                });

            // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
            this.backgroundGeolocation.start();
        }

    }

    public getLastPostion() {

        this.backgroundGeolocation.getLocations().then( (locations) => {

            console.log(locations);
            let location = locations.pop();
            this.getGps2AMapPos( location.longitude, location.latitude ).subscribe( val => {
                console.log( val._body );
                let resp = JSON.parse(val._body);
                if( resp.status == "1" ) {

                    let posArray = resp.locations.split(",");
                    let positions = new AMap.LngLat( posArray[0], posArray[1] );
                    this.map.setZoomAndCenter(15, positions );
                    var marker = new AMap.Marker({
                        map: this.map,
                        position: positions
                    });
                    console.log("setCenter");
                }

            });
        }, ()=>{});
    }

    createMap() {

        this.map = new AMap.Map(this.mapElement,
            {
                //mapStyle: 'amap://styles/fresh',
                resizeEnable: true,
                zoom: this.zoomLevel,
                showIndoorMap: true,
                showBuildingBlock: true
            });
    }

    initLocation() {

        this.map.plugin('AMap.Geolocation', () => {
            this.geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showCircle: false,
                showMarker: false,
                buttonPosition:'RB',
                noIpLocate: 0,
                GeoLocationFirst: true,
                panToLocation: true,
                useNative: true
            });
            //this.map.
            this.map.addControl(this.geolocation);

            this.geolocation.getCurrentPosition( (status, result) => {

                console.log( "position"+result.position);
                console.log( "accuracy"+result.accuracy);
                console.log( "location_type"+result.location_type);
                console.log( "isConverted"+result.isConverted);
                console.log( "formattedAddress"+result.formattedAddress);
                console.log( "status:" + status );

            });

            AMap.event.addListener(this.geolocation, 'complete', () => {
                this.map.setZoom(this.zoomLevel);
                console.log("geolocation complete");
                //this.getLastPostion();
            });//返回定位信息

            AMap.event.addListener(this.geolocation, 'error', (error) => {

                console.log(error.info);
                console.log(error.message);
                this.geolocation.getCityInfo( (status, reslut) => {

                    console.log("getCityInfo" + status);
                    console.log("getCityInfo" + JSON.stringify(reslut.center));
                    let positions = new AMap.LngLat( reslut.center[0], reslut.center[1] );
                    this.map.setZoomAndCenter(this.cityZoomLevel, positions );
                });
                //console.log( curLocation.longitude );
                //console.log( curLocation.latitude );
                //this.map.setZoomAndCenter(16, [curLocation.longitude, curLocation.latitude]);
            });      //返回定位出错信息

        });
    }


}