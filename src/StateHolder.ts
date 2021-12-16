import { EventEmitter } from 'events'

export default class StateHolder extends EventEmitter {

    private state: {[key:string]: any} = {}

    public setState<T>(key: string, value: T) {
        this.state[key] = value

        this.emit(key, value)
    }

    public getState<T>(key: string): T {
        return this.state[key]
    }
}