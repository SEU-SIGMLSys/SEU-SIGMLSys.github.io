# SEU-SIGMLSystem.github.io

## 如何更新：

    git clone https://github.com/SEU-SIGMLSystem/SEU-SIGMLSystem.github.io.git
    cd SEU-SIGMLSystem.github.io.git
    (or: git pull origin main)

### git绑定账户
windows用户有图形界面可以忽略这一步

    git config --global user.name "yourname"
    git config --global user.email "youremail"
    # 若需要输入passwd，则需要使用生成的token而不是github密码

### 创建自己的本地分支

    git checkout -b XXX

### 在远程仓库中生成分支

    git push origin XXX

### 绑定远程分支和本地分支

    git branch --set-upstream-to=origin/XXX XXX

### 修改 schedules.js(schedules以及upcoming_schedules)
将上一周的schedule从upcoming_schedules移动至schedules，并将自己的schedule按以下格式保存至upcoming_schedules：

    {
        "title":"...",
        "conf":"...",
        "presenter":"...",
        "facilitator":"...",
        "date":"...",
        "time":"...",
        "location":"...",
        "links":[
            {
                "title":"TencentMeeting",
                "url":"..."
            },
            {
                "title":"Slides",
                "url":"/slides/..."
            },
            {
                "title":"Videos",
                "url":"http://10.201.0.220:8099"
            }
        ],
        "dblp":{
            "source":"DBLP",
            "url":"..."
        }
    },

### 修改 index.html (line 60)

    `<div class="description">`... will present an ... paper on ..., ... at ... .`</div>`

### 上传更新至XXX分支

    git add index.html
    git add schedules.js
    git add slides
    git commit -m "update ... schedule"
    git push origin XXX

### 在github界面实现pull requests申请，由管理员审批通过后完成merge

### 查看远程与本地分支

    git branch -a

### 删除远程与本地分支

    git checkout main
    git push origin --delete XXX
    git branch -D xxx

### (Optional)本地部署
如果有需要查看修改效果，可以进行本地部署。由于大部分浏览器不允许直接打开index.html，因此需要下载node.js
- 首先，下载并安装[node.js](https://nodejs.org/zh-cn)
- 之后进入SEU-SIGMLSys.github.io文件夹，并下载vite
    
        cd SEU-SIGMLSys.github.io
        npm install vite
        # 若存在网络问题，可使用镜像源：
        npm config set registry https://registry.npmmirror.com
- 最后，在当前页面使用vite并进入浏览器

        npx vite # http://localhost:5173/

### (Optional)设置代理
为了解决git pull/push TimeOut的问题，可以为git设置代理：

        git config --global http.proxy "http://127.0.0.1:port" 
        git config --global https.proxy "http://127.0.0.1:port" # 端口设置因人而异
        git config --global --list #查看配置情况
