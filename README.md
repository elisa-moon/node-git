# node-git
通过执行node shell操作获取不同分支的内容示例

###  this is a demo

### Usage

####  运行前准备

#####  1、生成测试仓，就是远程仓库(相当于swagger所在的那个gitlab.ln.com/dsm/dsm_frontend,没注意这里输错没)

```js
mkdir source-gitlab
cd source-gitlab
git init 

 // 提交几次,供后面切换使用 
echo 'first' > first.txt 
git add .
git commit -m 'first commit'

echo 'second' > first.txt
git add .
git commit -m 'second commit'

echo 'caohui' > first.txt 
git add .
git commit -m 'caohui commit'
```

##### 2、运行就能看到结果

```js
node demo dev
node demo master
```


###  demo运行环境
git bash（git bash提供的是类unit端，linux环境也可，不要windows cmd）


####   和目标代码的差别是什么？
#####  demo使用了简易的本地源仓库测试数据，目标代码获取的是gitlab源服务器的仓库数据，但demo代码仓库中也包含对远程仓dsm_frontend的clone实现

把 ./source-gitlab 克隆到 ./dest-gitlab (demo.js同级)。到时候读取dest-gitlab仓库里first.txt文件内容的变化

(ps：克隆是支持本地克隆的，不仅是从github, gitlab, 也可以从计算机的共享文件里克隆其他同事的更新代码，无需经过其他服务器的远程仓库， git clone source dest中的source就是origin的默认地址，origin仅仅是一个默认的本地仓库名称，通过git remote add caohui <repoUrl>也可以改名/添加仓库caohui，之后执行更新就是git pull caohui dev表示拉取caohui仓库的dev分支)

使用本地仓库测试是为了测试方便，不用操作dsm_frontend仓库，且demo功能的基础路径是完善的，另fetch-gitlab.js文件已经最低实现了git clone dsm_frontend成功，只需替换clone和pull的地址即可，最多有少许自行调试

![1705669205181](https://github.com/elisa-moon/node-git/assets/75383505/a6b37752-3bf7-4d13-934c-26c4335a9b5f)
