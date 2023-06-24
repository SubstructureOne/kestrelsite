import { Result } from 'true-myth'

export interface KestrelError {
    friendly: string
    cause?: any
}

export type KResult<T> = Result<T, KestrelError>
