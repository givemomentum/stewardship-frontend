<script lang="ts" setup>
  import { ActiveHeadEntry } from "@vueuse/head";
  import { useLeftMenu } from "~/apps/menu/useLeftMenu";
  import { Rec } from "~/apps/tasks/interfaces";
  import RRecActionEmail from "~/apps/tasks/recs/r-action-email.vue";
  import RRecActionLog from "~/apps/tasks/recs/r-action-log.vue";
  import RDonorGiftChart from "~/apps/tasks/recs/r-donor-gift-chart.vue";
  import RRecEmailTemplateBtn from "~/apps/tasks/recs/r-btn-email-template.vue";
  import RRecLastActions from "~/apps/tasks/recs/r-last-actions.vue";
  import RRecSummary from "~/apps/tasks/recs/r-rec-summary.vue";
  import { useRecStatus, status } from "~/apps/tasks/recs/useRecStatus";
  import { useComp, useHooks } from "~/structs";
  import { format } from "~/utils";
  import { useTaskListStore } from "~/apps/tasks/useTaskListStore";
  import { urls } from "~/urls";

  const props = defineProps<{
    taskSlug: string;
    recSlug: string;
  }>();

  const hooks = useHooks(() => {
    const taskListStore = useTaskListStore();
    return {
      tasks: taskListStore,
      leftMenu: useLeftMenu(),
      layout: useLayoutControl(),
      status: useRecStatus(),
      head: useHead({
        title: taskListStore.recOpened.value?.donor.name,
      }) as ActiveHeadEntry<any>,
    };
  });

  onBeforeMount(async () => {
    hooks.layout.activateLeanMode();
    await loadTaskAndRecBySlug();
    await hooks.tasks.fetchDonorActions(hooks.tasks.recOpened.value);
  });

  watch(hooks.tasks.recOpened, (recNew: Rec) => {
    hooks.tasks.recOpened, hooks.layout.activateLeanMode();
    hooks.head.patch({ title: recNew?.donor.name });
  });
  // unMount fires every time we change recOpen
  onBeforeUnmount(hooks.layout.deactivateLeanMode);

  const comp = useComp(() => {
    const recProxy = hooks.tasks.recOpened;
    const actionTypes = ["email", "call", "other"];
    return {
      task: computed(() => hooks.tasks.taskOpened.value),
      rec: computed(() => recProxy.value),
      actionTypes: actionTypes,

      recType: computed(() => {
        if (recProxy.value?.state === "completed" && actionTypes.includes(recProxy.value?.action_type)) {
          return recProxy.value.action_type;
        }
        if (recProxy.value?.state === "new") {
          return "email";
        }
        return "other";
      }),
      spaceLg: { base: 4, "2xl": 7 },
      taskCompletionPercentage: computed(() => {
        const tasksCompleted = hooks.tasks.taskOpened.value?.rec_set?.recs.filter(rec => rec.state !== "new").length;
        const tasksTotal = hooks.tasks.taskOpened.value?.rec_set?.recs.length;
        return Math.round((tasksCompleted / tasksTotal) * 100);
      }),
    };
  });

  async function loadTaskAndRecBySlug() {
    if (!hooks.tasks.isRecsLoaded.value) {
      await hooks.tasks.loadTasksRecSet({ isShowAllTasks: true });
    }

    if (!hooks.tasks.taskOpened.value) {
      hooks.tasks.taskOpened.value = hooks.tasks.tasks.value?.find(
        task => task.slug === props.taskSlug,
      );
    }

    if (!hooks.tasks.isGiftHistoryLoaded.value) {
      await hooks.tasks.loadRecsAndGiftHistory();
    }

    if (!hooks.tasks.recOpened.value) {
      hooks.tasks.recOpened.value = hooks.tasks.taskOpened.value.rec_set.recs.find(
        rec => rec.slug === props.recSlug,
      );
      hooks.head.patch({ title: hooks.tasks.recOpened.value?.donor.name });
    }

    if (hooks.tasks.recOpened.value && hooks.tasks.recOpened.value.slug !== props.recSlug) {
      hooks.tasks.recOpened.value = hooks.tasks.taskOpened.value.rec_set.recs.find(
        rec => rec.slug === props.recSlug,
      );
    }
  }

  function navigateRec(rec: Rec) {
    hooks.tasks.recOpened.value = rec;
    hooks.tasks.fetchDonorActions(hooks.tasks.recOpened.value);
    window.history.pushState(null, "", urls.tasks.detailRec(props.taskSlug, rec?.slug))
  }
</script>

