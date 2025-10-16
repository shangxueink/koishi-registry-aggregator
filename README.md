专注于同步和分发 Q78KG (Hoshino-Yumetsuki) 的 Koishi 插件市场镜像源。

> 仓库地址： https://github.com/shangxueink/koishi-registry-aggregator
> 
> 镜像仓库地址： https://gitee.com/shangxueink/koishi-registry-aggregator


本项目已从**多镜像源整合**转变为**单一镜像源同步分发**，

专门同步 [Q78KG/Hoshino-Yumetsuki](https://github.com/Hoshino-Yumetsuki/koishi-registry) 的插件市场数据并分发内容。

## 📦 使用方法

### 大陆访问
```
https://gitee.com/shangxueink/koishi-registry-aggregator/raw/gh-pages/market.json
```

### 全球访问（GitHub Pages + jsDelivr CDN）
```
https://cdn.jsdelivr.net/gh/shangxueink/koishi-registry-aggregator@gh-pages/market.json
```

### 原始GitHub Pages
```
https://shangxueink.github.io/koishi-registry-aggregator/market.json
```

## ⚙️ 工作原理

1. **定时同步**：通过 GitHub Actions 每5分钟从 Q78KG 镜像源获取最新数据
2. **CDN加速**：自动刷新 jsDelivr CDN 缓存，确保全球访问速度
3. **双平台分发**：同步部署到 GitHub Pages 和 Gitee 仓库

## 🙏 鸣谢

特别感谢 [Q78KG (Hoshino-Yumetsuki)](https://github.com/Hoshino-Yumetsuki/koishi-registry) 提供稳定可靠的 Koishi 插件市场镜像源。

## 📝 许可证

MIT