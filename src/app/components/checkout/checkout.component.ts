import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { EcommerceFormService } from 'src/app/services/ecommerce-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;

  checkoutFormGroup: FormGroup;

  creditCardMonths: number[];
  creditCardYears: number[];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, private ecommerceFormService: EcommerceFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
        street: ['']
      }),
      billingAddress: this.formBuilder.group({
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
        street: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //Get credit card month
    let startMonth: number = new Date().getMonth() + 1;
    this.ecommerceFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retreived credit card months: " + JSON.stringify(data))
        this.creditCardMonths = data
      });

      //Get credit card years
    this.ecommerceFormService.getCreditCardYears().subscribe(
      data =>  {
        console.log("Retreived credit card years: " + JSON.stringify(data))
        this.creditCardYears = data
      });


      //Get countries
      this.ecommerceFormService.getCountries().subscribe(
        data => {
          console.log("Countries retrieved:" + JSON.stringify(data) );
          this.countries = data;
        });  
  }

  //Get States
  getStates(formGroupName: string) {
    let formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode: string = formGroup.value.country.code;
    const countryName: string = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.ecommerceFormService.getStates(countryCode).subscribe(
      data => {
        if( formGroupName == 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
   }



  onSubmit(){
    console.log('Handling form submit');
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log(`The email address is: ${this.checkoutFormGroup.get('customer').value.email}`);

    console.log(`The shipping address country is ${this.checkoutFormGroup.get('shippingAddress').value.country.name}`);
    console.log(`The shipping address state is ${this.checkoutFormGroup.get('shippingAddress').value.state.name}`);
  }

  copyShippingAddressToBillingAddress(event){

    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value);

        this.billingAddressStates = this.shippingAddressStates;

    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if( currentYear == selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.ecommerceFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retreived credit card months: " +  JSON.stringify(data));
        this.creditCardMonths = data; 
      }
    );


  }

}
