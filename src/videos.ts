import fs from "fs"
import path from "path"
import { createDoc, sortBy, sortDocs } from "./utils"
import type { Doc, Options, Video, VideoGroups } from "./types"

export function loadFrom(fromDir:string, options: Options = {}) {
    const groups:VideoGroups = {}

    if (!fs.existsSync(fromDir)) {
        return groups
    }
    
    const dirs = fs.readdirSync(fromDir).filter(x => fs.statSync(path.join(fromDir, x)).isDirectory())
    if (!options.quiet) {
        const count = dirs.reduce((acc,x) => acc + fs.readdirSync(path.join(fromDir, x)).filter(x => x.endsWith('.md') || x.endsWith('.mdx')).length, 0)
        const plural = count > 1 ? 's' : ''
        console.log(`Found ${dirs.length} Video Group${dirs.length > 1 ? 's' : ''} with ${count} Video${plural}`)
    }

    dirs.forEach(dir => {
        const group = dir
        fs.readdirSync(path.join(fromDir, dir)).filter(x => x.endsWith('.md') || x.endsWith('.mdx')).forEach(file => {
            const filePath = path.join(fromDir, dir, file)
            if (!groups[group]) groups[group] = []
            const doc = createDoc(filePath, options) as Video
            if (process.env.NODE_ENV != 'development' && doc.draft) {
                return
            }
            doc.group = group
            groups[group].push(doc)
        })

        sortBy(groups[group], sortDocs)
    })
    
    return groups
}

export function generateComponents(groups:VideoGroups) {
    return [
    `{`,
    ...Object.keys(groups).flatMap(group => [
    `   "${group}": {`,
    ...groups[group].map((doc:any) => `         "${doc.slug}": () => import('/${doc.path}'),`),
    `   },`]),
    `}`,
    ].map(line => `            ${line}`).join('\n')
}
