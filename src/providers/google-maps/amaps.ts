import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ConnectivityProvider } from '../connectivity/connectivity';
import { Geolocation } from '@ionic-native/geolocation'
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Http } from '@angular/http'

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
    mapAPIKey: string = "8c8430330bcd1554c2d7603514d1edcb";
    mapAPIServKey: string = "249ddb61453532a53f962180f137bd03";

    constructor(public connectivity: ConnectivityProvider,
                public geoLocation: Geolocation,
                private backgroundGeolocation: BackgroundGeolocation,
                public platform:Platform,
                public http: Http) {

        console.log('Hello AMapsProvider Provider');
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
                    script.id = "AMaps";

                    if(this.mapAPIKey){

                        script.src = 'http://webapi.amap.com/maps?v=1.3&key=' + this.mapAPIKey + '&callback=mapInit';
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

            const config: BackgroundGeolocationConfig = {
                desiredAccuracy: 100,
                stationaryRadius: 10,
                distanceFilter: 10,
                debug: true, //  enable this hear sounds for background-geolocation life-cycle.
                //stopOnTerminate: false, // enable this to clear background location settings when the app terminates
                interval: 5000
            };

            // BackgroundGeolocation is highly configurable. See platform specific configuration options

            this.backgroundGeolocation.configure(config)
                .subscribe((location: BackgroundGeolocationResponse) => {

                    console.log(location);
                    this.getGps2AMapPos( location.longitude, location.latitude ).subscribe( val => {
                        console.log( val._body );
                        let resp = JSON.parse(val._body);
                        if( resp.status == "1" ) {

                            let posArray = resp.locations.split(",");
                            let positions = new AMap.LngLat( posArray[0], posArray[1] );
                            this.map.setZoomAndCenter(16, positions );
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

            // If you wish to turn OFF background-tracking, call the #stop method.
            // backgroundGeolocation.stop();

            let options = {
                enableHighAccuracy: true,
                timeout: 0,
                maximumAge: Infinity,
            };

            this.geoLocation.getCurrentPosition(options).then((position) => {

                console.log( {lat: position.coords.latitude, lng:position.coords.longitude} );
                this.map.setZoomAndCenter(16, [position.coords.longitude, position.coords.latitude]);
                var marker = new AMap.Marker({
                    map: this.map,
                    position: [position.coords.longitude, position.coords.latitude]
                });
                //let latLng = new Point(position.coords.latitude, position.coords.longitude);

                /*let map = this.map = new BMap.Map(this.mapElement, { enableMapClick: true });//创建地图实例
                 map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
                 map.enableContinuousZoom();//连续缩放效果，默认禁用
                 let point = new BMap.Point(116.06827, 22.549284);//position.coords.latitude, position.coords.longitude);
                 map.centerAndZoom(point, 16);

                 let pos = AMap.LngLat(position.coords.longitude, position.coords.latitude);
                 this.map = new AMap.Map(this.mapElement, {
                 resizeEnable: true,
                 zoom: 13,
                 center: pos
                 });

                 this.map = new AMap.Map(this.mapElement);
                 let curPos = AMap.LngLat(position.coords.longitude, position.coords.latitude);
                 this.map.setZoom(10);
                 this.map.setCenter(curPos);
                 resolve(true);

                 });*/

            });

            this.map = new AMap.Map(this.mapElement, {resizeEnable: true, zoom:11});
            this.map.plugin('AMap.Geolocation', () => {
                this.geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showCircle: false,
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
                });

                AMap.event.addListener(this.geolocation, 'complete', () => {
                    this.map.setZoom(16);
                    console.log("complete");
                });//返回定位信息

                AMap.event.addListener(this.geolocation, 'error', (error) => {

                    console.log(error.info);
                    console.log(error.message);
                    console.log( curLocation.longitude );
                    console.log( curLocation.latitude );
                    //this.map.setZoomAndCenter(16, [curLocation.longitude, curLocation.latitude]);
                });      //返回定位出错信息

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


    public getGps2AMapPos(longtitude:number, latitude:number): any {
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




}