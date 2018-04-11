export function copymap< T, J >( from: Map< T, J >, to: Map< T, J > ): void {
    to.clear();
    for( let [ k, v ] of from ){
        to.set( k, v );
    }    
}