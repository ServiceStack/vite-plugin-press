/// <reference types="vite/client" />

declare module 'js-yaml' {
    export function load(str: string, options?:any): any
    export function safeLoad(str: string, options?:any): any
}
