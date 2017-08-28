import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataProvider } from '../../providers/data/data';

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
                public data: DataProvider
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

        let savedDetails: any = false;

        this.data.getMyDetails().then( (details) => {

            if( details && typeof(details) != 'undefined' ) {

                savedDetails = JSON.parse(details);
            }

            let formControls: any = this.myDetailsForm.controls;

            if(savedDetails) {

                formControls.carRegitration.setValue(savedDetails.carRegitration);
                formControls.trailerRegistration.setValue(savedDetails.trailerRegistration);
                formControls.trailerDimension.setValue(savedDetails.trailerDimension);
                formControls.phoneNumber.setValue(savedDetails.phoneNumber);
                formControls.notes.setValue(savedDetails.notes);
            }

        } );

    }

    saveForm() {

        let newData = this.myDetailsForm.value;
        this.data.setMyDetails(newData);
    }

}
