import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataProvider } from '../../providers/data/data'

/**
 * Generated class for the CampDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-camp-details',
  templateUrl: 'camp-details.html',
})
export class CampDetailsPage {

  campDetailsForm: FormGroup;

  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public data: DataProvider
  ) {

    this.campDetailsForm = formBuilder.group({
      getAccessCode: ['12345'],
      ammenitiesCode: [''],
      wifiPassword: [''],
      phoneNumber: [''],
      departureDate: [''],
      notes: ['']
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CampDetailsPage');
  }

  saveForm() {

  }

}
