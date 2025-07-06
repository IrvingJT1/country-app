import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './country-search-input.component.html',
})
export class CountrySearchInputComponent {

  nameChange = output<string>();
  placeholder = input('Buscar');
  inputValue = signal<string>('');

  //Se establece un effect, similar al useEffect de React
  //al usar inputValue() y ver que es un signal, el effect ya sabe que debe revisar si hay algun cambio en esa variable
  //se establece un setTimeout para asegurar un emit al componente padre cada cierto tiempo, en este caso 500ms
  //se usa la función asociada a effect que se llama onCleanup, y esta se usa para hacer "limpieza" cada vez que se requiera
  //las únicas formas en que se ejecuta es cuando se destruye el componente o cada vez que el signal inputValue() cambie de valor
  //se define el método dentro del effect y en él solo se usa la función clearTimeout para cancelar el objeto timeout que se ejecuta cada 500ms
  //de esta forma se asegura que hasta que el usuario deje de escribir, la llamada a servicio se llevará a cabo 
  debounceEffect = effect((onCleanup)=>{
    const value = this.inputValue();

    const timeout = setTimeout(() => {
      this.nameChange.emit(value);
    }, 500);

    onCleanup(()=>{
      clearTimeout(timeout);
    });
  });

  onSearch = (value:string) => {
    this.nameChange.emit(value);
  }

 }
