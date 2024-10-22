import { ComponentProps, splitProps } from 'solid-js';
import { Polymorphic } from '../../../components';

import css from './index.module.css';

export interface FrameOptions
{
    w?: number;
    h?: number;

    x?: number;
    y?: number;
    z?: number;

    g?: number;

    'background-color'?: string;
    color?: string;
}

export type FrameProps = ComponentProps<'div'> & FrameOptions;

export function Frame ( props: FrameProps )
{
    const [ locals, others ] = splitProps( props, [ 'w', 'h', 'x', 'y', 'z', 'g', 'background-color', 'color' ] );

    return (
        <>
            <Polymorphic
                as='div'
                class={
                    css[ 'frame_root' ]
                }
                style={ {
                    'width': locals[ 'w' ] + 'px',
                    'height': locals[ 'h' ] + 'px',

                    'gap': locals[ 'g' ] + 'px',

                    'left': locals[ 'x' ] + 'px',
                    'top': locals[ 'y' ] + 'px',

                    'z-index': locals[ 'z' ],

                    'background-color': locals[ 'background-color' ],
                    'color': locals[ 'color' ]
                } }
                { ...others } />
        </>
    );
}