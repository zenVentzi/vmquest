module.exports = {
    extends: [
        "airbnb",
        "prettier",
        "prettier/react"
    ],
    rules: {
        "no-console": "off",
        'no-plusplus': 'off',
        "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
        "linebreak-style": ["error", "windows"],
        "jsx-a11y/anchor-is-valid": ["error", { "components": ["Link"], "specialLink": ["to"] }],
        "react/prop-types": "off",
        "no-debugger": "off",
        "prettier/prettier": [
            "error",
            {
                "trailingComma": "es5",
                "singleQuote": true,
                "printWidth": 80
            }
        ]
    },
    env: {
        "browser": true,
        "es6": true,
    },
    parser: "babel-eslint",
    plugins: [
        "prettier"
    ]
};