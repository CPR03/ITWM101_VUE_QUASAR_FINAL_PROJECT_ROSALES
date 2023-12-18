const routes = [
  {
    path: '/',

    children: [
      { path: '', component: () => import('pages/APOD.vue') },
    ]
  },

  // Catch-all route (keep it as the last one)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/APOD.vue')
  }
]

export default routes
