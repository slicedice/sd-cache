import Cache from './Cache';

export default class CacheService {

  constructor( $q ) {

    this.$q = $q;

    this.stores = {};

  }


  getStore( name, scaffold = {}, store = {} ) {

    if ( !this.stores[ name ] ) {
      this.stores[ name ] = new Cache( this.$q, scaffold, store );
    }

    return this.stores[ name ];
  }

}
