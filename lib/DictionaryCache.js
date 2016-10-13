export default class DictionaryCache {

  constructor( $q, scaffold = {}, store = {} ) {

    this.$q       = $q;
    this.scaffold = scaffold;
    this.store    = store;

  }


  get( id, stale = 0 ) {

    if ( this.store[ id ] && this.store[ id ].stale >= stale ) {
      return this.$q.when( this.store[ id ] );
    }

    if ( this.store[ id ] && this.store[ id ].promise ) {
      return this.store[ id ].promise;
    }
  }


  getData( id, stale = 0 ) {

    if ( this.store[ id ] && this.store[ id ].stale >= stale ) {
      return this.store[ id ].data;
    }
  }


  set( id, data, promise ) {

    if ( 'undefined' !== typeof data ) {
      return this.$q.when( this.setData( id, data ) );
    }

    if ( 'undefined' !== typeof promise ) {
      return this.setPromise( id, promise );
    }
  }


  setData( id, data ) {

    if ( !this.store[ id ] ) {
      this.store[ id ] = angular.copy( this.scaffold );
    }

    this.store[ id ].data  = data;
    this.store[ id ].stale = Date.now();
    delete this.store[ id ].promise;

    return this.store[ id ];
  }

  setPromise( id, promise ) {

    if ( !this.store[ id ] ) {
      this.store[ id ] = angular.copy( this.scaffold );
    }

    this.store[ id ].promise = promise.then( data => this.setData( id, data ) );
    this.store[ id ].promise.finally( () => {
      delete this.store[ id ].promise;
    } );

    return this.store[ id ].promise;
  }

}
