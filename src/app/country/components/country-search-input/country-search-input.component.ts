import { Component, input, output } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './country-search-input.component.html',
})
export class CountrySearchInputComponent {

  nameChange = output<string>();
  placeholder = input('Buscar');

  onSearch = (value:string) => {
    this.nameChange.emit(value);
  }

 }
