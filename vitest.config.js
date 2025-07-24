export default {
    test: {
        environment: 'jsdom',
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: true, // 使用單線程來避免競爭條件
            },
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                '__test__/setup.js',
            ],
        },
        ui: true,
    },
}; 