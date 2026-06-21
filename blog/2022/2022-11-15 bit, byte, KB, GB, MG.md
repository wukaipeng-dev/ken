---
slug: bit-byte-kb-gb-mb
date: 2022-11-15
title: bit, byte, KB, GB, MG, TB, PB
authors: wukaipeng
---

1bit 是计算机中最小的数据单位，1bit 就对应一个高低电位。

在计算机上下文中，各单位的换算关系如下：

$$$
1bit \times 8 = 1byte
$$$


$$$
1byte \times 1024 = 1KB (kilobyte)
$$$


$$$
1KB \times 1024 = 1MB (megabyte)
$$$

$$$
1MB \times 1024 = 1GB (gigabyte)
$$$

$$$
1GB \times 1024 = 1TB (terabyte)
$$$

$$$
1TB \times 1024 = 1PB (petabyte)
$$$

:::warning
在十进制或者国际单位制中，会用 1000 作为进率，而不是 1024。注意区分上下文。
:::

---

在 UTF-8 编码中

1. 一个 US-ASCII 字符只需要 1byte
2. 带有变音符号的拉丁文、希腊文、西里尔字母、亚美尼亚语、希伯来文、阿拉伯文、叙利亚文等字符需要 2byte
3. 其他语言（包括中日韩文字、东南亚文字、中东文字等）使用 3byte
4. 极少数语言用 4byte



