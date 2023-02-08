<script lang="ts" setup>
  import { format } from "~/utils";
  import { Recommendation, Task } from "~/apps/tasks/interfaces";

  const props = defineProps<{
    task: Task;
    rec: Recommendation;
  }>();

  const comp = {
    taskRecExpectedValue: computed(() => props.task?.rec_set?.recs.reduce(
      (accumulator, rec) => accumulator + calculateExpectedValue(rec),
      0,
    )),
    recExpectedValue: computed(() => calculateExpectedValue(props.rec)),
    taskCompletionPercentage: computed(() => {
      const tasksCompleted = props.task?.rec_set?.recs.filter(rec => rec.state !== "new").length;
      const tasksTotal = props.task?.rec_set?.recs.length;
      return Math.round((tasksCompleted / tasksTotal) * 100);
    }),
  };

  function calculateExpectedValue(rec: Recommendation) {
    const lastGifts = rec?.donor?.gifts.slice(0, 3);
    const lastGiftsSum = lastGifts?.reduce((acc, gift) => acc + Number(gift.amount), 0);
    if (!lastGiftsSum) {
      return 0;
    }
    const avg = lastGiftsSum / lastGifts.length;
    return Math.round(avg / 100) * 100;
  }
</script>

<template>
  <CFlex direction="column" font-size="xl" gap="2">
    <CFlex
      v-if="comp.taskRecExpectedValue.value && (comp.taskRecExpectedValue.value !== comp.recExpectedValue.value)"
      gap="1"
    >
      <chakra.span color="teal.500" font-weight="bold">
        {{ format.money(comp.taskRecExpectedValue.value) }}
      </chakra.span>
      total potential gifts in this list<chakra.span v-if="comp.taskCompletionPercentage.value">, you're <chakra.span color="teal.500">{{ comp.taskCompletionPercentage.value }}%</chakra.span> done!</chakra.span>
    </CFlex>

    <CFlex v-if="comp.recExpectedValue.value" gap="1">
      <chakra.span color="teal.500" font-weight="bold">
        {{ format.money(comp.recExpectedValue.value) }}
      </chakra.span>
      {{ props.rec?.donor?.first_name }}'s potential gift
    </CFlex>
  </CFlex>
</template>
