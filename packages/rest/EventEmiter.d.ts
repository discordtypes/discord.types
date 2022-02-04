/** The callback type. */
declare type Callback = (...args: any[]) => any | Promise<any>;
declare type EventsType = {
    [key: string]: Callback;
} & {
    [key: number]: Callback;
};
/**
 * The event emitter.
 */
export declare class EventEmitter<E extends EventsType = {}> {
    /**
     * This is where the events and listeners are stored.
     */
    private _events_;
    /**
     * Listen for a typed event.
     * @param event The typed event name to listen for.
     * @param listener The typed listener function.
     */
    on<K extends keyof E>(event: K, listener: E[K]): this;
    /**
     * Listen for a typed event once.
     * @param event The typed event name to listen for.
     * @param listener The typed listener function.
     */
    once<K extends keyof E>(event: K, listener: E[K]): this;
    /**
     * Remove a specific listener in the event emitter on a specific
     * typed event.
     * @param event The typed event name.
     * @param listener The typed event listener function.
     */
    off<K extends keyof E>(event: K, listener: E[K]): this;
    /**
     * Remove all listeners on a specific typed event.
     * @param event The typed event name.
     */
    off<K extends keyof E>(event: K): this;
    /**
     * Remove all events from the event listener.
     */
    off(): this;
    /**
     * Emit a typed event without waiting for each listener to
     * return.
     * @param event The typed event name to emit.
     * @param args The arguments to pass to the typed listeners.
     */
    emitSync<K extends keyof E>(event: K, ...args: Parameters<E[K]>): this;
    /**
     * Emit a typed event and wait for each typed listener to return.
     * @param event The typed event name to emit.
     * @param args The arguments to pass to the typed listeners.
     */
    emit<K extends keyof E>(event: K, ...args: Parameters<E[K]>): Promise<this>;
    /**
     * The same as emitSync, but wait for each typed listener to
     * return before calling the next typed listener.
     * @param event The typed event name.
     * @param args The arguments to pass to the typed listeners.
     */
    queue<K extends keyof E>(event: K, ...args: Parameters<E[K]>): this;
}
export default EventEmitter;
