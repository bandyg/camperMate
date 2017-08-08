import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyDetailsPage } from './my-details';

@NgModule({
  declarations: [
    MyDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyDetailsPage),
  ],
  exports: [
    MyDetailsPage
  ]
})
export class MyDetailsPageModule {}
