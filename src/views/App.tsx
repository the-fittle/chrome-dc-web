import { useContext, createContext, createSignal, createEffect, JSX, type Accessor, type Setter } from 'solid-js';
import { Box, Fontawesome } from '../components';

export function App ()
{
    const [ selectedComponents, setSelectedComponents ] = createSignal<JSX.Element[]>( [] );

    const [ state, setState ] = createSignal<AppContext>( {
        selectedComponents,
        setSelectedComponents
    } );

    return (
        <AppContext.Provider value={ state() }>
            <View />
        </AppContext.Provider>
    );
}

export interface AppContext
{
    selectedComponents: Accessor<JSX.Element[]>;
    setSelectedComponents: Setter<JSX.Element[]>;
}

export const AppContext = createContext<AppContext>();

export function useAppContext ()
{
    return useContext( AppContext );
}

// -----------------------------------------------------------------------------------------------------------

export function View ()
{
    return (
        <Box class='relative size-full'>
            <CanvasView />
            <ExplorerView />
            <InspectorView />
        </Box>
    );
};

export function InspectorView ()
{
    return ( <Box class='absolute t-2 b-2 r-2 w-1/3 flex flex-col place-items-center rounded-2 p-8 bg-white'>
        <Box class='flex flex-col g-2 w-full place-items-center'>
            <span class='font-bold text-4 text-left w-full'>Inspector</span>
            <span class='h-[2px] my-2 w-full bg-neutral-50'></span>
            <span class='font-bold text-3 text-left w-full'>Position</span>
            <Box class='flex flex-row w-full place-items-center'>
                <span class='text-3 text-left w-full'>X</span>
                <input type='number' value={ 0 } class='w-full p-1 text-right bg-neutral-100' />
            </Box>
            <Box class='flex flex-row w-full place-items-center'>
                <span class='text-3 text-left w-full'>Y</span>
                <input type='number' value={ 0 } class='w-full p-1 text-right bg-neutral-100' />
            </Box>
            <span class='h-[2px] w-full bg-neutral-50'></span>
            <Box class='flex flex-row w-full place-items-center'>
                <span class='text-3 text-left w-full'>Z</span>
                <input type='number' value={ 0 } class='w-full p-1 text-right bg-neutral-100' />
            </Box>
            <span class='h-[2px] my-2 w-full bg-neutral-50'></span>
            <span class='font-bold text-3 text-left w-full'>Size</span>
            <Box class='flex flex-row w-full place-items-center'>
                <span class='text-3 text-left w-full'>W</span>
                <input type='number' value={ 0 } class='w-full p-1 text-right bg-neutral-100' />
            </Box>
            <Box class='flex flex-row w-full place-items-center'>
                <span class='text-3 text-left w-full'>H</span>
                <input type='number' value={ 0 } class='w-full p-1 text-right bg-neutral-100' />
            </Box>
            <span class='h-[2px] my-2 w-full bg-neutral-50'></span>
            <span class='font-bold text-3 text-left w-full'>Appearance</span>
            <Box class='flex flex-row w-full place-items-center'>
                <span class='text-3 text-left w-full'>Background</span>
                <input type='color' class='w-full p-1 text-right bg-neutral-100' />
            </Box>
            <Box class='flex flex-row w-full place-items-center'>
                <span class='text-3 text-left w-full'>Color</span>
                <input type='color' class='w-full p-1 text-right bg-neutral-100' />
            </Box>
            <span class='h-[2px] w-full bg-neutral-50'></span>
            <Box class='flex flex-row w-full place-items-center'>
                <span class='text-3 text-left w-full'>Opacity</span>
                <input type='number' value={ 0 } class='w-full p-1 text-right bg-neutral-100' />
            </Box>
        </Box>
    </Box> );
}

export function ExplorerView ()
{
    return (
        <Box class='absolute t-2 b-2 l-2 w-1/5 flex flex-col place-items-center rounded-2 p-8 bg-white'>
            <Box class='flex flex-col g-2 w-full place-items-center'>
                <span class='font-bold text-4 text-left w-full'>Explorer</span>
                <span class='h-[2px] my-2 w-full bg-neutral-50'></span>
                <Box class='flex flex-row w-full place-items-center'>
                    <Fontawesome icon='frame' class='text-4 text-left w-6' />
                    <span class='text-3 text-left indent-2 w-full'>Frame (0)</span>
                </Box>
                <Box class='flex flex-row w-full place-items-center'>
                    <Fontawesome icon='square-dashed' class='text-4 text-left w-6' />
                    <span class='text-3 text-left indent-2 w-full'>Group (0)</span>
                </Box>
            </Box>
        </Box>
    );
}

export function CanvasView ()
{
    return (
        <Box class='relative size-full rounded-2 p-8 bg-neutral-100'>
            <Frame />
        </Box>
    );
}

export function Frame ()
{
    return (
        <Box class='relative l-1/2 -x-1/2 t-1/2 -y-1/2 w-32 h-32 hover:(outline outline-4 outline-blue) bg-white'>
        </Box>
    );
}