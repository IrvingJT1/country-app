import { Country } from "../interfaces/country.interface";
import { RESTCountry } from "../interfaces/rest-countries.interface";

export class CountryMapper{

    //static RestCountry => Country

    static mapRestCountryToCountry( item: RESTCountry ): Country{
        return {
            cca2: item.cca2,
            flag: item.flag,
            flagSvg: item.flags.svg,
            name: item.translations['spa'].common ?? 'No Spanish name',
            officialName: item.name.official,
            region: item.region,
            borders: item.borders? item.borders?.join(', ') : 'No borders',
            capital: item.capital? item.capital.join(', ') : 'No capital here',
            population: item.population
        }
    }
    

    //static RestCountry[] => Country[]
    //lo que contiene internamente indica que aplicará la función mapRestCountryToCountry a cada elemento del arreglo
    //para devolver un array de tipo Country[]
    //se indica debajo la función equivalente

    static mapRestCountryItemsToCountryArray( items: RESTCountry[] ): Country[]{
        return items.map(this.mapRestCountryToCountry)
        //return items.map((country) => this.mapRestCountryToCountry(country))
    }

}