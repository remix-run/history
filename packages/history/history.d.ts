export type Action = "POP" | "PUSH" | "REPLACE";

export type Path = string;
export type PathPieces = {
  pathname?: string;
  search?: string;
  hash?: string;
};

export type State = object;
export interface Location<S extends State = State> extends PathPieces {
  pathname: string;
  search: string;
  hash: string;
  state?: S;
  key?: string;
}

export interface Update<S extends State = State> {
  action: Action;
  location: Location<S>;
}
export interface Listener<S extends State = State> {
  (update: Update<S>): void;
}
export type Unlistener = () => void;

export interface Transaction<S extends State = State> extends Update {
  retry(): void;
}
export interface Blocker<S extends State = State> {
  (tx: Transaction<S>): void;
}
export type Unblocker = () => void;

export interface History<S extends State = State> {
  action: Action;
  location: Location<S>;
  createHref(to: Path | PathPieces): string;
  push(to: Path | PathPieces, state?: State): void;
  replace(to: Path | PathPieces, state?: State): void;
  go(n: number): void;
  back(): void;
  forward(): void;
  listen(listener: Listener<S>): Unlistener;
  block(blocker: Blocker<S>): Unblocker;
}
export interface MemoryHistory<S extends State = State> extends History<S> {
  index: number;
}

export function createBrowserHistory(options?: { window?: Window }): History;
export function createHashHistory(options?: { window?: Window }): History;

type InitialEntry = Path | PathPieces;
export function createMemoryHistory(options?: {
  initialEntries?: InitialEntry[];
  initialIndex?: number;
}): MemoryHistory;

export function createPath(pieces: PathPieces): Path;
export function parsePath(path: Path): PathPieces;
