"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
/**
 * The event emitter.
 */
class EventEmitter {
    constructor() {
        /**
         * This is where the events and listeners are stored.
         */
        this._events_ = new Map();
    }
    /**
     * Listen for an event.
     * @param event The event name to listen for.
     * @param listener The listener function.
     */
    on(event, listener) {
        if (!this._events_.has(event))
            this._events_.set(event, new Set());
        this._events_.get(event).add(listener);
        return this;
    }
    /**
     * Listen for an event once.
     * @param event The event name to listen for.
     * @param listener The listener function.
     */
    once(event, listener) {
        const l = listener;
        l.__once__ = true;
        return this.on(event, l);
    }
    /**
     * Remove a specific listener on a specific event if both `event`
     * and `listener` is defined, or remove all listeners on a
     * specific event if only `event` is defined, or lastly remove
     * all listeners on every event if `event` is not defined.
     * @param event The event name.
     * @param listener The event listener function.
     */
    off(event, listener) {
        if (!event && listener)
            throw new Error("Why is there a listener defined here?");
        else if (!event && !listener)
            this._events_.clear();
        else if (event && !listener)
            this._events_.delete(event);
        else if (event && listener && this._events_.has(event)) {
            const _ = this._events_.get(event);
            _.delete(listener);
            if (_.size === 0)
                this._events_.delete(event);
        }
        else {
            throw new Error("Unknown action!");
        }
        return this;
    }
    /**
     * Emit an event without waiting for each listener to return.
     * @param event The event name to emit.
     * @param args The arguments to pass to the listeners.
     */
    emitSync(event, ...args) {
        if (!this._events_.has(event))
            return this;
        const _ = this._events_.get(event);
        for (let [, listener] of _.entries()) {
            const r = listener(...args);
            if (r instanceof Promise)
                r.catch(console.error);
            if (listener.__once__) {
                delete listener.__once__;
                _.delete(listener);
            }
        }
        if (_.size === 0)
            this._events_.delete(event);
        return this;
    }
    /**
     * Emit an event and wait for each listener to return.
     * @param event The event name to emit.
     * @param args The arguments to pass to the listeners.
     */
    async emit(event, ...args) {
        if (!this._events_.has(event))
            return this;
        const _ = this._events_.get(event);
        for (let [, listener] of _.entries()) {
            try {
                await listener(...args);
                if (listener.__once__) {
                    delete listener.__once__;
                    _.delete(listener);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        if (_.size === 0)
            this._events_.delete(event);
        return this;
    }
    /**
     * The same as emitSync, but wait for each listener to return
     * before calling the next listener.
     * @param event The event name.
     * @param args The arguments to pass to the listeners.
     */
    queue(event, ...args) {
        (async () => await this.emit(event, ...args))().catch(console.error);
        return this;
    }
}
exports.EventEmitter = EventEmitter;
exports.default = EventEmitter;
