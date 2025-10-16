import fs from 'fs/promises';
import purgeCDNCache from './purge-cdn.js';

// Hoshino-Yumetsuki 镜像源URL
const MIRROR_URL = 'https://raw.githubusercontent.com/Hoshino-Yumetsuki/koishi-registry/refs/heads/pages/index.json';

// 直接同步镜像源
async function syncRegistry() {
    try {
        console.log(`正在获取镜像源: ${MIRROR_URL}`);
        const response = await fetch(MIRROR_URL);

        if (!response.ok) {
            console.error(`获取镜像源失败: ${MIRROR_URL}, 状态码: ${response.status}`);
            return;
        }

        const registryData = await response.json();
        console.log(`成功获取镜像源: ${MIRROR_URL}, 包含 ${registryData.objects.length} 个插件`);

        // 将同步的数据写入文件
        await fs.writeFile('market.json', JSON.stringify(registryData));
        console.log('已成功将同步的数据写入 market.json 文件');

        // 数据写入成功后，刷新CDN缓存
        await purgeCDNCache();

    } catch (error) {
        console.error('同步镜像源出错:', error.message);
    }
}

// 执行主函数
syncRegistry().catch(error => {
    console.error('程序执行出错:', error);
});