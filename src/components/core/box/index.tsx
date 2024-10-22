import { Dynamic, render } from 'solid-js/web';
import { Component, ComponentProps, JSX, splitProps } from 'solid-js';

export type BoxComponent = keyof JSX.IntrinsicElements | Component<any>;

export interface BoxOptions
{ };

export type BoxProps<T extends BoxComponent> = BoxOptions & Omit<ComponentProps<T>, keyof BoxOptions> & {
    as?: T | JSX.Element;
};

export function Box<T extends BoxComponent = 'div'> (
    props: BoxProps<T> & Omit<ComponentProps<T>, keyof BoxProps<T>>
)
{
    const [ local, others ] = splitProps( props, [ 'as' ] );

    return (
        <Dynamic
            component={ local[ 'as' ] || 'div' }
            { ...others }
        />
    );
}
