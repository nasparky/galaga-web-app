import { defineConfig } from 'vite'
import path from "path"

/** @type {import('vite').UserConfig} */

console.log(path.resolve(__dirname, "src/assets"))

export default defineConfig({
    resolve: {
        alias: {
            "@assets": path.resolve(__dirname, "src/assets"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@core": path.resolve(__dirname, "src/core"),
            "@styles": path.resolve(__dirname, "src/styles")
        }
    }
    // ...
})