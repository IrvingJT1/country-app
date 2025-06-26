import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Country } from '../../../interfaces/country.interface';
import { FlagViewerComponent } from "../../../components/flag-viewer/flag-viewer.component";

@Component({
  selector: 'country-information',
  imports: [DecimalPipe, FlagViewerComponent],
  templateUrl: './country-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryInformationComponent {

    country = input.required<Country>();

 }
