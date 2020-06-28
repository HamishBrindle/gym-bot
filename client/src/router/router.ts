import Vue from 'vue';
import VueRouter, { RouteConfig, Route } from 'vue-router';
import Dashboard from '@/views/Dashboard/index.vue';
import Home from '@/views/Dashboard/Home.vue';
import Login from '@/views/Dashboard/Auth/Login.vue';
import User from '@/models/User';
import defineAbilitiesFor from '@/services/AbilityService';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/dashboard/login',
  },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        redirect: 'login',
      },
      {
        path: 'home',
        name: 'home',
        component: Home,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import(/* webpackChunkName: "Settings" */ '@/views/Dashboard/Settings.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'login',
        name: 'login',
        meta: {
          layout: 'full-screen',
        },
        component: Login,
      },
      {
        path: 'logout',
        name: 'logout',
        meta: {
          layout: 'full-screen',
        },
        component: () => import(/* webpackChunkName: "Auth" */ '@/views/Dashboard/Auth/Logout.vue'),
      },
      {
        path: 'users',
        name: 'users-list',
        component: () => import(/* webpackChunkName: "Users" */ '@/views/Dashboard/Users/UsersList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '*',
    name: 'error',
    component: () => import(/* webpackChunkName: "Error" */ '@/views/Error.vue'),
    meta: {
      layout: 'full-screen',
    },
    props: {
      code: 404,
      reason: 'Page Not Found',
      message: 'Sorry, we\'re unable to find the page you\'re looking for!',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

/**
 * Returns true if user is authenticated.
 *
 * @returns {boolean}
 */
function isAuthenticated() {
  const user = User.getActive();

  if (user) {
    const { rules } = defineAbilitiesFor(user);
    router.app.$ability.update(rules);
  }

  // @ts-ignore - Having issues with the Model inheritance we have with BaseModel
  return typeof user?.accessToken === 'string';
}

/**
 * Returns true if given route requires authentication.
 */
function authenticationRequired(route: Route) {
  return route.matched.some((record) => record.meta.requiresAuth);
}

router.beforeEach((to, from, next) => {
  if (authenticationRequired(to)) {
    // not authenticated; go to login
    if (!isAuthenticated()) {
      const route = {
        name: 'login',
        params: to.params,
        query: {
          redirect: to.path,
        },
      };
      return next(route);
    }
  }

  return next();
});

export default router;
