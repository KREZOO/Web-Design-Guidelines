import { defineConfig } from 'vite'
import { resolve } from 'path';
import fs from 'fs';

function getPages() {
    const pagesDir = resolve(process.cwd(), 'pages');
    const pages = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'));
    const input = {};
    for (const page of pages) {
        const name = page.replace('.html', '');
        input[name] = resolve(pagesDir, page);
    }

    // Добавляем index.html в качестве одной из точек входа
    input['index'] = resolve(process.cwd(), 'index.html');

    // Добавляем остальные страницы
    for (const page of pages) {
        const name = page.replace('.html', '');
        input[name] = resolve(pagesDir, page);
    }

    return input;
}

// https://vitejs.dev/config/
export default defineConfig({
    base: "/Web-Design-Guidelines/",
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: getPages(),
        },
    },
})