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
  import { useRecStatus } from "~/apps/tasks/recs/useRecStatus";
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
      status: useRecStatus(),
      head: useHead({
        title: taskListStore.recOpened.value?.donor.name,
      }) as ActiveHeadEntry<any>,
    };
  });

  onBeforeMount(async () => {
    hooks.leftMenu.collapse();
    await loadTaskAndRecBySlug();
    await hooks.taskListStore.fetchDonorAction(hooks.taskListStore.recOpened.value);
  });
  
  watch(hooks.taskListStore.recOpened, hooks.leftMenu.collapse);
  onBeforeUnmount(hooks.leftMenu.unfold); // unMount fires every time we change recOpen

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
      await hooks.taskListStore.loadTaskListAndRecs();

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
  <CFlex direction="column" :gap="comp.spaceLg" w="100%" pb="24">

    <CFlex align="center" font-size="3xl">
      <CFlex>
        <NuxtLink :to="urls.tasks.detail(props.taskSlug)">
          <CFlex gap="2">
            <CLink>
              {{ comp.task.value?.title }}
            </CLink>
            <CTag h="fit-content" font-size="lg" p="6px">
              {{ format.dateHumanShort(comp.task.value?.date) }}
            </CTag>
          </CFlex>
        </NuxtLink>
      </CFlex>
      <CIcon name="chevron-right" mt="1px" size="12" />
      <CIcon
        v-if="hooks.status.isCompleted.value"
        name="check-circle"
        color="green.500"
        size="7"
        mr="2"
      />
      <CFlex font-weight="bold" :color="hooks.status.isCompleted.value ? 'green.600' : ''">
        {{ hooks.taskListStore.recOpened.value?.donor.name }}
      </CFlex>

      <CFlex>
        <CLink
          v-if="comp.rec.value?.donor.crm_url"
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

    <CFlex :gap="{ base: 8, '2xl': 14 }" direction="row" key="2">

      <CFlex direction="column" :gap="comp.spaceLg" w="100%" max-w="900px">

        <RRecDetailNavigation :task="comp.task.value" :rec="comp.rec.value" />

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

      <CFlex direction="column" gap="10" w="100%" max-w="800px">
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
