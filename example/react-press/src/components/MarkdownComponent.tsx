import type { Doc } from "../../../../src/types"
import React, { lazy, Suspense } from 'react'
import { PressContext } from "@/contexts"
import CopyComponents from "@/components/markdown/Copy"
import AlertComponents from "@/components/markdown/Alerts"

type Props = {
    doc: Doc
    type: string
    group?: string
}

function Include({ src }:{ src:string}) {
    const press = React.useContext(PressContext)
    const factory = (press.components as any).includes[src]
    const Component = lazy(factory ? factory : () => Promise.resolve(<></>))
    return <Suspense fallback={<></>}><Component components={Components} /></Suspense>
}

const Components:{[name:string]:JSX.Element|Function} = {
    ...CopyComponents,
    ...AlertComponents,
    Include,
}

// .md uses :::info::: and .mdx uses <Info />
function kebabCase(s: string) { return (s || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() }
Object.keys(Components).forEach(k => Components[kebabCase(k)] = Components[k])

export default ({ doc, type, group }: Props): JSX.Element => {
    const press = React.useContext(PressContext)

    const components = (press.components as any)[type] || {}

    const factory = (group
        ? components[group] && components[group][doc.slug]
        : components[doc.slug])

    const Component = lazy(factory ? factory : () => Promise.resolve(<></>))

    return (factory
        ? (<Suspense fallback={<></>}><Component components={Components} /></Suspense>)
        : doc.preview
            ? <div dangerouslySetInnerHTML={{ __html: doc.preview }}></div>
            : <pre dangerouslySetInnerHTML={{ __html: doc.content }}></pre>)
}