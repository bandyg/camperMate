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
            carRegitration: ['', Validators.pattern('([A-Z]{1})([0-9A-Z]{1,6})')],//Validators.pattern('[^a-z \-\+\.]\ *([0-9])*[0-9]')
            trailerRegistration: [''],
            trailerDimension: [''],
            phoneNumber: ['', Validators.pattern('^\\s*(?:\\+?(\\d{1,3}))?([-. (]*(\\d{3})[-. )]*)?((\\d{3})[-. ]*(\\d{2,4})(?:[-.x ]*(\\d+))?)\\s*$')],
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

        if (this.myDetailsForm.valid) {

            let newData = this.myDetailsForm.value;
            this.data.setMyDetails(newData);
        }
    }

}
