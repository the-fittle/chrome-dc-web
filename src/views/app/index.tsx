// Drag and Drop Context and Feature Implementation for Frames
// -----------------------------------------------------------------------------------------------------------
import type { JSX, ValidComponent, ComponentProps, Accessor, Setter } from 'solid-js';
import { createSignal, createEffect, createContext, useContext, splitProps, onMount, onCleanup, Show } from 'solid-js';
import { createStore, SetStoreFunction } from 'solid-js/store';
import { Dynamic, For } from 'solid-js/web';
import { v4 } from 'uuid';

import css from './index.module.css';

// Box Component
// -----------------------------------------------------------------------------------------------------------
export interface BoxOptions<T extends ValidComponent>
{
    as?: T | JSX.Element;
}

export type BoxProps<T extends ValidComponent> = BoxOptions<T> & Omit<ComponentProps<T>, keyof BoxOptions<T>>;

export function Box<T extends ValidComponent = 'div'> ( props: BoxProps<T> )
{
    const [ local, others ] = splitProps( props, [ 'as' ] );

    return (
        <Dynamic
            component={ local[ 'as' ] || 'div' }
            { ...others }
        />
    );
}

// Drag Context
// -----------------------------------------------------------------------------------------------------------
export const DragContext = createContext<[ Accessor<Dragging | null>, Setter<Dragging | null> ]>( null! );

export interface Dragging
{
    id: string;
    offsetX: number;
    offsetY: number;
}

export function useDragContext ()
{
    const context = useContext( DragContext );
    if ( !context )
    {
        throw new Error( 'useDragContext must be used within a DragProvider' );
    }
    return context;
}

// App Component
// -----------------------------------------------------------------------------------------------------------
export function AppRoot ()
{
    const [ appContext, setAppContext ] = createStore<AppContext>( {} );
    const [ draggingContext, setDraggingContext ] = createSignal<Dragging | null>( null );

    const [ selectedFrameIds, setSelectedFrameIds ] = createSignal<string[]>( [] );

    return (
        <DragContext.Provider value={ [ draggingContext, setDraggingContext ] }>
            <AppContext.Provider value={ [ appContext, setAppContext ] }>
                <App.Content selectedFrameIds={ selectedFrameIds } setSelectedFrameIds={ setSelectedFrameIds } />
                <Show when={ selectedFrameIds().length > 0 }><></>
                </Show>
                <Inspector frameIds={ selectedFrameIds() } />
            </AppContext.Provider>
        </DragContext.Provider>
    );
}

// AppContent Component
// -----------------------------------------------------------------------------------------------------------
interface AppContentProps
{
    selectedFrameIds: () => string[];
    setSelectedFrameIds: ( ids: string[] ) => void;
}

export function AppContent ( props: AppContentProps )
{
    const [ context, setContext ] = useAppContext();
    const { selectedFrameIds, setSelectedFrameIds } = props;
    const [ , setDragging ] = useDragContext();

    const addFrame = () =>
    {
        const id = v4();
        setContext( ( prev ) => ( {
            ...prev,
            [ id ]: {
                id,
                x: Math.random() * 500,
                y: Math.random() * 200,
                w: 100,
                h: 100,
                background: 'white',
                color: 'black',
                opacity: 1,
                as: 'div',
            },
        } ) );
        setSelectedFrameIds( [ id ] );
    };

    const handleFrameClick = ( id: string, e: MouseEvent ) =>
    {
        if ( e.shiftKey )
        {
            if ( selectedFrameIds().includes( id ) )
            {
                setSelectedFrameIds( selectedFrameIds().filter( ( frameId ) => frameId !== id ) );
            } else
            {
                setSelectedFrameIds( [ ...selectedFrameIds(), id ] );
            }
        } else
        {
            setSelectedFrameIds( [ id ] );
        }
    };

    onMount( () =>
    {
        const handleKeydown = ( e: KeyboardEvent ) =>
        {
            if ( e.key === 'Escape' )
            {
                setSelectedFrameIds( [] );
            }
        };

        window.addEventListener( 'keydown', handleKeydown );
        onCleanup( () => window.removeEventListener( 'keydown', handleKeydown ) );
    } );

    return (
        <div class="flex">
            <div class="flex-1 p-4">
                <button class="mb-4 p-2 bg-blue-500 text-white rounded" onClick={ addFrame }>Add Frame</button>
                <For each={ Object.keys( context ) }>
                    { ( id ) => (
                        <Frame
                            { ...context[ id ] }
                            onClick={ ( e ) => handleFrameClick( id, e ) }
                            isSelected={ selectedFrameIds().includes( id ) }
                        />
                    ) }
                </For>
            </div>
        </div>
    );
}

