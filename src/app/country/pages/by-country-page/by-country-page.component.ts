import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom, of } from 'rxjs';

import { CountrySearchInputComponent } from '../../components/country-search-input/country-search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-country-page',
  imports: [CountrySearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByCountryPageComponent {


  countryService = inject(CountryService);
  query = signal('');

  countryResource = rxResource({

    request:() => ({ query: this.query() }),
    loader: ({request}) =>{

      if(!request.query) return of([]);

      
      return this.countryService.searchByCountry(request.query)
      
    }

  });


  // gettingSearchInputValue = (e:string) =>{
  //   console.log({e})
  // }

 }
