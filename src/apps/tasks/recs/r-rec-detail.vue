<script lang="ts" setup>
  import { ActiveHeadEntry } from "@vueuse/head";
  import { useLeftMenu } from "~/apps/menu/useLeftMenu";
  import RRecActionEmail from "~/apps/tasks/recs/r-action-email.vue";
  import RRecActionLog from "~/apps/tasks/recs/r-action-log.vue";
  import RDonorGiftChart from "~/apps/tasks/recs/r-donor-gift-chart.vue";
  import RRecDetailNavigation from "~/apps/tasks/recs/r-nav-header.vue";
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
      taskListStore: taskListStore,
      leftMenu: useLeftMenu(),
      layout: useLayoutControl(),
      status: useRecStatus(),
      head: useHead({
        title: taskListStore.recOpened.value?.donor.name,
      }) as ActiveHeadEntry<any>,
    };
  });

  onBeforeMount(async () => {
    hooks.layout.isPaddingEnabled.value = false;
    await loadTaskAndRecBySlug();
    await hooks.taskListStore.fetchDonorActions(hooks.taskListStore.recOpened.value);
  });
  
  watch(hooks.taskListStore.recOpened, () => hooks.layout.isPaddingEnabled.value = false);
  onBeforeUnmount(() => hooks.layout.isPaddingEnabled.value = true); // unMount fires every time we change recOpen

  const comp = useComp(() => {
    const recProxy = hooks.taskListStore.recOpened;
    const actionTypes = ["email", 'call', 'message', 'other'];
    return {
      task: computed(() => hooks.taskListStore.taskOpened.value),
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
      spaceLg: 7,
      taskCompletionPercentage: computed(() => {
        const tasksCompleted = hooks.taskListStore.taskOpened.value?.rec_set?.recs.filter(rec => rec.state !== "new").length;
        const tasksTotal = hooks.taskListStore.taskOpened.value?.rec_set?.recs.length;
        return Math.round((tasksCompleted / tasksTotal) * 100);
      }),
    }
  });

  async function loadTaskAndRecBySlug() {
    if (!hooks.taskListStore.isRecsLoaded.value) {
      await hooks.taskListStore.loadTasksRecSet({ isShowAllTasks: true });

      hooks.taskListStore.taskOpened.value = hooks.taskListStore.tasks.value?.find(
        task => task.slug === props.taskSlug,
      );
    }

    if (!hooks.taskListStore.isGiftHistoryLoaded.value) {
      await hooks.taskListStore.loadTaskOpenedRecsAndGiftHistory();
    }

    if (!hooks.taskListStore.recOpened.value) {
      hooks.taskListStore.recOpened.value = hooks.taskListStore.taskOpened.value.rec_set.recs.find(
        rec => rec.slug === props.recSlug,
      );
      hooks.head.patch({ title: hooks.taskListStore.recOpened.value?.donor.name });
    }

    if (hooks.taskListStore.recOpened.value && hooks.taskListStore.recOpened.value.slug !== props.recSlug) {
      hooks.taskListStore.recOpened.value = hooks.taskListStore.taskOpened.value.rec_set.recs.find(
        rec => rec.slug === props.recSlug,
      );
    }
  }
</script>

<template>
  <CFlex direction="column" w="100%" h="100%">

    <CFlex
      py="3"
      pl="5"
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

        <NuxtLink :to="urls.tasks.detail(props.taskSlug)">
          <CFlex gap="2">
            <CLink>
              {{ comp.task.value?.title }}
            </CLink>
            <CTag h="fit-content" p="6px">
              {{ format.dateHumanShort(comp.task.value?.date) }}
            </CTag>
          </CFlex>
        </NuxtLink>
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
        pb="5"
        pt="2"
        bg="gray.50"
        border-right="1px solid"
        border-color="gray.100"
        z-index="docked"
      >
        <NuxtLink
          v-for="rec in comp.task.value?.rec_set.recs"
          :key="rec?.pk"
          :to="urls.tasks.detailRec(props.taskSlug, rec?.pk, rec?.slug)"
        >
          <CLink
            display="flex"
            align-items="center"
            gap="2"
            px="5"
            py="2"
            :bg="rec?.pk === comp.rec.value?.pk ? 'gray.100' : 'gray.50'"
            :opacity="rec?.pk === comp.rec.value?.pk ? '1' : '0.75'"
            :_hover="{
              opacity: '1',
            }"
          >
            <CIcon
              v-if="status.isCompleted(rec) || status.isSkippedAsHandled(rec)"
              name="io-checkmark-circle"
              color="green.500"
              fill="green.500"
              size="5"
            />
            <CIcon
              v-if="status.isSkippedToLater(rec)"
              name="bi-clock"
              color="green.500"
            />
            <CIcon
              v-if="status.isNew(rec)"
              name="io-checkmark-circle-outline"
              color="gray.400"
              size="5"
            />
            <CFlex
              v-if="rec"
              white-space="nowrap"
              color="gray.700"
              overflow="hidden"
            >
              {{rec.donor.name}}
            </CFlex>
          </CLink>
        </NuxtLink>
      </CFlex>
      

      <CFlex
        direction="column"
        :gap="comp.spaceLg"
        w="100%"
        max-w="900px"
        pt="10"
        px="8"
        mt="-6"
        bg="white"
        border-right="1px solid"
        border-color="gray.100"
        box-shadow="xl"
      >

        <RRecDetailNavigation v-if="false" :task="comp.task.value" :rec="comp.rec.value" />

        <CFlex pos="relative" w="100%">
          <ChakraTabs
            :tabKeys="comp.actionTypes"
            :selected="comp.recType.value"
            :is-tabs-visible="!(hooks.status.isHandled.value)"
          >
            <template v-slot:email>
              <RRecActionEmail
                v-if="comp.rec.value?.email"
                :rec="comp.rec.value"
              />
            </template>
            <template v-slot:email-header-side>
              <RRecEmailTemplateBtn
                v-if="hooks.taskListStore.taskOpened.value?.rec_set.rule.email_template"
                :template="hooks.taskListStore.taskOpened.value?.rec_set.rule.email_template"
                @update.template="(templateHtml) => {
                  hooks.taskListStore.taskOpened.value.rec_set.rule.email_template.content_html = templateHtml
                }"
              />
            </template>

            <template v-slot:call>
              <RRecActionLog v-if="comp.rec.value" :rec="comp.rec.value" type="call" />
            </template>
            <template v-slot:message>
              <RRecActionLog v-if="comp.rec.value" :rec="comp.rec.value" type="message" />
            </template>
            <template v-slot:other>
              <RRecActionLog v-if="comp.rec.value" :rec="comp.rec.value" type="other" />
            </template>
          </ChakraTabs>
        </CFlex>

      </CFlex>

      <CFlex
        direction="column"
        gap="10"
        pl="8"
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
