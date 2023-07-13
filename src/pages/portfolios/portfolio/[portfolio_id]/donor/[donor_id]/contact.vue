<template>
  <PContactDonor
    :plan-id="$route.params['portfolio_id']"
    :donor-id="$route.params['donor_id']"
    :rec-id="$route.query['rec_id']"
  />
</template>
