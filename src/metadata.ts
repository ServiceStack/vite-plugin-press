import fs from 'fs'
import path from 'path'
import { Doc, Blog, VideoGroups, WhatsNewReleases } from "./types"

const defaultExportProps = ['slug', 'title', 'summary', 'fileName', 'date', 'tags', 'author', 'image', 'wordCount', 'lineCount', 'url', 'group', 'order']
function pick(o:any, keys:string[]) {
    const to:any = {}
    for (const k in o) {
        if (o.hasOwnProperty(k) && keys.indexOf(k) >= 0) {
            to[k] = o[k]
        }
    }
    return to
}

function sortBy(o:any[], sorters:Function[]) {
    o.sort((a:any, b:any) => {
        for (let i=0;i<sorters.length;i++) {
            const fn = sorters[i]
            const result = fn(a, b)
            if (result != 0) return result
        }
        return 0
    })
    return o
}

const exportDoc = (data:Doc, exportProps:string[]):Doc => pick(data, exportProps)

const Data:{[name:string]:(data:any) => Doc[]} = {
    blog(blog:Blog) {
        const { posts } = blog
        return posts.map((x:Doc) => {
            (x as any).url = `/posts/${x.slug}`
            return x
        })
    },
    videos(videos:VideoGroups) {
        return Object.values(videos).flatMap((x:Doc[]) => x.map((x:Doc) => {
            return x
        }))
    },
    whatsNew(whatsNew:WhatsNewReleases) {
        return Object.values(whatsNew).flatMap((x:Doc[]) => x.map((x:Doc) => {
            return x
        }))
    },
}

type MetadataOptions = {
    toDir: string
    baseUrl?: string
    exportProps?: string[]
}

export function generateMetadata(data:any, options:MetadataOptions) {
    const { toDir, baseUrl } = options
    const exportProps = options.exportProps ?? defaultExportProps
    if (!toDir) {
        console.error('toDir is required', options)
        return
    }
    fs.rmSync(toDir, { recursive: true, force: true })
    fs.mkdirSync(toDir, { recursive: true })

    const featureDocs:{[feature:string]:Doc[]} = {}
    const allYears = new Set()
    const index:{[feature:string]:string[]} = {}

    Object.keys(data).forEach(key => {
        const fn = Data[key]
        if (!fn) return
        const allDocs = sortBy(fn(data[key]).map(x => exportDoc(x, exportProps)), [
            (a:Doc, b:Doc) => a.date > b.date ? -1 : a.date < b.date ? 1 : 0,
            (a:Doc, b:Doc) => (a.order ?? 0) - (b.order ?? 0),
            (a:Doc, b:Doc) => a.fileName.localeCompare(b.fileName),
        ]) as Doc[]
        
        if (baseUrl) {
            let urlPrefix = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl
            allDocs.forEach((doc:Doc) => {
                if ((doc as any).url?.startsWith('/'))
                    (doc as any).url = urlPrefix + (doc as any).url
                if ((doc as any).image?.startsWith('/'))
                    (doc as any).image = urlPrefix + (doc as any).image
            })
        }

        featureDocs[key] = allDocs
        const featureYears = new Set(allDocs.filter(x => x.date).map((x:Doc) => new Date(x.date).getFullYear()))
        featureYears.forEach(year => allYears.add(year))

        index[key] = Array.from(featureYears).map(year => (baseUrl ?? '') + `/meta/${year}/${key}.json`)

        featureYears.forEach(year => {
            const yearDocs = allDocs.filter((x:Doc) => x.date && new Date(x.date).getFullYear() == year)
            const yearDir = path.join(toDir, `${year}`)
            fs.mkdirSync(yearDir, { recursive: true })
            const metaPath = path.join(yearDir, `${key}.json`)
            fs.writeFileSync(metaPath, JSON.stringify(yearDocs, undefined, 4))
        })

        fs.writeFileSync(path.join(toDir,'index.json'), JSON.stringify(index, undefined, 4))

        fs.writeFileSync(path.join(toDir,'all.json'), JSON.stringify(featureDocs, undefined, 4))

        const sortedYears = Array.from(allYears) as number[]
        sortedYears.sort((a:number,b:number) => b - a)

        sortedYears.forEach(year => {
            const yearDocs:{[feature:string]:Doc[]} = {}
            Object.entries(featureDocs).forEach(([feature, docs]) => {
                yearDocs[feature] = docs.filter((x:Doc) => x.date && new Date(x.date).getFullYear() == year)
            })
            const yearDir = path.join(toDir,`${year}`)
            fs.mkdirSync(yearDir, { recursive: true })
            fs.writeFileSync(path.join(yearDir,`all.json`), JSON.stringify(yearDocs, undefined, 4))
        })
    })
}
