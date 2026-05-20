# 飞书表格本地同步

这个仓库可以用本地命令从飞书多维表格生成 `schedules.js`：

```powershell
npm run sync:feishu
```

## 同步规则

默认模式不会把飞书表格当成完整历史库，所以不会清空仓库里原有的历史组会记录。

脚本会先读取飞书表格里的有效记录，再按「组会汇报时间」排序：

- 时间最新的一条写入 `upcoming_schedules`
- 其他飞书记录合并进历史 `schedules`
- 仓库里已有的历史 `schedules` 会继续保留
- 如果同一条记录已经存在，会用飞书里的版本更新它，避免重复

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
- `汇报人`：组会上讲这篇论文的人，对应 `presenter`
- `组会汇报时间`：建议用飞书「日期」字段，包含日期和具体时间；脚本会用这一列判断哪条是 upcoming

建议填写列：

- `主持人`：对应 `facilitator`，没有就留空
- `地点`：例如 `Room ARTS1021 @ SEU & Online`，不填会用默认地点
- `腾讯会议`：腾讯会议链接，会显示成 `TencentMeeting`
- `论文链接`：论文 PDF、arXiv、DOI、DBLP 或官网链接，会显示在详情里
- `ppt`：组会 slides 链接；如果已经上传到仓库，可以填 `/slides/xxx.pdf`
- `录屏`：视频或回放链接，会显示成 `Videos`

可选管理列：

- `隐藏`：填 `是`、`true`、`skip` 等值时，这条记录不会同步
- `论文来源`：默认是 `website`，一般可以不填

可以保留但脚本暂时不使用的列：

- `作者`：现在网站页面没有展示作者字段，所以脚本会忽略这一列
