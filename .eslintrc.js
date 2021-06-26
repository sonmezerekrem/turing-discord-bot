module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true
    },
    extends: [
        'airbnb-base'
    ],
    parserOptions: { ecmaVersion: 12 },
    rules: {
        indent: ['error', 4],
        'no-multiple-empty-lines': ['error', {
            max: 2,
            maxEOF: 0
        }],
        'max-len': ['error', {
            code: 120,
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreRegExpLiterals: true
        }
        ],
        'brace-style': ['error', 'stroustrup'],
        'linebreak-style': ['error', 'windows'],
        'comma-dangle': ['error', 'never'],
        'quote-props': ['error', 'as-needed'],
        'consistent-return': 'off',
        'no-plusplus': 'off',
        'no-mixed-operators': 'off',
        'no-param-reassign': 'off',
        'no-await-in-loop': 'off'
    }
};
