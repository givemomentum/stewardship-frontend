### Installation

- cp .env.example .env
- using yarn 1
  - yarn install
  - yarn dev

### Stack

VueJS 3, Nuxt 3, Chakra UI (vue-next), TypeScript, Vercel

### Caveats

- a number of chakra-ui components don't work in practice on vue-next, eg `CModal` and `CDrawer`.
  That's why most of components in `src/apps/chakra/` are simple replacements. `CTable` and `CCheckbox` have been fixed recently though.
- `~/apps` doesn't export its components unless you add the directory (and all its children) to `nuxt.config.ts`. It's a
  Nuxt bug in `yarn dev`, it works normally if you run `yarn build && yarn dev`. But for now keep adding dirs & subdirs
  to `nuxt.config.ts`.
- `floating-vue` doesn't work with chakra elements, but wrapping its slot children in a `div` works
- HMR doesn't work with chakra well, specifically `CFlex` and some chakra props, like `alignItems` and `justifyContent`,
  but adding & removing a `key="1"` props helps to force-trigger it
- files in `/public/` sometimes don't reload until you delete the `.nuxt` generated folder, a cache bug

### todo

- move chakra/ into shared/
