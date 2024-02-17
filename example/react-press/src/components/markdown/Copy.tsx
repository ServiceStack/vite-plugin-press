import { MouseEvent, useState } from "react"
import { cn } from "@/utils"

type Props = {
    className?: string
    box?: string
    txt?: string
    icon?: string
    children?: React.ReactNode
}
function Copy({ className, icon, box, txt, children }: Props) {
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

export default {
    Copy: ({ className, ...remaining }:Props) => <Copy className={cn('not-prose copy cp',className)} icon="bg-sky-500" {...remaining} />,
    Sh: ({ className, ...remaining }:Props) => <Copy className={cn('not-prose sh-copy cp',className)} 
           box="bg-gray-800" icon="bg-green-600" txt="whitespace-pre text-base text-gray-100" {...remaining} />,
}
