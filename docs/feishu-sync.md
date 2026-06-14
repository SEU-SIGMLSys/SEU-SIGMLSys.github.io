# 飞书表格本地同步

这个仓库可以用本地命令从飞书多维表格生成 `schedules.js`：

```powershell
npm run sync:feishu
```

## 同步规则

默认模式不会把飞书表格当成完整历史库，所以不会清空仓库里原有的历史组会记录。

脚本会先读取仓库现有的 `schedules.js` 和飞书表格里的有效记录，再按「组会汇报时间」判断记录位置：

- 只有「组会汇报时间」还没到、并且尚未存在于历史 `schedules` 中的记录，才会进入 `upcoming_schedules`
- 如果有多条未来记录，时间最近的一批写入 `upcoming_schedules`；同一时间有多篇报告时会一起展示
- 已经过期的飞书记录会合并进历史 `schedules`
- 仓库里已有的历史 `schedules` 会继续保留
- 如果同一条历史记录已经存在，默认保留仓库里的版本，避免飞书记录重复写入历史

如果 `ppt` / `Slides` 列是飞书附件，脚本会把附件下载到仓库的 `slides/` 目录，并在 `schedules.js` 里写成 `/slides/文件名` 这样的站内链接，建议附件使用 PDF。下载附件需要飞书应用开通媒体下载相关权限，例如 `docs:document.media:download` 或 `drive:drive:readonly`。如果权限不足，脚本会失败退出，避免把需要鉴权的 `open-apis/drive/.../download` 链接写进公开网页。

如果某一天飞书表格已经包含完整历史数据，可以改用完整覆盖模式：

```powershell
npm run sync:feishu -- --replace-all
```

如果完整覆盖后的记录数比现有 `schedules.js` 少，脚本会拒绝写入。确认要覆盖时再加：

```powershell
npm run sync:feishu -- --replace-all --allow-shrink
```

## 首次配置

复制本地密钥模板：

```powershell
Copy-Item .env.local.example .env.local
```

填写 `.env.local`：

```text
FEISHU_APP_ID=cli_xxxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

`.env.local` 已经被 `.gitignore` 忽略，不会提交到 GitHub。

脚本默认读取当前 Base 链接里的 `app_token`、`table_id` 和 `view_id`。如果以后换表，可以在 `.env.local` 里覆盖：

```text
FEISHU_APP_TOKEN=RXITbTzFMaBblzsdETXcuqkNnTb
FEISHU_TABLE_ID=tblrVI06ls9biJoA
FEISHU_VIEW_ID=vew63l2LQh
```

## 使用方式

先试跑，不改文件：

```powershell
npm run sync:feishu -- --dry-run
```

确认能读到数据后，正式更新：

```powershell
npm run sync:feishu
```

然后按正常网站流程提交：

```powershell
git status
git add schedules.js index.html package.json scripts/sync-feishu.js .gitignore .env.local.example docs/feishu-sync.md
git commit -m "add feishu schedule sync"
git push origin <your-branch>
```

## 推荐列名

按照现在网站的 `schedules.js` 信息，飞书表格建议使用下面这些中文列名。

必填列：

- `论文标题`：论文完整标题，对应网站里的 `title`
- `会议/期刊`：例如 `NSDI'26`、`SOSP'25`，对应 `conf`
- `汇报人`：组会上讲这篇论文的人，对应 `presenter`，建议填写英文名
- `组会汇报时间`：建议用飞书「日期」字段，包含日期和具体时间；脚本会用这一列判断哪条是 upcoming

建议填写列：

- `地点`：例如 `Room ARTS1021 @ SEU & Online`，不填会用默认地点
- `腾讯会议`：腾讯会议链接，会显示成 `TencentMeeting`
- `论文链接`：论文 PDF、arXiv、DOI、DBLP 或官网链接，会显示在详情里
- `ppt`：组会 slides 链接或飞书附件；如果填飞书附件，脚本会下载到 `slides/` 并改写为 `/slides/文件名`
- `录屏`：视频或回放链接，会显示成 `Videos`

可选管理列：

- `隐藏`：填 `是`、`true`、`skip` 等值时，这条记录不会同步
- `论文来源`：默认是 `website`，一般可以不填

可以保留但脚本暂时不使用的列：

- `主持人`：网站里的 `facilitator` 由仓库的 `schedules.js` 手动维护，脚本不会从飞书读取
- `作者`：现在网站页面没有展示作者字段，所以脚本会忽略这一列

如果飞书里已经有中文姓名，可以在 `scripts/sync-feishu.js` 的 `nameAliases` 里添加映射，让输出到网站的 `presenter` 保持英文。
