// CDN缓存刷新工具
// 用于在GitHub Actions构建后刷新jsDelivr CDN缓存

async function purgeCDNCache() {
    console.log('开始刷新CDN缓存...');

    // 需要刷新的URL列表
    const purgeUrls = [
        // https://cdn.jsdelivr.net/gh/shangxueink/koishi-registry-aggregator@gh-pages/market.json
        'https://purge.jsdelivr.net/gh/shangxueink/koishi-registry-aggregator@gh-pages/market.json',
        // https://cdn.jsdelivr.net/gh/Hoshino-Yumetsuki/koishi-registry@pages/index.json
        'https://purge.jsdelivr.net/gh/Hoshino-Yumetsuki/koishi-registry@pages/index.json'
    ];

    const results = [];

    for (const url of purgeUrls) {
        try {
            console.log(`正在刷新: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
            });

            if (response.ok) {
                const result = await response.json();
                results.push({
                    url: url,
                    success: true,
                    message: result.message || '刷新成功'
                });
                console.log(`✅ ${url} 刷新成功: ${result.message}`);
            } else {
                results.push({
                    url: url,
                    success: false,
                    message: `HTTP ${response.status}: ${response.statusText}`
                });
                console.error(`❌ ${url} 刷新失败: HTTP ${response.status}`);
            }
        } catch (error) {
            results.push({
                url: url,
                success: false,
                message: error.message
            });
            console.error(`❌ ${url} 刷新出错:`, error.message);
        }

        // 添加短暂延迟，避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('CDN缓存刷新完成');

    // 返回结果统计
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`刷新结果: ${successful} 成功, ${failed} 失败`);

    if (failed > 0) {
        console.log('失败的URL:');
        results.filter(r => !r.success).forEach(r => {
            console.log(`  - ${r.url}: ${r.message}`);
        });
    }

    return results;
}

// 如果直接运行此文件，则执行刷新
if (process.argv[1] && process.argv[1].includes('purge-cdn.js')) {
    purgeCDNCache().catch(error => {
        console.error('CDN刷新执行出错:', error);
        process.exit(1);
    });
}

export default purgeCDNCache;