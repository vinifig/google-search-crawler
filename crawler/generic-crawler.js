const { formatFilePath } = require('../misc/utils');

/**
 * Generic Crawler Class
 */
class GenericCrawler {
    
    /**
     * Genereic Crawler Constructor
     * @param {*} browser - Puppeteer browser entity
     */
    constructor (browser, screenshotBasePath = 'screenshots/generic') {
        this.screenshotBasePath = screenshotBasePath;
        this.browser = browser;
    }

    /**
     * 
     * @param {string} endpoint - Generic page Endpoint to Acesss
     */
    async getNewPage (endpoint = '') {
        let page = await this.browser.newPage();
        page.goto(endpoint);
        await page.waitForNavigation();
        return page;
    }

    async takePictureOfPage ({page, path}) {
        
        let screenshot = await page.screenshot({
            path: formatFilePath(path)
        });
    }

    /**
     * 
     * @param {*} config - Endpoint to take a picture of page and path to exports
     */
    async takePicture ({endpoint = '', path = `${this.screenshotBasePath}/genericScreenshot.jpg`} = {}) {
        let page = await this.getNewPage(endpoint);
        let screenshot = await this.takePictureOfPage({page, path});
        await page.close();
        return screenshot;
    }
}

module.exports = GenericCrawler;