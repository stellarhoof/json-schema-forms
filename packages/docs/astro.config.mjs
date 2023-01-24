import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import expressiveCode from "astro-expressive-code"

// https://astro.build/config
export default defineConfig({
  integrations: [
    expressiveCode({
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes
      theme: "material-theme-palenight",
    }),
    starlight({
      title: "My Docs",
      customCss: [
        "@fontsource/ibm-plex-mono/400.css",
        "@fontsource/ibm-plex-mono/600.css",
        "@fontsource-variable/lora",
        "@fontsource-variable/lora/wght-italic.css",
        "./src/styles/custom.css",
      ],
      social: {
        github: "https://github.com/withastro/starlight",
      },
      sidebar: [
        {
          label: "Tutorial",
          items: [
            {
              label: "Example Tutorial",
              link: "/tutorials/example/",
            },
          ],
        },
        {
          label: "Guides",
          items: [
            {
              label: "Example Guide",
              link: "/guides/example/",
            },
          ],
        },
        {
          label: "Reference",
          autogenerate: {
            directory: "reference",
          },
        },
      ],
    }),
  ],
  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
})
