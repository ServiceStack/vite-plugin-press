import fs from 'fs'
import path from 'path'
import { lastLeftPart, createDoc } from "./utils"
import { Options, Doc, Includes } from "./types"

export function loadFrom(fromDir:string, options: Options = {}): Includes {
    const includes: Doc[] = []

    const fromDirExists = fs.existsSync(fromDir)

    const files = fromDirExists 
        ? fs.readdirSync(fromDir, { recursive:true })
            .filter(x => typeof x == 'string' && fs.statSync(path.join(fromDir, x)).isFile() && (x.endsWith('.md') || x.endsWith('.mdx'))) as string[]
        : []

    if (!fromDirExists) {
        return { includes }
    }
    
    if (!options.quiet) {
        const plural = files.length > 1 ? 's' : ''
        console.log(`Found ${files.length} Include${plural}`)
    }

    files.forEach(file => {
        const filePath = path.join(fromDir, file)
        const doc = createDoc(filePath, options)
        if (!doc) return
        doc.slug = lastLeftPart(doc.fileName, '.')!
        doc.group = file.replaceAll('\\','/').substring(0, file.length - doc.fileName.length - 1)
        if (process.env.NODE_ENV != 'development' && doc.draft) {
            return
        }
        includes.push(doc)
    })

    return { includes }
}

export function generateComponents({ includes }:Includes) {
    return [
        `{`,
        ...includes.map((doc:any) => `"${doc.group ? doc.group + '/' + doc.fileName : doc.fileName}": () => import('/${doc.path}'),`),
        `}`,
    ].map(line => `                ${line}`).join('\n')
}
