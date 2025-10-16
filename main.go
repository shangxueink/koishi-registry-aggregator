package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

const (
	mirrorURL  = "https://raw.githubusercontent.com/Hoshino-Yumetsuki/koishi-registry/refs/heads/pages/index.json"
	outputFile = "market.json"
)

// 需要刷新的CDN URL列表
var purgeURLs = []string{
	"https://purge.jsdelivr.net/gh/shangxueink/koishi-registry-aggregator@gh-pages/market.json",
	"https://purge.jsdelivr.net/gh/Hoshino-Yumetsuki/koishi-registry@pages/index.json",
}

func main() {
	fmt.Println("开始同步 Hoshino-Yumetsuki 镜像源...")

	// 获取镜像源数据
	registryData, err := fetchRegistry()
	if err != nil {
		fmt.Printf("获取镜像源失败: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("成功获取镜像源: %s, 包含 %d 个插件\n", mirrorURL, len(registryData["objects"].([]interface{})))

	// // 更新时间为当前时间
	// registryData["time"] = time.Now().UTC().Format(time.RFC1123)

	// 写入文件
	if err := writeRegistryFile(registryData); err != nil {
		fmt.Printf("写入文件失败: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("已成功将同步的数据写入 market.json 文件")

	// 刷新CDN缓存
	fmt.Println("开始刷新CDN缓存...")
	if err := purgeCDNCache(); err != nil {
		fmt.Printf("CDN缓存刷新失败: %v\n", err)
		os.Exit(1)
	}
}

// 获取镜像源数据
func fetchRegistry() (map[string]interface{}, error) {
	resp, err := http.Get(mirrorURL)
	if err != nil {
		return nil, fmt.Errorf("HTTP请求失败: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP状态码: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应体失败: %v", err)
	}

	var data map[string]interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		return nil, fmt.Errorf("JSON解析失败: %v", err)
	}

	return data, nil
}

// 写入registry文件
func writeRegistryFile(data map[string]interface{}) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("JSON序列化失败: %v", err)
	}

	return os.WriteFile(outputFile, jsonData, 0644)
}

// 刷新CDN缓存
func purgeCDNCache() error {
	client := &http.Client{Timeout: 30 * time.Second}
	successCount := 0

	for _, url := range purgeURLs {
		fmt.Printf("正在刷新: %s\n", url)

		resp, err := client.Get(url)
		if err != nil {
			fmt.Printf("❌ %s 刷新失败: %v\n", url, err)
			continue
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK {
			body, _ := io.ReadAll(resp.Body)
			fmt.Printf("✅ %s 刷新成功，响应：\n", url)
			fmt.Printf("%s\n", string(body))
			successCount++
		} else {
			fmt.Printf("❌ %s 刷新失败: HTTP %d\n", url, resp.StatusCode)
		}

		// 添加短暂延迟
		time.Sleep(1 * time.Second)
	}

	fmt.Printf("刷新结果: %d 成功, %d 失败\n", successCount, len(purgeURLs)-successCount)
	return nil
}
