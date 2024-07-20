# SEU-SIGMLSystem.github.io
- Tencent Meeting | Slides 后面加上视频链接[非公开]
- Presenter 后增加 facilitator
- Upcoming 修改
- Blogs修改
- 标题等对应不上的修改
- 讲者通过schedule.js自己更新
### 如何更新：
    git clone https://github.com/SEU-SIGMLSystem/SEU-SIGMLSystem.github.io.git
    cd SEU-SIGMLSystem.github.io.git
    # 创建自己的本地分支
    git checkout -b XXX
    # 在远程仓库中生成分支
    git push origin XXX
    # 绑定远程分支和本地分支
    git branch --set-upstream-to=origin/XXX XXX
    # 修改 schedules.js
    {
        "title":"CASSINI: Network-Aware Job Scheduling in Machine Learning Clusters",
        "conf":"NSDI'24",
        "presenter":"Botai Sun",
        "date":"July 18, 2024.",
        "time":"7:00 p.m.",
        "location":"Room CSxxx @ SEU & Online",
        "links":[
            {
                "title":"TencentMeeting",
                "url":"https://meeting.tencent.com/dm/RfNf0JCHCja7"
            },
            {
                "title":"Slides",
                "url":"/slides/2024-7-18.pdf"
            }
        ],
        "dblp":{
            "source":"DBLP",
            "url":"https://www.usenix.org/conference/nsdi24/presentation/rajasekaran"
        }
    },
    # 修改 index.html (line 60)
    <div class="description">Botai Sun will present an NSDI&#39;24 paper on 7:00 p.m., July 18, 2024. at Room CSxxx @ SEU &amp; Online.</div>
    git add index.html
    git add schedules.js
    git commit -m "update 2024.7.18 schedule"
    # 上传更新至远程仓库XXX分支
    git push origin XXX
    # 回到main分支
    git checkout main
    git merge XXX
    git push origin main
    # 删除远程与本地分支
    git push origin --delete XXX
    git branch -D xxx
    # 查看远程与本地分支
    git branch -a