<template>
  <TaskList
    :task-opened-slug="$route.params['task_slug']"
    :is-published-only="!$route.query.include_unpublished"
  />
</template>
