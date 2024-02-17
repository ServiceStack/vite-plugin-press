import type { Plugin } from 'vite'

export interface Options {
    /**
     * Whether to suppress Vite's build output
     * @default false
     */
    quiet?: boolean

    /**
     * Where to look for videos
     * @default './src/_videos'
     */
    videosPath?: string

    /**
     * Where to look for posts
     * @default './src/_posts'
     */
    postsPath?: string

    /**
     * Where to look for What's New Features
     * @default './src/_whatsnew'
     */
    whatsNewPath?: string

    /**
     * Where to look for Includes
     * @default './src/_includes'
     */
    includesPath?: string

    /**
     * Where to publish json metadata
     */
    metadataPath?: string

    /**
     * Fallback Author profile url
     */
    fallbackAuthorProfileUrl?: string

    /**
     * Fallback post image URL
     * @default "https://source.unsplash.com/random/2000x1000/?stationary"
     */
    fallbackPostImageUrl?: string
}

export interface VitePluginPressPlugin extends Plugin {
    api: {
        options: Options
    }
}

export type Component = any
export type Blog = { config: any, authors: Author[], posts: Post[], authorSlugs: { [name: string]: Author }, tagSlugs: { [name: string]: string } }
export type VideoGroups = { [group: string]: Video[] }
export type WhatsNewReleases = { [release: string]: WhatsNew[] }
export type Includes = { includes: Doc[] }
export type PostComponents = { [slug: string]: () => Promise<Component> }
export type VideoComponents = { [group: string]: { [slug: string]: () => Promise<Component> } }
export type WhatsNewComponents = { [release: string]: { [slug: string]: () => Promise<Component> } }
export type IncludesComponents = { [path: string]: () => Promise<Component> }
export type VirtualPress = {
    blog: Blog
    videos: VideoGroups
    whatsNew: WhatsNewReleases
    includes: Includes
    components: {
        blog: PostComponents
        videos: VideoComponents
        whatsNew: WhatsNewComponents
        includes: IncludesComponents
    }
}

export type Doc = {
    title: string
    slug: string
    path: string
    fileName: string
    content: string
    preview: string
    date: string
    tags: string[]
    wordCount: number
    lineCount: number
    minutesToRead: number
    order?: number
    draft?: boolean
    group?: string
}

export type Post = Doc & {
    summary: string
    author: string
    image: string
}

export type Video = Doc & {
    url: string
}

export type WhatsNew = Doc & {
    url: string
    image: string
}

export type Author = {
    name: string
    email: string
    bio: string
    profileUrl: string
    twitterUrl: string
    threadsUrl: string
    gitHubUrl: string
    mastodonUrl: string
}