// App Context
// -----------------------------------------------------------------------------------------------------------
export interface AppContext
{
    [ id: string ]: FrameOptions;
}

const AppContext = createContext<[ AppContext, SetStoreFunction<AppContext> ]>();

export function useAppContext ()
{
    const context = useContext( AppContext );

    if ( !context )
    {
        throw new Error( 'useAppContext must be used within an AppContext.Provider' );
    }

    return context;
}

// App Component
// -----------------------------------------------------------------------------------------------------------
export const App = Object.assign( AppRoot, { Content: AppContent } );

// Frame Component (with Dragging Support)
// -----------------------------------------------------------------------------------------------------------
export interface FrameOptions<T extends ValidComponent = 'div'> extends BoxOptions<T>
{
    id?: string;
    name?: string;
    style?: JSX.CSSProperties | string | undefined;
    class?: string;

    x?: number;
    y?: number;

    w?: number;
    h?: number;

    background?: string;
    color?: string;

    opacity?: number;
}

export type FrameProps<T extends ValidComponent> = FrameOptions<T> & Omit<ComponentProps<T>, keyof FrameOptions<T>> & {
    onClick?: ( e: MouseEvent ) => void;
    isSelected?: boolean;
};

export function Frame<T extends ValidComponent = 'div'> ( props: FrameProps<T> )
{
    const [ locals, others ] = splitProps( props, [
        'as', 'id', 'name', 'style', 'class', 'x', 'y', 'w', 'h', 'background', 'color', 'opacity', 'onClick', 'isSelected',
    ] );
    const [ dragging, setDragging ] = useDragContext();
    const [ resizing, setResizing ] = createSignal<string | null>( null );
    const [ context, setContext ] = useAppContext();

    const handleMouseDown = ( e: MouseEvent ) =>
    {
        if ( locals.id )
        {
            setDragging( {
                id: locals.id,
                offsetX: e.clientX - ( locals.x ?? 0 ),
                offsetY: e.clientY - ( locals.y ?? 0 ),
            } );
        }
    };

    const handleResizeMouseDown = ( e: MouseEvent, direction: string ) =>
    {
        e.stopPropagation();
        if ( locals.id )
        {
            setResizing( direction );
        }
    };

    const handleMouseUp = () =>
    {
        setDragging( null );
        setResizing( null );
    };

    onMount( () =>
    {
        window.addEventListener( 'mouseup', handleMouseUp );
        onCleanup( () => window.removeEventListener( 'mouseup', handleMouseUp ) );
    } );

    createEffect( () =>
    {
        if ( dragging() && dragging()!.id === locals.id )
        {
            const handleMouseMove = ( e: MouseEvent ) =>
            {
                e.preventDefault(); // Prevent default to avoid UI freezes
                requestAnimationFrame( () =>
                { // Use requestAnimationFrame to avoid blocking the main thread
                    setContext( dragging()!.id, 'x', e.clientX - dragging()!.offsetX );
                    setContext( dragging()!.id, 'y', e.clientY - dragging()!.offsetY );
                } );
            };

            window.addEventListener( 'mousemove', handleMouseMove );
            onCleanup( () => window.removeEventListener( 'mousemove', handleMouseMove ) );
        }
    } );

    createEffect( () =>
    {
        if ( resizing() && locals.id )
        {
            const handleMouseMove = ( e: MouseEvent ) =>
            {
                e.preventDefault(); // Prevent default to avoid UI freezes
                requestAnimationFrame( () =>
                { // Use requestAnimationFrame to avoid blocking the main thread
                    const deltaX = e.movementX;
                    const deltaY = e.movementY;
                    const direction = resizing();

                    if ( direction && locals.id )
                    {
                        let newWidth = locals.w ?? 100;
                        let newHeight = locals.h ?? 100;
                        let newX = locals.x ?? 0;
                        let newY = locals.y ?? 0;

                        if ( direction.includes( 'right' ) )
                        {
                            newWidth += deltaX;
                        }
                        if ( direction.includes( 'left' ) )
                        {
                            newWidth -= deltaX;
                            newX += deltaX;
                        }
                        if ( direction.includes( 'bottom' ) )
                        {
                            newHeight += deltaY;
                        }
                        if ( direction.includes( 'top' ) )
                        {
                            newHeight -= deltaY;
                            newY += deltaY;
                        }

                        setContext( locals.id, 'w', newWidth );
                        setContext( locals.id, 'h', newHeight );
                        setContext( locals.id, 'x', newX );
                        setContext( locals.id, 'y', newY );
                    }
                } );
            };

            window.addEventListener( 'mousemove', handleMouseMove );
            onCleanup( () => window.removeEventListener( 'mousemove', handleMouseMove ) );
        }
    } );

    return (
        <Box
            as={ String( locals.as || 'div' ) }
            style={ {
                left: `${ locals.x ?? 0 }px`,
                top: `${ locals.y ?? 0 }px`,
                width: `${ locals.w ?? 100 }px`,
                height: `${ locals.h ?? 100 }px`,
                background: locals.background ?? 'white',
                color: locals.color ?? 'black',
                opacity: locals.opacity ?? 1,
                ...( typeof locals.style === 'object' ? locals.style : {} ),
            } }
            class={ [
                'relative border border-gray-300 shadow-md cursor-pointer',
                locals.class,
                locals.isSelected ? css[ 'frame--root--selected' ] : '',
            ].filter( Boolean ).join( ' ' ) }
            onClick={ locals.onClick }
            onMouseDown={ handleMouseDown }
            { ...others }
        >
            { locals.isSelected && (
                <>
                    { [ 'top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left' ].map( ( position ) => (
                        <div
                            class={ `absolute bg-white w-2 h-2 outline outline-4 outline-blue ${ getPositionClass( position ) }` }
                            onMouseDown={ ( e ) => handleResizeMouseDown( e, position ) }
                        />
                    ) ) }
                </>
            ) }
        </Box>
    );
}

