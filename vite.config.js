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

function copyMaterials() {
    // Копируем содержимое папки materials в dist
    const materialsDir = resolve(process.cwd(), 'materials');
    const distMaterialsDir = resolve(process.cwd(), 'dist/materials');

    // Создаем dist/materials, если его нет
    if (!fs.existsSync(distMaterialsDir)) {
        fs.mkdirSync(distMaterialsDir);
    }

    // Копируем все файлы из materials
    const files = fs.readdirSync(materialsDir);
    for (const file of files) {
        const sourcePath = resolve(materialsDir, file);
        const destPath = resolve(distMaterialsDir, file);

        // Если это директория, создаем ее в dist/materials
        if (fs.statSync(sourcePath).isDirectory()) {
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath);
            }

            // Копируем содержимое директории
            const filesInDir = fs.readdirSync(sourcePath);
            for (const fileInDir of filesInDir) {
                const sourceFilePath = resolve(sourcePath, fileInDir);
                const destFilePath = resolve(destPath, fileInDir);
                fs.copyFileSync(sourceFilePath, destFilePath);
            }
        } else {
            // Если это файл, просто копируем
            fs.copyFileSync(sourcePath, destPath);
        }
    }
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
    plugins: [
        {
            name: 'copy-materials',
            writeBundle() {
                copyMaterials();
            },
        },
    ],
})