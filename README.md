### Installation

- cp .env.example .env
- using yarn 1
  - yarn install
  - yarn dev

### Stack

VueJS 3, Nuxt 3, Chakra UI (vue-next), TypeScript, Vercel

### State

- most of `apps` aren't used and will be removed soon, hence the duplication and lack of consistency. Most of work is happening in `portfolios`.
- chakra-ui is still in beta, but the core layout & theming components are fine. A number of interactive elements are half-working, you can see the status on [their roadmap](https://www.notion.so/4517ba273ef3409d8e0e9ec3d121f6c1?v=ce00244a41b74b79b4d01ee4c3aa61ec), but beware that "Completed" doesn't mean pushed to NPM.

Todo:
- Split apps/ on nuxt `modules`, they're quite powerful and easy to use now. At the moment the transition is WIP, some components are modules already, others not yet.
  - for how to split `pages/` see [the example from docs](https://nuxt.com/docs/examples/advanced/module-extend-pages)
  - Simplify naming of components. With the `modules` feature there's no need to bother with the namespacing.
- Wrap more of Chakra components into `src/modules/formkit`, eg as `f-textarea.vue`.

### Caveats

- a number of chakra-ui components don't work in practice on vue-next, eg `CDrawer` and `CMenu`.
  That's why most of components in `src/apps/chakra/` are simple replacements.
  - A number of components have been fixed since I started this project so don't use apps/chakra for them anymore, specifically
    - `CTable`
    - `CCheckbox`
    - `CTabs`
    - `CTooltip`
    - `CModal`
      - in the latest `yarn.lock` you need to set `v-if="state.isOpen.value"` along with `v-model="state.isOpen.value"`. Perhaps because `emotion` doesn't like to render something without a node, and a node appears only after `nextTick()` call that adds the target nodes.
  - Packages we no longer need since they work in chakra now
    - `vue-final-modal`
    - `floating-vue` - ok to use for dropdowns, but not tooltips
- `~/apps` doesn't export its components unless you add the directory (and all its children) to `index.ts`. It's a
  Nuxt bug in `yarn dev`, it works normally if you run `yarn build && yarn dev`. But for now keep adding dirs & subdirs
  to `index.ts`.
- `floating-vue` doesn't work with chakra elements, but wrapping its slot children in a `div` works
- HMR doesn't work with two `CFlex` properties, specifically `align` and `justify`,
  but adding & removing a `key="1"` props helps to force-trigger it. Or use the full notation as `alignItems`
- files in `/public/` sometimes don't reload until you delete the `.nuxt` generated folder, a cache bug
