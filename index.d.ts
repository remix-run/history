
type Action = 'PUSH' | 'REPLACE' | 'POP';

interface Location {

    // The path of the URL.    
    pathname: string,

    // The URL query string
    search?: string, 

    // The URL hash fragment
    hash?: string;

    // Some extra state for this location that does not reside in the URL (supported in `createBrowserHistory` and `createMemoryHistory`).
    state?: any;
} 

interface LocationAndKey extends Location {

    // A unique string representing this location (supported in `createBrowserHistor` and `createMemoryHistory`).
    key?: string;
}
    

interface ListenCallback {
    (location: LocationAndKey, action?: Action): void;
}

interface BlockCallback {
    (location: LocationAndKey, action?: Action): string;
}

interface Unsubscribe {
    (): void;
}


interface History {

    // The number of entries in the history stack.    
    length: number;

    // The current location (see below).
    location: LocationAndKey;

    // The current navigation action (see below).
    action: Action;
        
    listen(callback: ListenCallback): Unsubscribe;

    push(path: string, state?: any);
    push(location: Location);
    replace(path: string, state?: any);
    replace(location: Location);
    
    go(n: number);
    goBack();
    goForward();

    block(message: string): void;
    block(callback: BlockCallback): Unsubscribe;
}

interface MemoryHistory extends History {

    index: number;
    entries: string[];

    canGo(n: number);
}


interface GetUserConfirmation {
    (message: string, callback: (continueTransition: boolean) => void);
}


interface BrowserHistoryOptions {

    // The base URL of the app.
    // Default: ''
    basename?: string,        

    // Set true to force full page refreshes.
    // Default: false
    forceRefresh?: boolean,  

    // The length of `location.key`.
    // Default: 6
    keyLength?: number,     
    
    // A function to use to confirm navigation with the user.
    // Default: (message, callback) => callback(window.confirm(message))
    getUserConfirmation: GetUserConfirmation;    
}

export function createBrowserHistory(options?: BrowserHistoryOptions): History;



interface MemoryHistoryOptions {

    // The initial URLs in the history stack.
    // Default: ['/']    
    initialEntries?: string[],  

    // The starting index in the history stack.
    // Default: 0
    initialIndex?: number,     

    // The length of `location.key`.
    // Default: 6
    keyLength?: number,

    // A function to use to confirm navigation with the user. Required
    // if you return string prompts from transition hooks.
    // Default: null
    getUserConfirmation?: GetUserConfirmation
}

export function createMemoryHistory(options?: MemoryHistoryOptions): MemoryHistory;



type HashType = 'slash' | 'noslash' | 'hashbang';

interface HashHistoryOptions {

    // The base URL of the app.
    // Default: ''
    basename?: string,        

    // The hash type to use.
    // Default: 'slash'
    hashType?: HashType,  
    
    // A function to use to confirm navigation with the user.
    // Default: (message, callback) => callback(window.confirm(message))
    getUserConfirmation?: GetUserConfirmation;      
}

export function createHashHistory(options?: HashHistoryOptions): History;


export function createLocation(path: string | Location, state?: any, key?: string, currentLocation?: Location): LocationAndKey;
export function locationsAreEqual(a: LocationAndKey, b: LocationAndKey): boolean;

export function parsePath(path: string): Location;
export function createPath(location: Location): string;
