import fs from 'fs/promises';

// 定义要获取的镜像源列表
const mirrorUrls = [
    // 'https://registry.koishi.t4wefan.pub/index.json',
    //    'https://kp.itzdrli.cc',    // 有广告
    'https://koishi-registry.yumetsuki.moe/index.json',
    // 'https://koishi-registry-cf.yumetsuki.moe/'
];

// 检查插件是否应该被隐藏
function shouldHidePlugin(plugin) {
    // 检查 manifest.market.hidden
    if (plugin.manifest && plugin.manifest.market && plugin.manifest.market.hidden === true) {
        return true;
    }

    // 检查 manifest.hidden
    if (plugin.manifest && plugin.manifest.hidden === true) {
        return true;
    }

    // 检查 ignored 字段
    if (plugin.ignored === true) {
        return true;
    }

    return false;
}

// 主函数
async function mergeRegistries() {
    console.log('开始整合镜像源...');

    // 存储所有镜像源的数据
    const allRegistryData = [];

    // 获取所有镜像源的数据
    for (const url of mirrorUrls) {
        try {
            console.log(`正在获取镜像源: ${url}`);
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`获取镜像源失败: ${url}, 状态码: ${response.status}`);
                continue;
            }

            const data = await response.json();
            allRegistryData.push(data);
            console.log(`成功获取镜像源: ${url}, 包含 ${data.objects.length} 个插件`);
        } catch (error) {
            console.error(`获取镜像源出错: ${url}`, error.message);
        }
    }

    if (allRegistryData.length === 0) {
        console.error('没有成功获取任何镜像源数据，退出程序');
        return;
    }

    // 合并所有镜像源的数据
    console.log('开始合并镜像源数据...');

    // 使用 Map 来存储合并后的插件，以插件名称为键
    const mergedPluginsMap = new Map();

    // 处理每个镜像源的数据
    for (const registry of allRegistryData) {
        for (const plugin of registry.objects) {
            // 检查是否应该隐藏
            if (shouldHidePlugin(plugin)) {
                continue; // 跳过隐藏的插件
            }

            const pluginName = plugin.package.name;

            // 如果该插件尚未添加到合并列表，或者是更新的版本，则添加
            if (!mergedPluginsMap.has(pluginName) ||
                new Date(plugin.package.date) > new Date(mergedPluginsMap.get(pluginName).package.date)) {
                mergedPluginsMap.set(pluginName, plugin);
            }
        }
    }

    // 将 Map 转换为数组
    const mergedPlugins = Array.from(mergedPluginsMap.values());

    // 创建最终的合并数据
    const mergedRegistry = {
        time: new Date().toUTCString(),
        total: mergedPlugins.length,
        version: 1,
        objects: mergedPlugins
    };

    console.log(`合并完成，共整合 ${mergedPlugins.length} 个插件`);

    // 将合并后的数据写入文件
    try {
        await fs.writeFile('market.json', JSON.stringify(mergedRegistry, null, 2));
        console.log('已成功将整合后的数据写入 market.json 文件');
    } catch (error) {
        console.error('写入文件失败:', error.message);
    }
}

// 执行主函数
mergeRegistries().catch(error => {
    console.error('程序执行出错:', error);
});
