import typescript from 'rollup-plugin-typescript2';
import images from '@rollup/plugin-image';
import copy from 'rollup-plugin-copy';

const config = {
    plugins: [
        typescript({
            tsconfig: 'tsconfig.json',
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
                declaration: false,
            }
        }),
        images({dom: false}),
        copy({
            targets: [
                {src: 'src/assets', dest: 'dist/assets'}
            ]
        })
    ],
    external: [
        /^(?!.*inject-css.js).*node_modules\/(.+)$/,
        'vue',
        'eventemitter3',
        'fs',
        'fs/promises',
        'http',
        '@ash.ts/ash',
    ],
};
export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/core.js',
                format: 'es',
                sourcemap: true,
            }
        ],
        ...config,
    }
];