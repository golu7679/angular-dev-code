import { InjectionToken } from '@angular/core';

export const SSR_REQUEST = new InjectionToken<any>('SSR_REQUEST');

const globalAny = typeof global !== 'undefined' ? (global as any) : (typeof globalThis !== 'undefined' ? (globalThis as any) : {});

if (!globalAny.ssrRequestStorage) {
    // Default dummy implementation
    globalAny.ssrRequestStorage = {
        getStore: () => null,
        run: (store: any, callback: () => void) => callback()
    };
    
    // Async load for SSR, protected by node environment check
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        import('node:async_hooks').then(hooks => {
            globalAny.ssrRequestStorage = new hooks.AsyncLocalStorage();
        }).catch(e => console.error('Failed to load async_hooks', e));
    }
}

export const ssrRequestStorage = {
    getStore: () => globalAny.ssrRequestStorage.getStore(),
    run: (store: any, cb: () => void) => globalAny.ssrRequestStorage.run(store, cb)
};
