<template>
  <component v-if="MarkdownComponent" :is="MarkdownComponent" :name="doc.slug" :frontmatter="{ nowrap:true }" />
  <div v-else v-html="doc.preview"></div>
</template>

<script setup lang="ts">
import { inject, defineAsyncComponent, h } from "vue"
import type { Doc } from "@/meta"

const props = defineProps<{
  doc: Doc
  type: string
  group?: string
}>()

const press = inject('press') as any
const components = press.components[props.type] || {}

const factory = (props.group
    ? components[props.group] && components[props.group][props.doc.slug]
    : components[props.doc.slug])

const MarkdownComponent = factory ? defineAsyncComponent(factory) : null
</script>
