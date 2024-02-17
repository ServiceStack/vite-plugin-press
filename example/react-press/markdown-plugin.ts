import { h } from 'hastscript'
import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { Directives } from 'mdast-util-directive'
import type { Node } from 'unist'

const isDirectiveNode = (node: Node): node is Directives => {
    const { type } = node;
    return type === 'textDirective' || type === 'leafDirective' || type === 'containerDirective';
}

function cn(...args: any[]): string {
    const classes = []
    for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        if (!arg) continue
        const argType = typeof arg
        if (argType === 'string' || argType === 'number') {
            classes.push(arg)
        } else if (Array.isArray(arg) && arg.length) {
            const inner = cn.apply(null, arg)
            if (inner) {
                classes.push(inner)
            }
        } else if (argType === 'object') {
            for (let key of Object.keys(arg)) {
                if (arg[key]) {
                    classes.push(key)
                }
            }
        }
    }
    return classes.join(' ')
}

function alert({ title, cls }: any) {
    return function (node: Node) {
        const data: any = node.data || (node.data = {})
        const tagName = node.type === 'textDirective' ? 'span' : 'div'
        const children = (node as any).children[0]
        data.hName = tagName
        data.hProperties = Object.assign({}, data.hProperties, { className: cn(cls || 'tip', (node as any).attributes?.class, 'custom-block') })
        data.hChildren = [{
            type: "element",
            tagName: "p",
            properties: {
                className: "custom-block-title",
            },
            children: [
                h('p', { className: 'custom-block-title' }, title || 'TIP'),
            ],
        },
        h('p', {}, children.children[0])
        ] as any
    }
}

function copy({ cls, box, icon, txt }: any) {
    return function (node: Node) {
        const data: any = node.data || (node.data = {})
        data.hName = 'copy'
        data.hProperties = Object.assign({}, data.hProperties, {
            className: cn(cls || '', (node as any).attributes?.class),
            box,
            icon,
            txt,
        })
    }    
}

const containerDirectives: { [name: string]: any } = {
    // tip: alert({}),
    // info: alert({ title: 'INFO', cls: 'info' }),
    // warning: alert({ title: 'WARNING', cls: 'warning' }),
    // danger: alert({ title: 'DANGER', cls: 'danger' }),
    // copy: copy({ cls: 'not-prose copy cp', icon: 'bg-sky-500' }),
    // sh: copy({ cls: 'not-prose sh-copy cp', box: 'bg-gray-800', icon: 'bg-green-600', txt: 'whitespace-pre text-base text-gray-100' }),
    // dynamic: 'dynamic',
}

export function myRemarkPlugin() {
    return function (tree: Root) {
        visit(tree, (node: Node): any => {
            if (isDirectiveNode(node)) {
                const data = node.data || (node.data = {})
                // const { properties } = h(node.name, node.attributes || {}) as any
                // console.log('node', node.name, node.type, node.attributes, (node.children[0] as any).children, Object.keys(node))

                const fn = containerDirectives[node.name]
                if (fn) {
                    fn(node)
                    return
                }

                // const children = (node as any).children[0]
                //const tagName = node.type === 'textDirective' ? 'span' : 'div'
                data.hName = node.name
                data.hProperties = Object.assign({}, data.hProperties, { className: cn((node as any).attributes?.class) })
            }
            return node
        })
    }
}
