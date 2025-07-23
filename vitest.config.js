export default {
    test: {
        environment: 'jsdom',
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