export default class ArrayCache {

  constructor( $q, scaffold = {}, store = [] ) {

    this.$q       = $q;
    this.scaffold = scaffold;
    this.store    = store;

  }


  find( id ) {

    return this.store.find( item => {

      for (let key in id) {
        if ( item.data[ key ] !== id[ key ] ) {
          return false;
        }
      }

      return true;
    } );
  }

  findOrCreate( id ) {

    let cached = this.find( id );

    if ( !cached ) {

      cashed      = angular.copy( this.scaffold );
      cashed.data = angular.merge( cashed.data || {}, id );
      this.store.push( cached );

    }

    return cached;
  }


  get( id, stale = 0 ) {

    let cached = this.find( id );

    if ( cached && cached.stale >= stale ) {
      return this.$q.when( cached );
    }

    if ( cached && cached.promise ) {
      return cached.promise;
    }
  }


  getData( id, stale = 0 ) {

    let cached = this.find( id );

    if ( cached && cached.stale >= stale ) {
      return cached.data;
    }
  }


  set( id, data, promise ) {

    let cached = this.findOrCreate( id );

    if ( 'undefined' !== typeof data ) {
      return this.$q.when( this.setData( id, data, cached ) );
    }

    if ( 'undefined' !== typeof promise ) {
      return this.setPromise( id, promise, cached );
    }
  }


  setData( id, data, cached ) {

    if ( !cached ) {
      cached = this.findOrCreate( id );
    }

    cached.data  = data;
    cached.stale = Date.now();
    delete cached.promise;

    return cached.data;
  }

  setPromise( id, promise, cached ) {

    if ( !cached ) {
      cached = this.findOrCreate( id );
    }

    cached.promise = promise.then( data => this.setData( id, data, cached ) );
    cached.promise.finally( () => {
      delete cached.promise;
    } );

    return cached.promise;
  }


}
