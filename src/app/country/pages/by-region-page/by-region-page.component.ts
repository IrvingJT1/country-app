import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { RegionButtonsComponent } from '../../components/region-buttons/region-buttons.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { CountryService } from '../../services/country.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Region } from '../../interfaces/region.interface';

function validateQueryParam( queryParam:string ): Region {

  queryParam = queryParam.toLowerCase();

  const regions: Record<string, Region> = {
  'africa':'Africa',
  'americas':'Americas',
  'asia':'Asia',
  'europe':'Europe',
  'oceania':'Oceania',
  'antarctic':'Antarctic'
  };

  return regions[queryParam] ?? 'Americas';
}

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent, RegionButtonsComponent],
  templateUrl: './by-region-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByRegionPageComponent {

  // regionName = signal<string>('');
  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);

  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';

  regionName = linkedSignal<Region | string>(() => validateQueryParam(this.queryParam));

  regionResource = rxResource({
    request: () => ({ region: this.regionName() }),

    loader: ({ request }) => {

      if(!request.region) return of([]);

      this.router.navigate(['/country/by-region'],{
        queryParams:{
          region: request.region
        }
      })

      return this.countryService.searchCountryByRegion(request.region);

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
