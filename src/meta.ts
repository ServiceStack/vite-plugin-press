import fs from 'fs'
import path from 'path'
import { Options, Post, Author, Blog } from "./types"

export function generateMetadata(toDir:string, data:any) {
    if (fs.existsSync(toDir)) {
        fs.rmdirSync(toDir, { recursive: true })
    }
    fs.mkdirSync(toDir, { recursive: true })
}
