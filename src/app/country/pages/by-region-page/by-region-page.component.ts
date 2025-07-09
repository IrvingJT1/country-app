import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { RegionButtonsComponent } from '../../components/region-buttons/region-buttons.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { CountryService } from '../../services/country.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent, RegionButtonsComponent],
  templateUrl: './by-region-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByRegionPageComponent {

  regionName = signal<string>('');
  countryService = inject(CountryService);

  regionResource = rxResource({
    request: () => ({ query: this.regionName() }),

    loader: ({ request }) => {

      if(!request.query) return of([]);

      return this.countryService.searchCountryByRegion(request.query);

    }
  });


  // countryService = inject(CountryService);

  // countryResource = rxResource({

  //   request: () => ({ query: this.query() }),
  //   loader: ({ request }) => {

  //     if(!request.query) return of([]);

      
  //     return this.countryService.searchByCapital(request.query);
      
  //   }

  // });

 }
