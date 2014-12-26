function Tool() {
    
}

Tool.isInteger = function (mixed_var) {
    return mixed_var === +mixed_var && isFinite(mixed_var) && !(mixed_var % 1);
};

Tool.isString = function (mixed_var) {
    return (typeof mixed_var === 'string');
};

Tool.isDate = function (mixed_var) {
    return (mixed_var instanceof Date);
};

Tool.isValidePassword = function (str) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,20}$/.test(str);
};

Tool.bytesToSize = function (bytes) {
   if(bytes == 0) return '0 Byte';
   var k = 1024;
   var sizes = ['Bytes/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

module.exports = Tool;