<template>
  <CFlex direction="column" w="100%" h="100%">

    <CFlex
      p="3"
      px="5"
      font-size="2xl"
      direction="column"
      gap="0"
      border-bottom="1px solid"
      border-color="gray.100"
      z-index="sticky"
      bg="#2c3849"
      color="white"
    >
      <CFlex align="center" gap="5">
        <NuxtLink :to="urls.tasks.list">
          <chakra.img src="/momentum-logo-only.svg" max-w="50px" />
        </NuxtLink>

        <CFlex gap="3" align="center">
          {{ comp.task.value?.title }}
          <CTag h="fit-content" p="6px" font-size="md">
            {{ format.dateHumanShort(comp.task.value?.date) }}
          </CTag>
        </CFlex>
      </CFlex>

      <CFlex align="center">
        <CLink
          v-if="comp.rec.value?.donor.crm_url && false"
          :href="comp.rec.value?.donor.crm_url"
          is-external
          variant="none"
          display="flex"
        >
          <CButton
            size="sm"
            variant="outline"
            right-icon="external-link"
            color-scheme="gray"
            bg="white"
            ml="5"
          >
            CRM profile
          </CButton>
        </CLink>
      </CFlex>
    </CFlex>

    <CFlex>
      <CFlex
        direction="column"
        py="5"
        bg="gray.50"
        border-right="1px solid"
        border-color="gray.100"
        z-index="docked"
        font-size="sm"
      >
        <!--        <NuxtLink-->
        <!--          v-for="rec in comp.task.value?.rec_set.recs"-->
        <!--          :key="rec?.pk"-->
        <!--          :to="urls.tasks.detailRec(props.taskSlug, rec?.slug)"-->
        <!--        >-->
        <CLink
          display="flex"
          align-items="center"
          gap="2"
          :px="{ base: 3, '2xl': 5 }"
          :pr="{ base: 4, '2xl': 6 }"
          py="2"
          :bg="rec?.pk === comp.rec.value?.pk ? 'gray.100' : 'gray.50'"
          :opacity="rec?.pk === comp.rec.value?.pk ? '1' : '0.75'"
          :_hover="{
              opacity: '1',
            }"
          v-for="rec in comp.task.value?.rec_set.recs"
          :key="rec?.pk"
          @click="navigateRec(rec)"
        >
          <CIcon
            v-if="status.isCompleted(rec) || status.isSkippedAsHandled(rec)"
            name="io-checkmark-circle"
            color="green.500"
            fill="green.500"
            size="19px"
          />
          <CIcon
            v-if="status.isSkippedToLater(rec)"
            name="bi-clock"
            size="19px"
            color="green.500"
          />
          <CIcon
            v-if="status.isNew(rec)"
            name="io-checkmark-circle-outline"
            color="gray.400"
            size="19px"
          />
          <CIcon
            v-if="status.isSkippedAsUnqualified(rec)"
            name="x"
            color="gray.400"
            size="19px"
          />
          <CFlex
            v-if="rec"
            white-space="nowrap"
            color="gray.700"
            overflow="hidden"
          >
            {{ rec.donor.name }}
          </CFlex>
        </CLink>
        <!--        </NuxtLink>-->
      </CFlex>

      <CFlex
        direction="column"
        :gap="comp.spaceLg"
        min-h="100vh"
        w="100%"
        :max-w="{ base: '43%', '2xl': 900 }"
        pt="10"
        :px="{ base: 5, '2xl': 8 }"
        mt="-6"
        bg="white"
        border-right="1px solid"
        border-color="gray.100"
        box-shadow="xl"
      >

        <CFlex pos="relative" w="100%">
          <ChakraTabs
            :tabKeys="comp.actionTypes"
            :selected="comp.recType.value"
            :is-tabs-visible="!(hooks.status.isHandled.value)"
            :recSlug="comp.rec.value?.slug"
          >
            <template v-slot:email>
              <RRecActionEmail
                v-if="comp.rec.value?.email"
                :rec="comp.rec.value"
                :gap="comp.spaceLg"
              />
            </template>
            <template v-slot:email-header-side>
              <RRecEmailTemplateBtn
                v-if="hooks.tasks.taskOpened.value?.rec_set.rule.email_template"
                :template="hooks.tasks.taskOpened.value?.rec_set.rule.email_template"
                @update.template="(templateHtml) => {
                  hooks.tasks.taskOpened.value.rec_set.rule.email_template.content_html = templateHtml
                }"
              />
            </template>

            <template v-slot:call>
              <RRecActionLog v-if="comp.rec.value" :rec="comp.rec.value" type="call" />
            </template>
            <template v-slot:other>
              <RRecActionLog v-if="comp.rec.value" :rec="comp.rec.value" type="other" />
            </template>
          </ChakraTabs>
        </CFlex>

      </CFlex>

      <CFlex
        direction="column"
        :gap="{ base: 7, '2xl': 10 }"
        :pl="{ base: 5, '2xl': 8 }"
        :pr="{ base: 3, '2xl': 5 }"
        w="100%"
        max-w="750px"
      >
        <RRecSummary
          v-if="comp.rec.value"
          :rec="comp.rec.value"
          :task="comp.task.value"
        />

        <CFlex gap="4" direction="column">
          <CHeading font-size="2xl" color="gray.500" font-weight="normal">
            Giving history
          </CHeading>
          <RDonorGiftChart v-if="comp.rec.value" :rec="comp.rec.value" />
        </CFlex>

        <RRecLastActions
          v-if="comp.rec.value?.donor.actions"
          :actions="comp.rec.value?.donor.actions"
        />
      </CFlex>

    </CFlex>

  </CFlex>
</template>
