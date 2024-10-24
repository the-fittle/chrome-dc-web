// import { Dynamic } from 'solid-js/web';
// import { type ValidComponent, ComponentProps, JSX, splitProps } from 'solid-js';

// export interface BoxOptions<T extends ValidComponent>
// {
//     as?: T | JSX.Element;
// };

// export type BoxProps<T extends ValidComponent> = BoxOptions<T> & Omit<ComponentProps<T>, keyof BoxOptions<T>>;

// export function Box<T extends ValidComponent = 'div'> ( props: BoxProps<T> )
// {
//     const [ local, others ] = splitProps( props, [ 'as' ] );

//     return (
//         <Dynamic
//             component={ local[ 'as' ] || 'div' }
//             { ...others }
//         />
//     );
// }