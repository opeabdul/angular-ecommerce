import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class EcommerceFormService {

  private statesUrl = 'http://localhost:8080/api/states';
  private countriesUrl = 'http://localhost:8080/api/countries';

  constructor(private httpClient: HttpClient) { }

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

  getCountries():Observable<Country[]>{

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(countryCode: string):Observable<State[]>{
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`
    return this.httpClient.get<GetResponseStates>(this.statesUrl).pipe(
      map(response => response._embedded.states)
    )
  }
  
}

interface GetResponseCountries{
  _embedded: {
    countries: Country[]
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[]
  }
}
