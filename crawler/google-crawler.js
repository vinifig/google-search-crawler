const { formatFilePath } = require('../misc/utils');
const GenericCrawler = require('./generic-crawler');
const googleURL = 'https://www.google.com.br';
const searchPath = `/search?q=`;

/**
 * Google Crawler Class
 */
class GoogleCrawler extends GenericCrawler {
    
    /**
     * Google Crawler Constructor
     * @param {*} browser - Puppeteer browser entity
     */
    constructor (browser, screenshotBasePath = 'screenshots/google') {
        super(browser, screenshotBasePath);
    }

    /**
     * 
     * @param {string} endpoint - Google Endpoint to Acesss
     */
    async getNewPage (endpoint = '') {
        let url = `${googleURL}${endpoint}`;
        let page = await super.getNewPage(url);
        return page;
    }

    async parseLinks (page) {
        const listSelector = '#res[role=main] #search';
        const linksSelector = `${listSelector} #ires .srg > .g .rc .r a`;

        let result = await page.evaluate ((linksSelector) => {
            let DOMList = document.querySelectorAll(linksSelector);
            let DOMArray = Object.values(DOMList);
            let results = DOMArray
                .map((element) => {
                    if (!element) {
                        return null;
                    }
                    
                    let {href, innerText} = element;
                    
                    return {
                        href,
                        title: innerText
                    };
                })
                .filter(item => !!item);
            
            return results;
        }, linksSelector);

        return result;
    }

    async search ({terms = '', pictureConfig = {}} = {}) {
        let searchEndpoint = `${searchPath}${terms}`;
        let page = await this.getNewPage(searchEndpoint);
        
        let result = {
            links: [],
            picture: null
        };

        if (pictureConfig.enabled) {
            let path = `${this.screenshotBasePath}/${searchEndpoint}.jpg`;
            result.picture = await this.takePictureOfPage({
                page,
                path
            });
        }

        let links = await this.parseLinks(page);
        
        result.links = links;

        // await page.close();
        return result;

    }

    /**
     * 
     * @param {*} config - Endpoint to take a picture of google and path to exports
     */
    async takePicture ({endpoint = '', path = `${this.screenshotBasePath}/google.jpg`} = {}) {
        let page = await this.getNewPage(endpoint);
        let screenshot = await this.takePictureOfPage({page, path});
        
        await page.close();
        return screenshot;
    }
}

module.exports = GoogleCrawler;