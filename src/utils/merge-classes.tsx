function mergeClasses ( ...classes: ( string | undefined )[] ): string
{
	return classes.filter( String ).join( ' ' );
}
