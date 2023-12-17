// import { Result } from 'true-myth'
// import { Result } from "pratica"

export type Result<T, E = undefined> =
    | { isOk: true; isErr: false; value: T }
    | { isOk: false; isErr: true; error: E };

export const Ok = <T>(data: T): Result<T, never> => {
    return { isOk: true, isErr: false, value: data };
};

export const Err = <E>(error: E): Result<never, E> => {
    return { isOk: false, isErr: true, error };
};

export interface KestrelError {
    friendly: string;
    cause?: any;
}

export type KResult<T> = Result<T, KestrelError>;
