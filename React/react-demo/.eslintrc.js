module.exports = {
    "env": {
        "es6": true,
        "browser": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:security/recommended",
        "fbjs"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "security",
        "no-loops",
        "array-func"
    ],
    "rules": {
        "no-loops/no-loops": 2,
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "ignoreUrls": true,
        "comments": 65,
        "camelcase": 2,
        "comma-dangle": ["error", "always-multiline"],
        "comma-spacing": ["error", { "before": false, "after": true }],
        "curly": ["error", "multi-or-nest"],
        "dot-location": ["error", "property"],
        "dot-notation": 2,
        "eqeqeq": [2, "smart"],
        "id-length": 0,
        "import/newline-after-import": 0,
        "import/no-unresolved": 0,
        "max-len": ["error", { "code": 120 }],
        "no-cond-assign": 2,
        "no-confusing-arrow": ["error", {"allowParens": true}],
        "no-this-before-super": 2,
        "no-trailing-spaces": 2,
        "no-underscore-dangle": ["error", {"allowAfterThis": true}],
        "no-unreachable": 2,
        "no-unused-vars": 2,
        "no-useless-concat": 2,
        "no-useless-constructor": 2,
        "no-useless-return": 2,
        "object-curly-spacing": ["error", "always"],
        "one-var-declaration-per-line": 2,
        "prefer-arrow-callback": 2,
        "require-yield": 2,
        "semi": ["error", "never"],
        "sort-imports": 2,
        "sort-keys": 2,
        "sort-vars": 2,
        "space-before-blocks": 2,
        "space-in-parens": ["error", "always"],
        "space-infix-ops": 2,
        "spaced-comment": 2,
        "use-isnan": 2,
        "valid-typeof": 2
    }
};
