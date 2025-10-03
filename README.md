# koishi-registry-aggregator

聚合 Koishi 插件市场镜像源数据。定期自动更新。

> 仓库地址： https://github.com/shangxueink/koishi-registry-aggregator
> 
> 镜像仓库地址： https://gitee.com/shangxueink/koishi-registry-aggregator

## 使用方法

通过以下地址访问：

大陆：
```
https://gitee.com/shangxueink/koishi-registry-aggregator/raw/gh-pages/market.json
```
全球：
```
https://shangxueink.github.io/koishi-registry-aggregator/market.json
```


## 工作原理

本项目通过 GitHub Actions 定时（每分钟）从多个镜像源获取插件数据，进行合并去重处理后，将结果发布到 GitHub Pages，并且同步到Gitee仓库。

> 但现在只同步Q78KG的唔... 

## 鸣谢

感谢以下项目提供的镜像源支持：

- [t4wefan](https://registry.koishi.t4wefan.pub/index.json) - 提供中国大陆地区优化的镜像
- [itzdrli](https://kp.itzdrli.cc) - 提供全球可访问的镜像
- [Q78KG](https://koishi-registry.yumetsuki.moe/index.json) - 提供全球可访问的镜像

## 贡献

欢迎通过 Issue 或 Pull Request 提交新的镜像源或改进建议。

## 许可证

MIT
