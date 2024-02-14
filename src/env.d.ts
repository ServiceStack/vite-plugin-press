/// <reference types="vite/client" />

declare module 'js-yaml' {
    export function load(str: string, options?:any): any
}
