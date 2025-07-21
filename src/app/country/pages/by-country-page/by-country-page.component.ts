import { ChangeDetectionStrategy, Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import { CountrySearchInputComponent } from '../../components/country-search-input/country-search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-country-page',
  imports: [CountrySearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByCountryPageComponent {

  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);

  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';

  query = linkedSignal(()=>this.queryParam);

  countryResource = rxResource({

    request:() => ({ query: this.query() }),
    loader: ({request}) =>{

      console.log({query : request.query})

      if(!request.query) return of([]);

      this.router.navigate(['/country/by-country'],{
        queryParams:{
          query: request.query
        }
      })
      
      return this.countryService.searchByCountry(request.query)
      
    }

  });


  // gettingSearchInputValue = (e:string) =>{
  //   console.log({e})
  // }

 }
