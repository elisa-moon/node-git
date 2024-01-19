// 两个写法初探，二选一执行。在git bash执行脚本，测试可以在git clone成功（注意环境变量及脚本运行环境、权限）
const { exec, spawn } = require('child_process');

// 写法1： 异步触发，--depth 1是为了快速拿到这个git结果，当前数据使能全部拿到的 
exec('git clone --depth 1 http://gitlab.ln.ad/dsm/dsm_frontend.git type1', { stdio: 'inherit' }, (error, stdout, stderr) => {
    if (error) {
        console.error(`执行出错: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});


// 写法2：测试阶段需要查看命令执行进度
const repoUrl = 'http://gitlab.ln.ad/dsm/dsm_frontend.git';
const targetDirectory = 'type2';
const gitCloneProcess = spawn('git', ['clone', '--depth', '1', repoUrl, targetDirectory]);
gitCloneProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});
gitCloneProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

gitCloneProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
