<script lang="ts" setup>
  import { CFlex, CBox, CLink, CSpinner, CText, CBadge, CIcon, CHeading } from "@chakra-ui/vue-next";
  import { captureException } from "@sentry/hub";
  import { computed, ref, watch } from "vue";
  import { DropdownOption } from "~/interfaces";

  const props = defineProps<{
    optionCurrent: DropdownOption;
    options: Array<DropdownOption>;
    onSelected: (option: DropdownOption) => Promise<any>;
    pos?: "left" | "right";
  }>();

  const state = {
    optionCurrent: ref(props.optionCurrent),
    isDropdownOpen: ref(false),
    isSavingOption: ref(false),
  };
  
  const comp = {
    hoverFilter: "brightness(95%) saturate(105%)",
    cardPx: 2,
    cardPy: "2px",
  };
  
  watch(() => props.optionCurrent, () => {
    state.optionCurrent.value = props.optionCurrent;
  });

  function onDropdownClick(event) {
    event.stopPropagation();
    const isSavingAndClosed = state.isSavingOption.value && !state.isDropdownOpen.value;
    if (isSavingAndClosed) {
      return;
    }
    state.isDropdownOpen.value = !state.isDropdownOpen.value;
  }

  async function onSelect(optionNew: DropdownOption) {
    const optionOld = state.optionCurrent.value;
    if (optionNew.id === optionOld.id) {
      return;
    }
    state.isSavingOption.value = true;
    state.optionCurrent.value = optionNew;
    try {
      await props.onSelected(optionNew);
    } catch (error) {
      captureException(error);
      state.optionCurrent.value = optionOld;
    }
    state.isSavingOption.value = false;
  }
</script>

<template>
  <CBox>

    <CBox
      pos="relative"
      w="fit-content"
      font-size="sm"
      tabindex="0"
      @click="(event) => onDropdownClick(event)"
      @blur="state.isDropdownOpen.value = false"
    >
      <slot
        name="option-current"
        :option-current="state.optionCurrent.value"
        :is-saving-option="state.isSavingOption.value"
      >
        <CBox
          :py="comp.cardPy"
          :px="comp.cardPx"
          border-radius="lg"
          :_hover="{
            filter: comp.hoverFilter,
            cursor: 'pointer',
          }"
          transition-property="all"
          transition-duration="normal"
          text-transform="capitalize"
          :bg="state.optionCurrent.value.bg ?? ''"
          :color="state.optionCurrent.value.color ?? 'initial'"
        >
          <chakra.span :opacity="state.isSavingOption.value ? 0.5 : 1">
            {{ state.optionCurrent.value.label ?? state.optionCurrent.value.value }}
          </chakra.span>
        </CBox>
      </slot>

      <CSpinner
        v-if="state.isSavingOption.value"
        size="sm"
        pos="absolute"
        top="0"
        bottom="0"
        left="0"
        right="0"
        m="auto"
        color="blue.500"
      />

      <CFlex
        v-if="state.isDropdownOpen.value"
        direction="column"
        pos="absolute"
        :left="props.pos === 'left' ? 0 : 'initial'"
        :right="props.pos === 'right' ? 0 : 'initial'"
        py="1"
        w="max-content"
        border-radius="lg"
        border="1px solid"
        border-color="gray.100"
        bg="white"
        z-index="popover"
        box-shadow="md"
        overflow="hidden"
      >
        <CFlex
          v-for="option in props.options"
          :key="option.id"
          direction="column"
        >
          <slot
            name="dropdown-option"
            :option="option"
            :option-current="state.optionCurrent.value"
            :options="props.options"
            :on-select="onSelect"
          >
            <CFlex
              @click="onSelect(option)"
              py="7px"
              :px="comp.cardPx"
              :_hover="{
                bg: 'gray.75',
                cursor: 'pointer',
              }"
              transition-property="all"
              transition-duration="normal"
            >
              <CBox
                :py="comp.cardPy"
                :px="comp.cardPx"
                w="fit-content"
                text-transform="capitalize"
                :bg="option.bg ?? ''"
                :color="option.color ?? 'initial'"
                border-radius="lg"
              >
                {{ option.label ?? option.value }}
              </CBox>
            </CFlex>
          </slot>
        </CFlex>
      </CFlex>

    </CBox>

  </CBox>
</template>