function getPositionClass ( position: string ): string
{
    switch ( position )
    {
        case 'top-left':
            return '-top-1 -left-1 cursor-nw-resize';
        case 'top':
            return '-top-1 left-1/2 transform -translate-x-1/2 cursor-n-resize';
        case 'top-right':
            return '-top-1 -right-1 cursor-ne-resize';
        case 'right':
            return 'top-1/2 -right-1 transform -translate-y-1/2 cursor-e-resize';
        case 'bottom-right':
            return '-bottom-1 -right-1 cursor-se-resize';
        case 'bottom':
            return '-bottom-1 left-1/2 transform -translate-x-1/2 cursor-s-resize';
        case 'bottom-left':
            return '-bottom-1 -left-1 cursor-sw-resize';
        case 'left':
            return 'top-1/2 -left-1 transform -translate-y-1/2 cursor-w-resize';
        default:
            return '';
    }
}

// Inspector Component (Reactive)
// -----------------------------------------------------------------------------------------------------------
interface InspectorProps
{
    frameIds: string[];
}

function Inspector ( props: InspectorProps )
{
    const [ context, setContext ] = useAppContext();
    const frames = () => props.frameIds.map( ( id ) => context[ id ] );

    // Update the selected frames' properties using `setContext`
    const handleInputChange = ( field: keyof FrameOptions ) => ( e: Event ) =>
    {
        const target = e.currentTarget as HTMLInputElement;
        props.frameIds.forEach( ( id ) =>
        {
            setContext( id, field, field === 'opacity' ? parseFloat( target.value ) : target.value );
        } );
    };

    return (
        <div class="absolute t-0 r-0 h-full w-1/3 p-4 bg-gray-100 rounded-md shadow-md">
            <div class="mb-2">
                <label class="block font-semibold">X:</label>
                <input
                    type="number"
                    class="p-1 border rounded"
                    value={ frames()[ 0 ]?.x }
                    onInput={ handleInputChange( 'x' ) }
                />
            </div>
            <div class="mb-2">
                <label class="block font-semibold">Y:</label>
                <input
                    type="number"
                    class="p-1 border rounded"
                    value={ frames()[ 0 ]?.y }
                    onInput={ handleInputChange( 'y' ) }
                />
            </div>
            <div class="mb-2">
                <label class="block font-semibold">Width:</label>
                <input
                    type="number"
                    class="p-1 border rounded"
                    value={ frames()[ 0 ]?.w }
                    onInput={ handleInputChange( 'w' ) }
                />
            </div>
            <div class="mb-2">
                <label class="block font-semibold">Height:</label>
                <input
                    type="number"
                    class="p-1 border rounded"
                    value={ frames()[ 0 ]?.h }
                    onInput={ handleInputChange( 'h' ) }
                />
            </div>
            <div class="mb-2">
                <label class="block font-semibold">Background:</label>
                <input
                    type="text"
                    class="p-1 border rounded"
                    value={ frames()[ 0 ]?.background }
                    onInput={ handleInputChange( 'background' ) }
                />
            </div>
            <div class="mb-2">
                <label class="block font-semibold">Color:</label>
                <input
                    type="text"
                    class="p-1 border rounded"
                    value={ frames()[ 0 ]?.color }
                    onInput={ handleInputChange( 'color' ) }
                />
            </div>
            <div class="mb-2">
                <label class="block font-semibold">Opacity:</label>
                <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    class="p-1 border rounded"
                    value={ frames()[ 0 ]?.opacity }
                    onInput={ handleInputChange( 'opacity' ) }
                />
            </div>
        </div>
    );
}
