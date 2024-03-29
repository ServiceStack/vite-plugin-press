import fs from "fs"
import path from "path"
import { createDoc, leftPart, rightPart, sortBy, sortDocs } from "./utils"
import { Options, WhatsNew, WhatsNewReleases } from "./types"

export function loadFrom(fromDir:string, options: Options = {}) {
    const releases:WhatsNewReleases = {}

    if (!fs.existsSync(fromDir)) {
        return releases
    }
    
    const dirs = fs.readdirSync(fromDir).filter(x => fs.statSync(path.join(fromDir, x)).isDirectory())
    if (!options.quiet) {
        const count = dirs.reduce((acc,x) => acc + fs.readdirSync(path.join(fromDir, x)).filter(x => x.endsWith('.md') || x.endsWith('.mdx')).length, 0)
        const plural = count > 1 ? 's' : ''
        console.log(`Found ${dirs.length} What's New Release${dirs.length > 1 ? 's' : ''} with ${count} Feature${plural}`)
    }

    dirs.reverse()
    dirs.forEach(dir => {
        const release = dir
        const datePart = leftPart(release, '_')
        let releaseDate = ''
        let err:any = 'No Date'
        
        try {
            if (datePart) {
                new Date(datePart!)
                releaseDate = datePart!
            }
        } catch (e) {
            err = e
        }
        
        if (!releaseDate)
            throw new Error(`Invalid date '${datePart}' in What's New Release: ${release}: ${err}`)

        const releaseVersion = rightPart(release, '_')!

        fs.readdirSync(path.join(fromDir, dir)).filter(x => x.endsWith('.md') || x.endsWith('.mdx')).forEach(file => {
            const filePath = path.join(fromDir, dir, file)
            if (!releases[release]) releases[release] = []
            const doc = createDoc(filePath, options) as WhatsNew
            if (process.env.NODE_ENV != 'development' && doc.draft) {
                return
            }

            doc.date = releaseDate
            doc.group = releaseVersion

            const features = releases[release] ?? (releases[release] = [])
            features.push(doc)
        })
        sortBy(releases[release], sortDocs)
    })
    
    return releases
}

export function generateComponents(releases:WhatsNewReleases) {
    return [
    `{`,
    ...Object.keys(releases).flatMap(release => [
    `   "${release}": {`,
    ...releases[release].map((doc:WhatsNew) => `         "${doc.slug}": () => import('/${doc.path}'),`),
    `   },`]),
    `}`,
    ].map(line => `            ${line}`).join('\n')
}
