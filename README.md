### Installation

- start python server
- cp .env.example .env
- yarn install
- yarn dev

### Stack

VueJS 3, Nuxt 3, Chakra UI (vue-next), TypeScript, Vercel

### Caveats

- `~/apps` doesn't export its components unless you add the directory (and all its children) to nuxt.config.ts. It's a Nuxt bug in `yarn dev`, it works normally if you run `yarn build && yarn dev`
- floating-vue doesn't work with chakra elements, but wrapping its slot children in a div works
- HMR doesn't work with chakra well, specifically CFlex and some chakra props, like `alignItems` and `justifyContent`, but adding & removing a `key="random"` props helps to trigger it
