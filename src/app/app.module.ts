import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { DataProvider } from '../providers/data/data';
import { Keyboard } from '@ionic-native/keyboard';
import { IonicStorageModule } from '@ionic/storage';
import { Dialogs } from '@ionic-native/dialogs';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { Geolocation } from '@ionic-native/geolocation'
import { Network } from '@ionic-native/network';
import { BaiduMapsProvider } from '../providers/google-maps/baidu-maps'

@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(
            /*{
             name: '__mydb',
             driverOrder: ['sqlite', 'indexeddb', 'websql']
             }*/
        )
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        DataProvider,
        Keyboard,
        Dialogs,
        ConnectivityProvider,
        Geolocation,
        Network,
        BaiduMapsProvider
    ]
})
export class AppModule {}
