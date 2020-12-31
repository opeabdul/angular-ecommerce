import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EcommerceFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]>{

    let data: number[] = [];

    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]>{

    let data: number[] = [];

    let startYear: number = new Date().getFullYear();
    let endYear: number = startYear + 10;

    for(let tempYear = startYear; tempYear<= endYear; tempYear++){
      data.push(tempYear);
    }

    return of(data);
  }
}
