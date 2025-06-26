import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, delay } from 'rxjs';

import { CountryMapper } from '../mappers/country.mapper';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { Country } from '../interfaces/country.interface';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private http = inject(HttpClient);

  searchByCapital = ( query : string ):Observable<Country[]>=>{
    query = query.toLowerCase();

    //En el get se indica que tipo de dato se va a retornar, para evitar el uso de any
    //y el subscribe sepa que tipo de dato es el que va a recibir

    // return this.http.get<RESTCountry[]>(`${API_URL}/capital/${ query }`);

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${ query }`)
    .pipe(
      map((item) => {
        return CountryMapper.mapRestCountryItemsToCountryArray(item);
      }),
      catchError(error => {
        console.log('Error fetching ', error);

        return throwError(() => new Error(`No se pudieron obtener países con ese query ${query}`));
      })
    );
  }

  searchByCountry = ( query:string ):Observable<Country[]> => {

    query= query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
    .pipe(
      map((item)=>{
        return CountryMapper.mapRestCountryItemsToCountryArray(item);
      }),
      delay(2000),
      catchError(error => {
        console.log('Error fetching ', error);

        return throwError(() => new Error(`No se pudieron obtener países con ese query ${query}`));
      })
    )

  }

  searchCountryByAlphaCode = ( code:string ) => {

    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`)
    .pipe(
      map((item)=>{
        return CountryMapper.mapRestCountryItemsToCountryArray(item);
      }),
      map((countries)=> countries.at(0)),
      catchError(error => {
        console.log('Error fetching ', error);

        return throwError(() => new Error(`No se pudieron obtener países con ese query ${code}`));
      })
    )

  }

}
