import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the MyDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-my-details',
    templateUrl: 'my-details.html',
})
export class MyDetailsPage {

    myDetailsForm: FormGroup;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public formBuilder: FormBuilder,
    ) {
        this.myDetailsForm = formBuilder.group({
            carRegitration: [''],
            trailerRegistration: [''],
            trailerDimension: [''],
            phoneNumber: [''],
            notes: ['']
        });
    }

    ionViewDidLoad() {

        console.log('ionViewDidLoad MyDetailsPage');
    }

    saveForm() {

        let data = this.myDetailsForm.value;
    }

}
