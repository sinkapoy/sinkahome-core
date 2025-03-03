import commonjs from "@rollup/plugin-commonjs";
import typescript from '@rollup/plugin-typescript';
import nodeResolve from "@rollup/plugin-node-resolve";

export default [
    {
        input: "src/index.ts",
        external: [
            'websocket',
            'fs',
            'fs/promises',
            'http',
            '@ash.ts/ash',
            /node_modules/
        ],
        output: [
            {
                file: "dist/core.js",
                format: "es",
                sourcemap: true,
            }
        ],
        plugins: [
            typescript({
                tsconfig: "tsconfig.json"
            }),
            nodeResolve({ preferBuiltins: true, }),
            commonjs({ extensions: [".js", ".ts"] }),
        ]
    }
];