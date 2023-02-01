<template>
  <TaskList :is-published-only="!$route.query.include_unpublished" />
</template>
