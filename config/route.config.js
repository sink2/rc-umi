export default [
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [{ path: '/user', component: './Welcome' }],
    },
    {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
            { path: '/', redirect: '/welcome' },
            // dashboard
            {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
            },
        ],
    },
];
