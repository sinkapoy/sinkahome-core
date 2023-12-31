import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

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
            json(),
            typescript({
                tsconfig: "tsconfig.json",
                useTsconfigDeclarationDir: true,
                tsconfigOverride: {
                    declaration: false,
                }
            }),
            nodeResolve({ preferBuiltins: true, }),
            commonjs({ extensions: [".js", ".ts"] }),

        ]
    }
];