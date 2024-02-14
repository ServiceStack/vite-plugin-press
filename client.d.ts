declare module 'virtual:press' {
    // eslint-disable-next-line
    const M: VirtualPress

    export type Component = any
    export type Blog = { config: any, authors: Author[], posts: Post[], authorSlugs: { [name: string]: Author }, tagSlugs: { [name: string]: string } }
    export type VideoGroups = { [group: string]: Video[] }
    export type WhatsNewReleases = { [release: string]: WhatsNew[] }
    export type PostComponents = { [slug: string]: () => Promise<Component> }
    export type VideoComponents = { [group: string]: { [slug: string]: () => Promise<Component> } }
    export type WhatsNewComponents = { [release: string]: { [slug: string]: () => Promise<Component> } }
    export type VirtualPress = {
        blog: Blog
        videos: VideoGroups
        whatsNew: WhatsNewReleases
        components: {
            blog: PostComponents
            videos: VideoComponents
            whatsNew: WhatsNewComponents
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
            
    export default M
}
