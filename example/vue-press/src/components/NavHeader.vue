<template>
  <header class="border-b border-gray-200 dark:border-gray-800 pr-3">
    <div class="flex flex-wrap items-center">
      <div class="absolute z-10 top-2 left-2 sm:static flex-shrink flex-grow-0">
        <div class="cursor-pointer">
          <RouterLink to="/" class="navbar-brand flex items-center">
            <Logo class="w-8 h-8 sm:ml-2 sm:w-12 sm:h-12" alt="MyApp logo" />
            <span class="hidden ml-2 sm:block text-2xl font-semibold">My App</span>
          </RouterLink>
        </div>
      </div>
      <div class="flex flex-grow flex-shrink flex-nowrap justify-end items-center">
        <nav class="relative flex flex-grow leading-6 font-semibold text-slate-700 dark:text-slate-200">
          <ul class="flex flex-wrap items-center justify-end w-full m-0">

            <li class="relative flex flex-wrap just-fu-start m-0">
              <RouterLink to="/counter" class="p-4 flex items-center justify-start mw-full hover:text-sky-500 dark:hover:text-sky-400" ActiveClass="text-blue-700 dark:text-blue-300">Counter</RouterLink>
            </li>
            <li class="relative flex flex-wrap just-fu-start m-0">
              <RouterLink to="/whatsnew" class="p-4 flex items-center justify-start mw-full hover:text-sky-500 dark:hover:text-sky-400" ActiveClass="text-blue-700 dark:text-blue-300">What's New</RouterLink>
            </li>
            <li class="relative flex flex-wrap just-fu-start m-0">
              <RouterLink to="/blog" class="p-4 flex items-center justify-start mw-full hover:text-sky-500 dark:hover:text-sky-400" ActiveClass="text-blue-700 dark:text-blue-300">Blog</RouterLink>
            </li>
            <li class="relative flex flex-wrap just-fu-start m-0">
              <RouterLink to="/videos" class="p-4 flex items-center justify-start mw-full hover:text-sky-500 dark:hover:text-sky-400" ActiveClass="text-blue-700 dark:text-blue-300">Videos</RouterLink>
            </li>
            <template v-if="hasRole('Admin')">
              <li class="relative flex flex-wrap just-fu-start m-0">
                <RouterLink to="/admin/" class="p-4 flex items-center justify-start mw-full hover:text-sky-500 dark:hover:text-sky-400" ActiveClass="text-blue-700 dark:text-blue-300">Admin</RouterLink>
              </li>
            </template>
            <li class="relative flex flex-wrap just-fu-start m-0">
              <DarkModeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
  
</template>

<script setup lang="ts">
import Logo from "@/assets/img/logo.svg"
import { useAuth } from "@servicestack/vue"
const { user, hasRole } = useAuth()

import { signout } from "@/auth"
</script>
