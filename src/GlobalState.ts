import { useEffect, useState } from "react";
import { Dispatch } from "./Types/Dispatch";
import StateHolder from "./StateHolder";

export default class GlobalState {
    private static stateHolder: StateHolder

    public static get instance(): StateHolder {
        return this.stateHolder || (this.stateHolder = new StateHolder())
    }

    public static setState<T>(key: string, value: T) {
        this.instance.setState(key, value)
    }

    public static prepareState<T>(key: string, value: T) {
        if(this.existsState(key)) return

        this.setState(key, value)
    }

    public static on<T>(event: string, callback: (value: T) => void) {
        this.instance.on(event, callback)
    }

    public static existsState(key: string): boolean {
        return !!this.getState(key)
    }

    public static once<T>(event: string, callback: (value: T) => void) {
        this.instance.once(event, callback)
    }

    public static removeListener(event: string, func: (...args: any[]) => void) {
        this.instance.removeListener(event, func)
    }

    public static getState<T>(key: string): T {
        return this.instance.getState(key)
    }

    public static useState<T>(key: string, defaultValue?: T) : Dispatch<T> {
        if(defaultValue) this.prepareState(key, defaultValue)

        let [val, setVal] = useState<T>(this.getState(key))

        useEffect(() => {
            this.on(key, setVal)

            return () => this.removeListener(key, setVal)
        })

        return [val, (value: T) => this.setState(key, value)] as [T, (value: T) => never]
    }

}