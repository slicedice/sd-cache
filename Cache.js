export default class Cache {

  constructor( $q, scaffold = {}, store = {} ) {

    this.$q = $q;
    this.scaffold = scaffold;
    this.store = store;

  }


  get( id, stale = 0 ) {

    if ( !this.store[ id ] ) {
      this.store[ id ] = angular.copy( this.scaffold );
    }

    if ( this.store[ id ].stale >= stale ) {
      return this.$q.when( this.store[ id ].data );
    }

    if ( this.store[ id ].promise ) {
      return this.store[ id ].promise;
    }
  }


  getData( id, stale = 0 ) {

    if ( !this.store[ id ] ) {
      this.store[ id ] = angular.copy( this.scaffold );
    }

    if ( this.store[ id ].stale >= stale ) {
      return this.store[ id ].data;
    }
  }


  set( id, data, promise ) {

    if ( !this.store[ id ] ) {
      this.store[ id ] = angular.copy( this.scaffold );
    }

    if ( 'undefined' !== typeof data ) {

      this.store[ id ].data = data;
      this.store[ id ].stale = Date.now();
      delete this.store[ id ].promise;

      return this.$q.when( this.store[ id ].data );
    }

    if ( 'undefined' !== typeof promise ) {

      this.store[ id ].promise = promise.then( data => this.set( id, data ) );
      this.store[ id ].promise.finally( () => {
        delete this.store[ id ].promise;
      } );

      return this.store[ id ].promise;
    }
  }


  setData( id, data ) {

    if ( !this.store[ id ] ) {
      this.store[ id ] = angular.copy( this.scaffold );
    }

    this.store[ id ].data = data;
    this.store[ id ].stale = Date.now();
    delete this.store[ id ].promise;

    return this.store[ id ].data;
  }

}
