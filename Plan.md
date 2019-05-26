# 軟實 Final Project 計畫

## Game Flow 遊戲流程

整體遊戲相關進程，根據 Phaser 特性([State](https://photonstorm.github.io/phaser-ce/Phaser.State.html))來定義遊戲進程。

### High Risk 高風險

必須要有的東西

| Game State 遊戲階段 | Content 階段內容                | Developer 開發者 |
| ----------------- | ----------------------------- | --------------- |
| Menu              | 開始頁面的圖像、Position、UI 設計  |                 |
| Tutorial          | 設計教學頁面，page 設計           |                 |
| MainGame          | 主要遊戲內容，定義了全部遊戲邏輯      |                 |
| EndGameMenu       | 結束頁面的圖像、Position、UI 設計   |                |

### High Value 高價值

做了應該會更乾淨的東西

| Game State 遊戲階段 | Content 階段內容                                  | Developer 開發者 |
| ----------------- | ----------------------------------------------- | --------------- |
| Pause Menu        | 暫停畫面直接切出去一個 State, 要做 State 間資訊紀錄和轉移 ||

## 相關文件連結

- [Phaser CE 官方文件](https://photonstorm.github.io/phaser-ce/)
- [Git 常用指令文件](http://gitqwerty777.github.io/git-commands/)