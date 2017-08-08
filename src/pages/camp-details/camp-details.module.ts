import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CampDetailsPage } from './camp-details';

@NgModule({
  declarations: [
    CampDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CampDetailsPage),
  ],
  exports: [
    CampDetailsPage
  ]
})
export class CampDetailsPageModule {}
