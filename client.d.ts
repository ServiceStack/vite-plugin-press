declare module 'virtual:press' {
    // eslint-disable-next-line
    const component: VirtualPress;
    export default component;
}

type component = any
type VideoGroups = { [key: string]: Video[] }
type Posts = { config: any, authors: Author[], posts: Post[], authorSlugs: { [name: string]: Author }, tagSlugs: { [name: string]: string } }
type VideoComponents = { [key: string]: { [group: string]: () => Promise<component> } }
type PostComponents = { [key: string]: () => Promise<component> }
type VirtualPress = {
    videos: VideoGroups
    posts: Posts
    components: {
        videos: VideoComponents
        posts: PostComponents
    }
}

type Doc = {
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

type Post = Doc & {
    summary: string
    author: string
    image: string
}

type Video = Doc & {
    url: string
}

type Author = {
    name: string
    email: string
    bio: string
    profileUrl: string
    twitterUrl: string
    threadsUrl: string
    gitHubUrl: string
    mastodonUrl: string
}
