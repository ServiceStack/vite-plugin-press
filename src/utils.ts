import fs from "fs"
import matter from "./frontmatter"
import { Options, Doc } from "./types"

export function leftPart(s:string, needle:string) {
    if (s == null) return null
    let pos = s.indexOf(needle)
    return pos == -1
        ? s
        : s.substring(0, pos)
}
export function rightPart(s:string, needle:string) {
    if (s == null) return null
    let pos = s.indexOf(needle)
    return pos == -1
        ? s
        : s.substring(pos + needle.length)
}
export function lastLeftPart(s:string, needle:string) {
    if (s == null) return null
    let pos = s.lastIndexOf(needle)
    return pos == -1
        ? s
        : s.substring(0, pos)
}
export function lastRightPart(s:string, needle:string) {
    if (s == null) return null
    let pos = s.lastIndexOf(needle)
    return pos == -1
        ? s
        : s.substring(pos + needle.length)
}
function padInt(n: number) { 
    return n < 10 ? '0' + n : n 
}
function dateFmt(d: Date = new Date()) { 
    return d.getFullYear() + '-' + padInt(d.getMonth() + 1) + '-' + padInt(d.getDate())  
}
function countWords(str:string) {
    const matches = str.match(/[\w\d\’\'-]+/gi);
    return matches ? matches.length : 0;
}
function countLines(str: string) {
    return (str.match(/\n/g) || '').length + 1
}
function minutesToRead(worlds:number) {
    return Math.round((worlds ?? 1) / 225)
}
export function generateSlug(str:string) {
    return str
        .normalize('NFKD') // normalize() with NFKD returns Unicode Normalization Form
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\_/g,'-')       // Replace _ with -
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/\-$/g, '');     // Remove trailing -
}

export function createDoc(filePath:string, _options: Options = {}):Doc {
    filePath = filePath.replaceAll('\\', '/')
    const file = lastRightPart(filePath, '/')!
    const txt = fs.readFileSync(filePath, 'utf-8')
    const { attributes:frontmatter, body:content } = matter(txt)
    if (!frontmatter.tags) frontmatter.tags = []
    if (frontmatter.date) {
        const parts = frontmatter.date.split('-')
        if (parts.length == 3 && parts[2].length == 4) {
            frontmatter.date = parts[2] + '-' + parts[1] + '-' + parts[0]
        }
    }

    const wordCount = countWords(content) 
    const doc = Object.assign({
        slug: generateSlug(leftPart(file, '.')!),
        path: filePath,
        fileName: file,
        content,
        date: dateFmt(new Date(fs.statSync(filePath).mtime)),
        tags: [],
        wordCount,
        lineCount: countLines(content),
        minutesToRead: minutesToRead(wordCount),
    }, frontmatter) 
    return doc
}

export function sortBy(o:any[], sorters:Function[]) {
    if (!o) return o
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

export const sortDocs = [
    (a:Doc, b:Doc) => (a.order ?? 0) - (b.order ?? 0),
    (a:Doc, b:Doc) => a.date > b.date ? -1 : a.date < b.date ? 1 : 0,
    (a:Doc, b:Doc) => a.fileName.localeCompare(b.fileName),
]
