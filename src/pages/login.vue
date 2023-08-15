<script setup lang="ts">
import { useRoute } from "#app";

const hooks = {
  api: useApi(),
  layout: useLayoutControl(),
  route: useRoute(),
};

const state = {
  url: ref(""),
  uid: ref(""),
};

state.uid.value = hooks.route.query.uid || ""

onMounted(async () => {
  hooks.layout.activateLeanMode();
  const config = {}
  if (state.uid.value) {
    config.params = {
      state: state.uid.value,
    };
  }
  state.url.value = await hooks.api.getJson("/nylas/auth-url/", config);
});
</script>

<template>
  <CVStack w="100%" min-h="100vh" bg="gray.50">
    <PNavbar />

    <CCenter h="100%" pb="40">
      <CVStack direction="column" justify="flex-start" key="2" w="fit-content" gap="8">
        <CVStack align="center" gap="4" pt="8">
          <chakra.img display="flex" src="/momentum-logo-only.svg" max-w="50px" />
          <CHeading font-size="2xl">Sign in to your account</CHeading>
        </CVStack>
        <CVStack
          gap="4"
          bg="white"
          p="12"
          box-shadow="md"
          border-radius="md"
        >
          <CLink :href="state.url.value">
            <CButton
              variant="outline"
              size="lg"
              color-scheme="gray"
              color="gray.600"
              p="10px"
              min-w="300px"
              h="fit-content"
            >
              <CIcon name="fc-google" size="8" mr="2" ml="2px" />
              Sign in with Google
            </CButton>
          </CLink>
          <CLink :href="state.url.value">
            <CButton
              variant="outline"
              size="lg"
              color-scheme="gray"
              color="gray.600"
              p="10px"
              min-w="300px"
              h="fit-content"
            >
              <CIcon name="vi-file-type-outlook" size="8" mr="2" ml="2px" />
              Sign in with Outlook
            </CButton>
          </CLink>

          <CBox max-w="280px" color="gray.500" font-size="sm" text-align="center">
            By continuing, you're agreeing with our
            <CLink text-decoration="underline" href="/privacy-policy">Privacy Policy</CLink>
            and
            <CLink text-decoration="underline" href="/terms-of-use">Terms of Use</CLink>
          </CBox>
        </CVStack>
      </CVStack>
    </CCenter>
  </CVStack>
</template>
