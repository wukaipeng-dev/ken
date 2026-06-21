---
slug: github-copilot

authors: wukaipeng
---

早在 OpenAI 推出 ChatGPT 之前，OpenAI 就已经和 GitHub 合作推出了 GitHub Copilot。

> 下文统一简称 Copilot

Copilot 当时在编程圈引起轰动。

当时激进的说法是：**Copilot 将会取代程序员**。

三年之后，冷静下来，Copilot 并没有如愿替代程序员。

相反，它是一个提高效率的强大助手，掌握它，可以让你的**编程效率提高数倍**。

![](https://img.wukaipeng.com/2024/04/12-234638-MyWTBn-download.png)

## Copilot 的价格

国内开发者对价格相对来说还是比较敏感的。

Copilot 官方有两种订阅方式，一个是**个人版**，一个是**团队版**。

团队就不说了，有公司支持就不需要考虑这一茬。

个人版的价格有两种：
1. 月度订阅，每月 10 美刀，**人民币 72.37 元**
2. 年度订阅，每年 100 美刀，**人民币 723.7 元**

![](https://img.wukaipeng.com/2024/04/12-234839-d3CXp0-image-20240412234839346.png)

个人版会有 30 天的免费适用期，可以先试用一下。

GitHub 比较友好，**支持国内的信用卡绑定支付**，招商、广发、建行等都可以。

非官方渠道的话，比如 x 宝、uTools 插件等，可能会不稳定，但胜在价格便宜。

## Copilot 全家桶

Copilot 使用很简单，在 VSCode/JetBrains 上安装对应的插件，然后登录 GitHub 账号即可。

![](https://img.wukaipeng.com/2024/04/12-181521-InDV4W-12-180931-cqLDKX-image-20240412180930744.png)

> 👉 VSCode: https://marketplace.visualstudio.com/items?itemName=GitHub.copilot
> 👉 JetBrains: https://plugins.jetbrains.com/plugin/17718-github-copilot

安装后，输入代码时，Copilot 会自动提示代码，按 `Tab` 键即可补全。

![](https://img.wukaipeng.com/2024/04/12-181423-r0m99D-212964557-8d832278-61bb-4288-a8a7-47f35859e868.gif)

JetBrains 的 Copilot 插件集成提供侧边栏 Chat 功能：

![](https://img.wukaipeng.com/2024/04/12-182530-ZLDeBh-image-20240412182529852.png)


对于 VSCode 用户来说，如果要开启侧边栏 Chat 功能，需要额外安装 Copilot Chat 插件：

![](https://img.wukaipeng.com/2024/04/12-182139-JZOxxA-image-20240412182138873.png)

安装之后，侧边栏菜单会多了一个「Chat」项，和 ChatGPT 一样的聊天界面：

![](https://img.wukaipeng.com/2024/04/12-182250-GevSkt-image-20240412182250704.png)

VSCode 确实会稍微麻烦一点，不过有个优势

就是新的 Copilot 的新功能都会优先上架 VSCode，比如 Copilot Voice 

![](https://img.wukaipeng.com/2024/04/12-212938-WOOCt5-12-212913-8ez2BA-image-20240412212912912.png)

在 VSCode 装一下这个插件 👇 就能体验**动嘴编程**

![](https://img.wukaipeng.com/2024/04/12-213107-dMajyo-image-20240412213107161.png)

虽然目前仅支持英文，但相信多语言很快会支持上

![Speech to text in Visual Studio Code Chat](https://img.wukaipeng.com/2024/04/12-213300-UPF36A-63279c01-3941-46c5-bf51-284fbc31fbfe.gif)

不过就算只支持英语，相信从小就开始学英语的中国开发者们，英语能力都非常好

![](https://img.wukaipeng.com/2024/04/12-213812-4hp6KE-R.jpeg)



## Copilot 代码补全

除了 Copilot 自动触发外，我们也可以使用 `Option` + `\` 去主动触发代码补全。

> Window 为 `Alt` + `\`

虽然主动快捷键比较少用到，但网络波动时可以测试下 Copilot。

触发代码补全后，按下 `Tab` 接受会接受全部的代码，但有时候我们只需要一部补全代码

可以使用 `Command` + → 去一步步接受补全代码：
> Windows 为 `Ctrl` + →

![](https://img.wukaipeng.com/2024/04/12-221048-rhh5pH-20240412221008_rec_-convert.gif)


如果对当前的补全代码不满意，可以按 `Option` + `]` 或者 `Option` + `[` 去切换下一个或者上一个补全代码：
> Windows 为 `Alt` + `]` 或者 `Alt` + `[`


![](https://img.wukaipeng.com/2024/04/12-221510-ZAlVae-20240412221442_rec_-convert.gif)


对于 VSCode 来说，按下 `Command` + `I` 代码中唤起 Copilot Editor：
> Windows 为 `Ctrl` + `I`

![](https://img.wukaipeng.com/2024/04/12-222404-6ICwrS-20240412222305_rec_-convert.gif)



## Copilot Chat 使用

Copilot Chat 相当于为编辑器直接配置一个 GPT-4，可以方便快速地快速问答项目问题：

![](https://img.wukaipeng.com/2024/04/12-222909-NjtEzI-image-20240412222909416.png)

对于 JetBrains IDEs，需要在文件右键显示引用： 

![](https://img.wukaipeng.com/2024/04/12-223012-8owLSw-image-20240412223012255.png)

JetBrains IDEs 目前比较笨，需要手动右键显式指明哪个文件，并且引用整个文件

而 VSCode 不需要显示指明，它会自行判断是引用文件全部，还是仅引用鼠标选中的：

![](https://img.wukaipeng.com/2024/04/12-223257-kmNJYr-image-20240412223257582.png)


## Copilot 的一些小幸福

再来说一下 Copilot 的一些痒点功能，比如直接生成 Commit Message：

![](https://img.wukaipeng.com/2024/04/12-223743-34Opnl-20240412223717_rec_-convert.gif)

生成 Git Commit 这点确实很方便，它会检测所有文件变更，并且生成合适的 Message。

另外是重命名变量，不过目前这个功能不太稳定，暂时略过。

## Copilot CLI

Copilot CLI 现在已经全面开放 Copilot CLI，可以在命令行中使用 Copilot。

比如我们可以让 copilot 解释 `sudo apt-get` 这条命令的意思：

![](https://img.wukaipeng.com/2024/04/12-225423-uOLDTd-image-20240412225423062.png)

不过目前 CLI 还是挺笨的，不如使用 Warp 的 AI 功能，参考之前文章 👉 

[好看好用 + 免费 AI 能力的终端工具，推荐 Warp！](https://mp.weixin.qq.com/s/l9IZeitz8zX7GjZFAR5xFg)



