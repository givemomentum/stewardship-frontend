<template>
  <CFlex class="chakra-radio">
    <chakra.input
      type="radio"
      class="chakra-radio__input"
    />
    <chakra.span
      class="chakra-radio__control"
    />
    <chakra.span
      class="chakra-radio__label"
    >
      <slot /> test
    </chakra.span>
  </CFlex>
</template>

<style lang="scss" scoped>
  .chakra-radio {
    display: inline-flex;
    align-items: center;
    vertical-align: top;
    cursor: pointer;
    position: relative;

    .chakra-radio__input {
      border: 0;
      clip: rect(0, 0, 0, 0);
      height: 1px;
      width: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      white-space: nowrap;
      position: absolute;
    }
    .chakra-radio__control {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: var(--chakra-sizes-4);
      height: var(--chakra-sizes-4);
      transition-property: box-shadow;
      transition-duration: var(--chakra-transition-duration-normal);
      border-width: 2px;
      border-style: solid;
      border-image: initial;
      border-radius: var(--chakra-radii-full);

      &::before {
        content: "";
        display: inline-block;
        position: relative;
        width: 50%;
        height: 50%;
        border-radius: 50%;
        background: currentcolor;
      }
    }
    .chakra-radio__label {
      user-select: none;
      margin-inline-start: 0.5rem;
      font-size: var(--chakra-fontSizes-md);
    }
  }
</style>
