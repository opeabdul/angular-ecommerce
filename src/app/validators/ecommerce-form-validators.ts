import { FormControl, ValidationErrors } from "@angular/forms";

export class EcommerceFormValidators {
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors{

        //check if string only contains whitespace 
        if(control.value != null && control.value.trim().length < 2){
            //invalid return error objet
            return { 'notOnlyWhiteSpace': true };
        }else{
            //valid return null
            return null;
        }
    }
}
