/// <reference types="vite/client" />
/// <reference types="vite-plugin-vue-layouts/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.md' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'js-yaml' {
  export function load(str: string, options?:any): any
}

declare module 'virtual:press' {
  // eslint-disable-next-line
  const component: any;
  export default component;
}
