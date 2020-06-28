export default [
  {
    title: 'Home',
    action: 'mdi-home',
    to: 'home',
    access: ['read', 'Reports'],
  },
  {
    title: 'Users',
    action: 'mdi-account-supervisor',
    to: 'users-list',
    access: ['read', 'Users'],
  },
  {
    title: 'Settings',
    action: 'mdi-cog',
    to: 'settings',
    divider: true,
  },
];
