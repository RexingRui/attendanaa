let fs = require('fs');

function moveFile(oldPath, newPath) {
  // 获取目录名
  var a = {a: 1};
  fs.rename(oldPath, newPath, (err) => {
    if (err) throw err;

    console.log('移动完成');
  });
}

export default moveFile;