import Cache from './Cache';

export default class CacheService {

  constructor( $q ) {
    'ngInject';

    this.$q     = $q;
    this.stores = {};

  }


  getDictionaryStore( name, scaffold = {}, store = {} ) {

    if ( !this.stores[ name ] ) {
      this.stores[ name ] = new DictionaryCache( this.$q, scaffold, store );
    }

    return this.stores[ name ];
  }

  getArrayStore( name, scaffold = {}, store = [] ) {

    if ( !this.stores[ name ] ) {
      this.stores[ name ] = new ArrayCache( this.$q, scaffold, store );
    }

    return this.stores[ name ];
  }

}
