// 两个写法初探。在git bash执行脚本，测试可以在git clone成功（注意环境变量及脚本运行环境、权限）
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs/promises');


// 在本地仓库创建source-gitlab仓库，做开发测试
const execAsync = promisify(exec);
const projectUrl = path.resolve(__dirname, './source-gitlab');// 'http://@gitlab.ln.ad/dsm/dsm_frontend.git';
const projectDirName = 'dest-gitlab';// 'depth1';
const args = process.argv.slice(2);
const mainBranch = 'master';
const destinyBranch = args?.[0];
const absLocalPro = path.resolve(__dirname, projectDirName);

async function clone(branch) {
    try {
        const { stdout, stderr } = await execAsync(`git clone ${projectUrl} ${projectDirName} -b ${branch}`);
        console.log('克隆成功');
        console.log(`克隆stdout: ${stdout}`);
        console.error(`克隆stderr: ${stderr}`);
        return true;
    } catch (error) {
        console.error(`克隆执行出错: ${error.message}`);
        return false;
    }
}

async function pull(branch) {
    try {
        const { stdout, stderr } = await execAsync(`git pull origin ${branch}`);
        console.log(`拉取分支${branch}成功`);
        console.log(`拉取分支${branch}stdout: ${stdout}`);
        console.error(`拉取分支${branch}stderr: ${stderr}`);
        return true;
    } catch (error) {
        console.error(`拉取分支${branch}执行出错: ${error.message}`);
        return false;
    }
}

async function changeBranch(branch) {
    try {
        process.chdir(absLocalPro);
        const { stdout, stderr } = await execAsync(`git checkout ${branch}`);
        console.log(`切换${branch}分支成功 ${projectDirName}`);
        console.log(`切换${branch}分支stdout: ${stdout}`);
        console.error(`切换${branch}分支stderr: ${stderr}`);
        return true;
    } catch (error) {
        console.error(`切换${branch}分支执行出错: ${error.message}`);
        return false;
    }
}

async function proExit() {
    let exit = false;
    try {
        const stats = await fs.stat(path.resolve(__dirname, projectDirName));
        if (stats.isDirectory()) {
            exit = true;
            console.log(`${projectDirName}是一个目录`);
        } else {
            console.log(`${projectDirName}不是一个目录`);
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('目录不存在');
        } else {
            console.error(`获取目录信息出错: ${err.message}`);
        }
    } finally {
        return exit;
    }
}

async function getCurrentGitBranch() {
    process.chdir(absLocalPro);
    return new Promise((resolve, reject) => {
        exec('git rev-parse --abbrev-ref HEAD', (error, stdout, stderr) => {
            if (error) {
                reject(`执行出错: ${error.message}`);
                return;
            }
            const branchName = stdout.trim();
            resolve(branchName);
            console.log('当前分支', branchName);
        });
    });
}

async function readTxtFile(branch) {
    try {
        const content = await fs.readFile(`${absLocalPro}/first.txt`, 'utf-8');
        console.log(`读取${branch}分支文件内容: ${content}`);
        return content;
    } catch (error) {
        console.error(`读取${branch}分支文件出错: ${error.message}`);
        throw error; // 重新抛出错误，以便上层代码处理
    }
}

// 判断git仓库上任意分支的内容(以first.txt为例)是否切换成功
async function flow() {
    console.log('判断git仓库上任意分支的内容(以first.txt为例)是否切换成功');
    let curBranch;
    const exit = await proExit();
    let isContinue = true;
    if (!exit) {
        console.log('项目不存在，就克隆下');
        isContinue = await clone(destinyBranch ?? mainBranch);
    } else {
        curBranch = await getCurrentGitBranch();
        if (destinyBranch && curBranch !== destinyBranch) {
            console.log('需要切换分支');
            isContinue = await changeBranch(destinyBranch);
        }
        isContinue = await pull(destinyBranch);
    }
    if (!isContinue) return;
    curBranch = await getCurrentGitBranch();
    readTxtFile(curBranch);
}

flow();



