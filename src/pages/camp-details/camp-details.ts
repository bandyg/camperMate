import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataProvider } from '../../providers/data/data';

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
            getAccessCode: [''],
            ammenitiesCode: [''],
            wifiPassword: [''],
            phoneNumber: ['', Validators.pattern('^\\s*(?:\\+?(\\d{1,3}))?([-. (]*(\\d{3})[-. )]*)?((\\d{3})[-. ]*(\\d{2,4})(?:[-.x ]*(\\d+))?)\\s*$')],
            departureDate: [''],
            notes: ['']
        });

    }

    ionViewDidLoad() {

        let savedDetails: any = false;

        this.data.getCampDetails().then( (details) => {

            if( details && typeof(details) != 'undefined' ) {

                savedDetails = JSON.parse(details);
            }

            let formControls: any = this.campDetailsForm.controls;

            if(savedDetails) {

                formControls.getAccessCode.setValue(savedDetails.getAccessCode);
                formControls.ammenitiesCode.setValue(savedDetails.ammenitiesCode);
                formControls.wifiPassword.setValue(savedDetails.wifiPassword);
                formControls.phoneNumber.setValue(savedDetails.phoneNumber);
                formControls.departureDate.setValue(savedDetails.departureDate);
                formControls.notes.setValue(savedDetails.notes);
            }

        } );
    }

    saveForm() {

        if (this.campDetailsForm.valid) {

            let newData = this.campDetailsForm.value;
            this.data.setCampDetails(newData);
        }

    }

}
