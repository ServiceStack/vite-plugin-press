import type { Doc } from "../../../../src/types"
import React, { lazy, Suspense, useState, ReactNode, MouseEvent } from 'react'
import { PressContext } from "@/contexts"
import { cn } from "@/utils"

function Include({ src }:{ src:string}) {
    const press = React.useContext(PressContext)
    const factory = (press.components as any).includes[src]
    const Component = lazy(factory ? factory : () => Promise.resolve(<></>))
    return factory
        ? <Suspense fallback={<></>}><Component components={Components} /></Suspense>
        : <div className="text-red-500">Include '{src}' not found</div>
}

type AlertProps = {
    className?: string
    title?: string
    children?: ReactNode
}
function Alert({ className, title, children }:AlertProps) {
    return (
        <div className={cn(className, 'custom-block')}>
            <p className="custom-block-title">{title}</p>
            {children}
        </div>
    )
}

type CopyLineProps = {
    className?: string
    box?: string
    txt?: string
    icon?: string
    children?: ReactNode
}
function CopyLine({ className, icon, box, txt, children }: CopyLineProps) {
    let [copyClass, setCopyClass] = useState("")

    function copy(e: MouseEvent) {
        const div = e.currentTarget as HTMLDivElement
        setCopyClass('copying')
        let $el = document.createElement("textarea")
        let text = (div.querySelector('code') || div.querySelector('p'))?.innerHTML ?? ''
        $el.innerHTML = text
        document.body.appendChild($el)
        $el.select()
        document.execCommand("copy")
        document.body.removeChild($el)
        setTimeout(() => setCopyClass(''), 3000)
    }

    return (
        <div className={cn(className, copyClass, `flex cursor-pointer mb-3`)} onClick={copy}>
            <div className={cn('flex-grow', box || 'bg-gray-700')}>
                <div className={cn(`pl-4 py-1 pb-1.5 align-middle`, txt||'text-lg text-white')}>
                    {children}
                </div>
            </div>
            <div className="flex">
                <div className={cn(icon,`text-white p-1.5 pb-0`)}>
                    <svg className="copied w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <svg className="nocopy w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <title>copy</title>
                        <path strokeLinecap='round' strokeLinejoin="round" strokeWidth="1" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                    </svg>
                </div>
            </div>
        </div>
    )
}

const Components:{[name:string]:JSX.Element|Function} = {
    Include,
    Alert:   Alert,
    Tip:     ({ className, ...remaining}:AlertProps) => <Alert title="TIP" className={cn('tip',className)} {...remaining} />,
    Info:    ({ className, ...remaining}:AlertProps) => <Alert title="INFO" className={cn('info',className)} {...remaining} />,
    Warning: ({ className, ...remaining}:AlertProps) => <Alert title="WARNING" className={cn('warning',className)} {...remaining} />,
    Danger:  ({ className, ...remaining}:AlertProps) => <Alert title="DANGER" className={cn('danger',className)} {...remaining} />,
    Copy:    ({ className, ...remaining }:CopyLineProps) => <CopyLine className={cn('not-prose copy cp',className)} icon="bg-sky-500" {...remaining} />,
    Sh:      ({ className, ...remaining }:CopyLineProps) => <CopyLine className={cn('not-prose sh-copy cp',className)} 
                box="bg-gray-800" icon="bg-green-600" txt="whitespace-pre text-base text-gray-100" {...remaining} />,
}

// .md uses :::info::: and .mdx uses <Info />
function kebabCase(s: string) { return (s || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() }
Object.keys(Components).forEach(k => Components[kebabCase(k)] = Components[k])

type Props = {
    doc: Doc
    type: string
    group?: string
}
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