---
title: Vite Press Plugin
summary: Introducing the Vite Press Plugin
author: Lucy Bates
tags: [docs, markdown]
image: https://images.unsplash.com/photo-1524668951403-d44b28200ce0?crop=entropy&fit=crop&h=1000&w=2000
---

The Vite Press Plugin is an alternative to [VitePress](https://vitepress.dev) for adding Markdown features 
to existing Vite Vue or React projects. It's a non-intrusive plugin for Vue and React Vite apps that want to 
add markdown powered content features without needing to adopt an opinionated framework for their entire App.

## Universal Markdown Features

A goal for **vite-press-plugin** is to implement a suite of universal markdown-powered features that can be
reused across all our Vue, React and .NET Razor and Blazor project templates, allowing you to freely copy and 
incorporate same set of markdown feature folders to power markdown content features across a range of 
websites built with different technologies.

### Vite Apps with vite-press-plugin

The **vite-press-plugin** currently powers the markdown features in the following Vite Vue and React templates:

#### Vite Templates with vite-press-plugin

 - [press-vue](https://press-vue.web-templates.io) - Vite Vue App
 - [press-react](https://press-react.web-templates.io) - Vite React App

#### .NET 8 API backend with Vite Vue & React SPA frontend

 - [vue-spa](https://vue-spa.web-templates.io) - .NET 8 API with Vite Vue SPA frontend
 - [react-spa](https://react-spa.web-templates.io) - .NET 8 API with Vite React SPA frontend

The **vite-press-plugin** makes the Markdown features available to the Vite App, whilst the markdown rendering itself is optimally
implemented in:

 - Vue Templates - with [markdown-it](https://github.com/markdown-it/markdown-it) in [Vue SFC](https://vuejs.org/guide/scaling-up/sfc.html) Components
 - React Templates - with [remark](https://github.com/remarkjs/remark) and [MDX](https://mdxjs.com) in [React](https://react.dev) Components

### .NET Templates with C# and Markdig

Whilst the same Markdown feature folders are [implemented in C#](https://razor-ssg.web-templates.io/posts/razor-ssg)
and rendered with [Markdig](https://github.com/xoofx/markdig) and either Razor Pages or Blazor Components:

#### .NET 8 Razor SSG and Blazor SSR Templates

 - [razor-ssg](https://razor-ssg.web-templates.io) - .NET Razor SSG Blog and Marketing Website with **Markdig**
 - [razor-press](https://razor-press.web-templates.io) - .NET Razor SSG Documentation Website with **Markdig**
 - [blazor-vue](https://blazor-vue.web-templates.io) - .NET 8 Blazor Server Rendered Website with **Markdig**

### Markdown Feature Folders

The content for each Markdown feature is maintained within its own feature folder with a `_` prefix:

<file-layout :files="{
    _includes: {},
    _posts: {},
    _videos: {},
    _whatsnew: {},
}"></file-layout>

### Blog

### What's New Feature

The [/whatsnew](/whatsnew) page is an example of creating a custom Markdown feature to implement a portfolio or a product releases page
where a new folder is created per release, containing both release date and release or project name, with all features in that release 
maintained markdown content sorted in alphabetical order:

<file-layout :files="{
  _whatsnew: {
    '2023-03-08_Animaginary': { _: ['feature1.md'] },
    '2023-03-18_OpenShuttle': { _: ['feature1.md'] },
    '2023-03-28_Planetaria':  { _: ['feature1.md'] },
  }
}"></file-layout>

What's New follows the same structure as Pages feature which is loaded in:

 - [whatsnew.vue](https://github.com/NetCoreTemplates/vue-spa/blob/main/MyApp.Client/src/pages/whatsnew.vue)
 - [whatsnew.tsx](https://github.com/NetCoreTemplates/react-spa/blob/main/MyApp.Client/src/pages/whatsnew.tsx)
 

and rendered in:
- [WhatsNew.cshtml](https://github.com/NetCoreTemplates/razor-ssg/blob/main/MyApp/Pages/WhatsNew.cshtml)


### Videos Feature

### Metadata APIs Feature

Typically a disadvantage of statically generated websites is the lack of having APIs we can call to query website data 
in a easily readable data format like JSON. However we can also easily support this by also pre-rendering static `*.json` 
data structures along with the pre-rendered website at deployment.

This capability is provided by the new [Markdown.Meta.cs](https://github.com/NetCoreTemplates/razor-ssg/blob/main/MyApp/Markdown.Meta.cs) 
feature which generates multiple projections of the Markdown metadata for each type of content added in every year, e.g:

<file-layout :files="{
  meta: {
    2022: { _: ['all.json','posts.json','videos.json'] },
    2023: { _: ['all.json','posts.json'] },
    2024: { _: ['all.json','pages.json','posts.json','videos.json','whatsnew.json'] },
    _: ['all.json','index.json']
  }
}" class="mb-8 cursor-pointer" v-on:click="nav('https://github.com/NetCoreTemplates/razor-ssg/tree/gh-pages/meta')"></file-layout>

With this you can fetch the metadata of all the new **Blog Posts** added in **2023** from:

[/2023/posts.json](https://razor-ssg.web-templates.io/meta/2023/posts.json)

Or all the website content added in **2023** from:

[/2023/all.json](https://razor-ssg.web-templates.io/meta/2023/all.json)

Or **ALL** the website metadata content from:

[/all.json](https://razor-ssg.web-templates.io/meta/all.json)

This feature makes it possible to support use-cases like CreatorKit's
[Generating Newsletters](https://servicestack.net/creatorkit/portal-mailruns#generating-newsletters) feature which generates 
a Monthly Newsletter Email with all new content added within a specified period.

### Includes Feature
