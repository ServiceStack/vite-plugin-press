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
