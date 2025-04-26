# koishi-registry-aggregator

旨在聚合多个 Koishi 插件市场镜像源的数据，解决单一镜像源可能存在的不完整问题，为 Koishi 用户提供一个更加全面的插件资源。

通过定期自动更新，确保插件列表的时效性。

## 使用方法

聚合后的插件市场数据可通过以下地址访问：

```
https://shangxueink.github.io/koishi-registry-aggregator/market.json
```

您可以在 Koishi 控制台的插件市场设置中添加此地址作为镜像源。

## 工作原理

本项目通过 GitHub Actions 定时（每30分钟）从多个镜像源获取插件数据，进行合并去重处理后，将结果发布到 GitHub Pages。

## 鸣谢

感谢以下项目提供的镜像源支持：

- [t4wefan](https://registry.koishi.t4wefan.pub/index.json) - 提供中国大陆地区优化的镜像
- [itzdrli](https://kp.itzdrli.cc) - 提供全球可访问的镜像
- [Q78KG](https://koishi-registry.yumetsuki.moe/index.json) - 提供全球可访问的镜像

## 贡献

欢迎通过 Issue 或 Pull Request 提交新的镜像源或改进建议。

## 许可证

MIT
