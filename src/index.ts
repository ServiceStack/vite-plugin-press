import * as markdownBlog from './blog'
import * as markdownVideos from './videos'
import * as markdownWhatsNew from './whatsnew'
import * as markdownIncludes from './includes'
import * as markdownMetadata from './metadata'
import matter from './frontmatter'
import { Options, VitePluginPressPlugin, VirtualPress, 
         Blog, VideoGroups, WhatsNewReleases, Doc, Post, Video, WhatsNew, Author } from "./types.d"

const videosPath = './src/_videos'
const postsPath = './src/_posts'
const whatsNewPath = './src/_whatsnew'
const includesPath = './src/_includes'
const fallbackAuthorProfileUrl:string = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4'/%3E%3C/svg%3E"
const fallbackPostImageUrl:string = "https://source.unsplash.com/random/2000x1000/?stationary"

/**
 * Static markdown content for creating blogs, videos and other content
 * https://github.com/ServiceStack/vite-plugin-press
 * @param { Options } options
 */
export default function(options:Options={}): VitePluginPressPlugin {
    options = Object.assign({ fallbackAuthorProfileUrl, fallbackPostImageUrl, videosPath, postsPath, whatsNewPath, includesPath }, options)

    const virtualModuleId = 'virtual:press'
    const resolvedVirtualModuleId = '\0' + virtualModuleId
    
    return {
        name: 'press-plugin', // required, will show up in warnings and errors
        enforce: 'pre',
        resolveId(id:string) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },
        load(id:string) {
            if (id === resolvedVirtualModuleId) {
                const blog = markdownBlog.loadFrom(options.postsPath!)
                const videos = markdownVideos.loadFrom(options.videosPath!)
                const whatsNew = markdownWhatsNew.loadFrom(options.whatsNewPath!)
                const includes = markdownIncludes.loadFrom(options.includesPath!)
                if (options.metadataPath) {
                    markdownMetadata.generateMetadata({ blog, videos, whatsNew }, 
                        { toDir:options.metadataPath, baseUrl:options.baseUrl })
                }

                const blogComponents = markdownBlog.generateComponents(blog)
                const videoComponents = markdownVideos.generateComponents(videos)
                const whatsNewComponents = markdownWhatsNew.generateComponents(whatsNew)
                const includesComponents = markdownIncludes.generateComponents(includes)
                
                const sb = [`export default {`,
                `    blog: ${JSON.stringify(blog)},`,
                `    videos: ${JSON.stringify(videos)},`,
                `    whatsNew: ${JSON.stringify(whatsNew)},`,
                `    components: {`, 
                `        blog:`,
                blogComponents + ',',
                `        videos:`,
                videoComponents + ',',
                `        whatsNew:`,
                whatsNewComponents + ',',
                `        includes:`,
                includesComponents + ',',
                `       }`,
                '}'].join('\n')
                return sb
            }
        },
        api: {
            options: options
        }
    }
}

export { matter }
export type { VirtualPress, Blog, VideoGroups, WhatsNewReleases, Doc, Post, Video, WhatsNew, Author }