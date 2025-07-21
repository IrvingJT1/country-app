import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { CountrySearchInputComponent } from '../../components/country-search-input/country-search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-capital-page',
  imports: [CountrySearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html'
})
export class ByCapitalPageComponent { 

  countryService = inject(CountryService);
  
  //snapshot se usa para tomar lectura de como viene una URL por una única vez, si se requere estar al tanto
  //de cualquier cambio en la url conviene usar queryparam o queryparamMap (sin snapshot) que vienen como observables
  //se indica que cuando no se tiene valor del query en la url se toma una cadena vacía en su lugar
  
  activatedRoute = inject(ActivatedRoute);

  router = inject(Router);
  
  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  
  query = linkedSignal(() => this.queryParam);
  //El recurso rxResource es básicamente lo mismo que el recurso anterior, solo que en este caso la función loader, no trabaja con promesas sino con observables
  //al trabajar con observables se retorna la invocación del servicio como va y si se retorna un arreglo vacío de hace a través de la funcion of()
  //al consumir el rxResource.value() ya se retorna el valor solicitado al observable como si se estuviera suscrito a este
  //por eso en el componente se manda como valor del prop de countries

  countryResource = rxResource({

    request: () => ({ query: this.query() }),
    loader: ({ request }) => {

      if(!request.query) return of([]);

      this.router.navigate(['/country/by-capital'],{
        queryParams:{
          query: request.query
        }
      });

      return this.countryService.searchByCapital(request.query);
      
    }

  });


  //Un recurso es una función que dentro de sí tiene un objeto de configuración
  //se usa sobre todo para hacer llamadas a servicios y sustituye el codigo anterior
  //en este momento 24/06/2025 aún está en fase experimental
  //tiene un método request que debe contener los parámetros que se espera que cambien en cada petición, en este caso query que está vinculado a un input de un componente externo
  //tiene un método loader que es asíncrono(retorna una promesa), que tiene como parámetro un objeto del cual se puede desestructurar el request actual y otros posibles valores (ver documentación)
  //dentro de esa función por ser asíncrona se usa la palabra reservad await para realizar la petición al servicio
  //se usa el método firstValueFrom que transforma un observable en promesa para evitar errores

  // countryResource = resource({

  //   request: () => ({ query: this.query() }),
  //   loader: async({ request }) => {

  //     if(!request.query) return [];

  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(request.query)
  //     );
  //   }

  // });

  //Fin de código con resource

  //Código sin resource

  // isLoading = signal(false);
  // isError = signal<string|null>(null);
  // countries = signal<Country[]>([]);


  // onSearch = (query: string) =>{
    
  //   //Esta línea bloquea sucesivas peticiones si isLoading está en true
  //   if(this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);
    
  //   this.countryService.searchByCapital( query ).subscribe({
  //     next:( countries ) => {
        
  //       this.isLoading.set(false);
  //       this.countries.set(countries);


  //     },
  //     error: ( err )=>{
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(err);
  //     }
  //   })

  // }

  //Fin de código sin resource


}
