import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { Region } from '../../interfaces/region.interface';

@Component({
  selector: 'region-buttons',
  imports: [],
  templateUrl: './region-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionButtonsComponent {

  regionName = output<string>();

  selectedRegion = signal<string>('');

  //Conservado para futuras referencias, en el actual código no se usa
  selectedArr = signal([
    false,
    false,
    false,
    false,
    false,
    false
  ]); 

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  //NOTA.- Conservado para futuras referencias, en el actual código no se usa

  //Así se actualiza un signal de tipo array de boolean
  //En este caso tomando arr como el valor actual del signal
  //Se evalúa si el índice ya fue seleccionado es igual al índice del recorrido del map, 
  //en ese caso será true, en caso contrario el resto deberían ser valores false
  //En el ejemplo selectedArr tendrá el valor de newArr por la función que actualiza el signal

  updateSignalArr = (idx: number) =>{

    this.selectedArr.update((arr) => {

      const newArr = arr.map((item, i)=>{
        i === idx? item = true: item = false;
        return item;
      })

      return newArr;
    })

  }

  //Fin de NOTA

  onSearch = (region:string, idx:number) => {

    // this.updateSignalArr(idx);

    this.selectedRegion.set(region);

    this.regionName.emit(region);
  }
 }
