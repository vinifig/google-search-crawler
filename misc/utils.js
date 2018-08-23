class Utils {
    static formatFilePath (uri = '') {
        return uri.replace(/[ \|:;\?=\\]/g, '_').replace('__','_').trim().toLowerCase();
    }

    static formatFileName (fileName = '') {
        return fileName.replace(/[ \/\\]/g, '_');
    }
}

module.exports = Utils;
