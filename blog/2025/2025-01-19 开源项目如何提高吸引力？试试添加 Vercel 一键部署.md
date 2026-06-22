---
slug: vercel
title: 开源项目如何提高吸引力？试试添加 Vercel 一键部署
authors: wukaipeng
---

在一些成名的 GitHub 开源项目中，会支持 Vercel 一键部署，比如前两年爆火，如今坐拥 78.7k star 的 [NextChat](https://github.com/ChatGPTNextWeb/NextChat?tab=readme-ov-file)：

![](https://img.wukaipeng.com/2025/01/19-1737283120518-mLqxXh-3044a98f77c84a7191deec7fbe2f1b1d.png)

那么 Vercel 是什么呢？ 它是一个专为前端开发者设计的**现代化部署平台**，特别适合用于**静态网站和前端应用**的构建、预览和发布。

So，如果你的开源项目属于静态网站或者前端应用一类的，可以考虑 README.md 上**添加 Vercel 一键部署，为你的开源项目增加吸引力**。

添加一键部署的方式也很简单，Vercel 提供了一个**按钮生成工具**：[deploy-button](https://vercel.com/docs/deployments/deploy-button)


![](https://img.wukaipeng.com/2025/01/19-1737283120723-5ppjrX-702a4ec30d1c4f96b8ab8fb7f4e1e208.png)

按钮生成器会生成 Markdown、HTML 和 URL 三种方式，可以按需取用

> 提醒一下，这里的交互会有点奇怪，页面下方是表单输入，比如填写 Git 仓库地址之后，上方 Markdown 链接会自动改变，并且没有成功提醒，这里需要适应一下

这里必填的，只有你的 **Git 仓库地址**：

![](https://img.wukaipeng.com/2025/01/19-1737283120951-cla5No-ea7f8ae650564f7489a2c7316fde2133.png)

其他的还有像是环境变量、默认项目名称、重定向、Demo、集成等，**按需填写**，最后将生成好的 Markdown 贴到你的开源项目 README.md 上：

![](https://img.wukaipeng.com/2025/01/19-1737283121127-iqyZZM-a3d1c64c282249e2a403c03a62a8b5e0.png)

**整个流程就完成了**，非常简单

对于用户侧来说，当他点击部署按钮之后，就会跳转到 Vercel 网站：

![](https://img.wukaipeng.com/2025/01/19-1737283121487-w1u0qY-9af3c8b78217432ba5cd715a94ea89a4.png)

这里需要登录 Vercel，同时 Vercel 会要求授予 Git 仓库读写权限，因为 Vercel 会执行**对目标仓库的克隆**，再以克隆后的仓库为准进行部署：



填写项目名称，点击创建：

![](https://img.wukaipeng.com/2025/01/19-1737283122589-LCgi3S-18fe758e918c4f3d9c7f7a112e9420bc.gif)

接下来就是等待大功告成：


![](https://img.wukaipeng.com/2025/01/19-1737283123130-l91ujh-ac96dfa0cac34b5eacea153877655aa0.png)


**Congratulations！**

这里已经能看到网站运行成功之后的**预览截图**了，也可以点击「Continue to Dashboard」去到控制台，点击 domain 网址，同样能看到网站已经成功部署：

![](https://img.wukaipeng.com/2025/01/19-1737283124104-lbtiOe-2de354a20b8840b688a4a4b43aa758de.gif)

整体回顾来看，Vercel 的部署服务非常丝滑，我甚至都不需要提供框架信息、运行命令等等

So，觉得 Vercel  一键部署的方式不错，那么考虑为你的项目增加一下吧！

> 如有需要，可查看本文示例项目参考：[https://github.com/wukaipeng-dev/ken](https://github.com/wukaipeng-dev/ken)
