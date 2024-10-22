import { ComponentProps } from 'solid-js';
import { Polymorphic } from '../../../components';

import css from './index.module.css';

export interface BoxRootOptions
{ }

export type BoxRootProps = ComponentProps<'div'> & BoxRootOptions;

export function BoxRoot ( props: BoxRootProps )
{
    return (
        <>
            <Polymorphic
                as='div'
                class={ css[ 'box--root' ] }
                { ...props } />
        </>
    );
}

export const Box = Object.assign( BoxRoot, {} );