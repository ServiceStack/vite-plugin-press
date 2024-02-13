import { fileURLToPath, URL } from 'node:url'

import fs from 'fs'
import path from 'path'
import child_process from 'child_process'
import { env } from 'process'

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Press, { matter } from "../../src"
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Layouts from 'vite-plugin-vue-layouts'
import Markdown from 'unplugin-vue-markdown/vite'
import svgLoader from 'vite-svg-loader'
import MarkdownIt from "markdown-it"
import container from "markdown-it-container"
import prism from "markdown-it-prism"

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg!.groups!.value : "myapp.client";

if (!certificateName) {
    console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
    process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:5001';

export function configureMarkdown(md:MarkdownIt) {
    function copy({cls,box,icon,txt}:any) {
        return ({
            render(tokens:any, idx:any) {
                const token = tokens[idx]
                if (token.nesting === 1) {
                    return `<div class="${cls} flex cursor-pointer mb-3" onclick="copy(this)">
            <div class="flex-grow ${box||'bg-gray-700'}">
                <div class="pl-4 py-1 pb-1.5 align-middle ${txt||'text-lg text-white'}">`
                } else {
                    return `</div>
            </div>
            <div class="flex">
                <div class="${icon} text-white p-1.5 pb-0">
                    <svg class="copied w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <svg class="nocopy w-6 h-6" title="copy" fill='none' stroke='white' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2'></path>
                    </svg>
                </div>
            </div>
        </div>\n`
                }
            }
        })
    }
    md.linkify.set({ fuzzyLink: false })
    md.use(prism)
    md.use(container, 'copy', copy({cls:'not-prose copy cp', icon:'bg-sky-500'}))
    md.use(container, 'sh', copy({cls:'not-prose sh-copy cp', box:'bg-gray-800', icon:'bg-green-600', txt:'whitespace-pre text-base text-gray-100'}))
    return md
}

// https://vitejs.dev/config/
export default defineConfig({
    define: { API_URL: `"${target}"` },
    plugins: [
        // https://github.com/posva/unplugin-vue-router
        VueRouter({
            extensions: ['.vue', '.md'],
            dts: 'src/typed-router.d.ts',
            extendRoute(route:any) { 
                const filePath = route.node.value.components?.get('default')
                if (filePath && filePath.endsWith('.md')) {
                    const md = fs.readFileSync(filePath, 'utf-8')
                    const { attributes:frontmatter } = matter(md)
                    const pos = filePath.indexOf('/src/pages/')
                    const crumbs =  filePath.substring(pos + '/src/pages/'.length).split('/').slice(0,-1)
                        .map((name:string) => ({ name, href:`/${name}` }))
                    route.meta = Object.assign(route.meta || {}, { crumbs, frontmatter })
                }
            }
        }),
        Vue({
            include: [/\.vue$/, /\.md$/],
        }),
        Press({
          videosPath: '../content/_videos',
          postsPath: '../content/_posts',
        }),
        Layouts(),
        svgLoader(),

        // https://github.com/antfu/unplugin-auto-import
        AutoImport({
            imports: [
                'vue',
                '@vueuse/core',
                VueRouterAutoImports,
                {
                    // add any other imports you were relying on
                    'vue-router/auto': ['useLink'],
                },
            ],
            dts: true,
            dirs: [
                './src/composables',
            ],
            vueTemplate: true,
        }),

        // https://github.com/unplugin/unplugin-vue-markdown
        Markdown({
            // default options passed to markdown-it
            // see: https://markdown-it.github.io/markdown-it/
            markdownItOptions: {
                html: true,
                linkify: true,
                typographer: true,
            },
            wrapperComponent: 'MarkdownPage',
            headEnabled: true,
            markdownItSetup(md:any) {
                configureMarkdown(md)
            },            
        }),

        // https://github.com/antfu/vite-plugin-components
        Components({
            // allow auto load markdown components under `./src/components/`
            extensions: ['vue', 'md'],

            // allow auto import and register components used in markdown
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

            dts: 'src/components.d.ts',
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/api': {
                target,
                secure: false
            }
        },
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})