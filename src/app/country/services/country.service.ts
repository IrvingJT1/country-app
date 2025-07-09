import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, delay, of, tap } from 'rxjs';

import { CountryMapper } from '../mappers/country.mapper';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { Country } from '../interfaces/country.interface';
import { RouteConfigLoadEnd } from '@angular/router';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private http = inject(HttpClient);

  private queryCacheCapital = new Map<string, Country[]>();

  private queryCacheCountry = new Map<string, Country[]>();

  private queryCacheRegion = new Map<string, Country[]>();

  searchByCapital = ( query : string ):Observable<Country[]>=>{
    query = query.toLowerCase();
    
    //Se verifica si el objeto de tipo Map (que es como un Set, pero guarda pares 'key':value)
    //contiene un query como el que se solicita, o sea si el query de la consulta al servicio está incluido
    //en alguno de los pares 'key':value del objeto, si es así se regresa lo que ya se tenía en ese objeto Map que se está usando como caché
    //en caso contrario se usa un null coalescent (??) para indicar que se retornará un arreglo vacío en caso de que la consulta no haya traido nada desde el principio
    //de esta forma evitamos múltiples llamadas innecesarias al servicio
    if( this.queryCacheCapital.has(query) )
    {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    console.log('Llegando al servidor por ' + query)

    //En el get se indica que tipo de dato se va a retornar, para evitar el uso de any
    //y el subscribe sepa que tipo de dato es el que va a recibir

    //se usa la función tap de rxjs para hacer un efecto secundario sin necesidad de alterar lo ya obtenido por la
    //llamada a servicio, en este caso se crea el par 'key':value del objeto Map que se llama queryCacheCapital
    //para tener su registro en memoria en forma de query:Country[], donde el query es el parámetro de búsqueda
    //y el Country[] un objeto que puede trar un array de Countries con datos o vacío

    //por ejemplo "ardf":[] o "mex":[contenido de países cuya capital incluya mex]

    //lo demás contnúa con su flujo normal para procesar la información obtenida


    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${ query }`)
    .pipe(
      map((item) => {
        return CountryMapper.mapRestCountryItemsToCountryArray(item);
      }),
      tap((countries)=>{
        this.queryCacheCapital.set(query,countries);
      }),
      catchError(error => {
        console.log('Error fetching ', error);

        return throwError(() => new Error(`No se pudieron obtener países con ese query ${query}`));
      })
    );
  }

  searchByCountry = ( query:string ):Observable<Country[]> => {

    query= query.toLowerCase();

    if( this.queryCacheCountry.has(query))
    {
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    console.log('Llega al servidor con el query de paises')
    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
    .pipe(
      map((item)=>{
        return CountryMapper.mapRestCountryItemsToCountryArray(item);
      }),
      delay(2000),
      tap((countries)=>{
        this.queryCacheCountry.set(query, countries);
      }),
      catchError(error => {
        console.log('Error fetching ', error);

        return throwError(() => new Error(`No se pudieron obtener países con ese query ${query}`));
      })
    )

  }

  searchCountryByRegion = (query:string):Observable<Country[]> => {
    
    query = query.toLowerCase();

    if( this.queryCacheRegion.has(query))
    {
      return of(this.queryCacheRegion.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${query}`)
    .pipe(
      map((item) => {
        return CountryMapper.mapRestCountryItemsToCountryArray(item);
      }),
      tap((countries)=>{
        this.queryCacheRegion.set(query, countries);
      }),
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
