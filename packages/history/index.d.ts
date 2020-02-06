export type Action = 'POP' | 'PUSH' | 'REPLACE';

export interface State {}
export type Path = string;
export interface PathPieces {
  pathname?: string;
  search?: string;
  hash?: string;
}
export interface Location<S = State> extends PathPieces {
  pathname: string;
  search: string;
  hash: string;
  state?: S;
  key?: string;
}

export interface Update<S = State> {
  action: Action;
  location: Location<S>;
}
export type Listener<S = State> = (update: Update<S>) => void;
export type Unlistener = () => void;

export interface Transaction<S = State> extends Update<S> {
  retry(): void;
}
export type Blocker<S = State> = (tx: Transaction<S>) => void;
export type Unblocker = () => void;

export interface History {
  action: Action;
  location: Location;
  createHref(to: Path | PathPieces): string;
  push(to: Path | PathPieces, state: State | undefined): void;
  replace(to: Path | PathPieces, state: State | undefined): void;
  go(n: number): void;
  back(n: number): void;
  forward(n: number): void;
  listen(listener: Listener): Unlistener;
  block(blocker: Blocker): Unblocker;
}
export interface MemoryHistory extends History {
  index: number;
}

export function createBrowserHistory(options?: { window?: Window }): History;
export function createHashHistory(options?: { window?: Window }): History;

type MemoryHistoryEntry = Path | {
  pathname?: string;
  search?: string;
  hash?: string;
  state?: State;
  key?: string;
}
export function createMemoryHistory(options?: {
  initialEntries?: MemoryHistoryEntry[],
  initialIndex?: number
}): MemoryHistory;

export function createPath(pieces: PathPieces): Path;
export function parsePath(path: Path): PathPieces;
