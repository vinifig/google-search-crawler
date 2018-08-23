const fs = require('fs');
const puppeteer = require('puppeteer');
const { GoogleCrawler, GenericCrawler } = require('./crawler');
const { formatFilePath, formatFileName } = require('./misc/utils');

const screenshotsFolder = './screenshots';
const googleScreenShotsFolder = `${screenshotsFolder}/google`;
const googleSearchFolder = `${screenshotsFolder}/google-search`;
const terms = process.argv.slice(2).join(' ') || 'Nodejs puppeteer crawler';

function createFolderIfNotExists (folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
}

async function getPicturesOfSearchResult ({links = []} = {}) {
    const browser = await puppeteer.launch();
    let screenshotBasePath = formatFilePath(`${googleSearchFolder}/${terms}`);
    createFolderIfNotExists(screenshotBasePath);
    const genericCrawler = new GenericCrawler(browser, screenshotBasePath);
    for (let link of links) {
        let endpoint = link.href;
        let title = formatFileName(link.title.substring(0, 20));
        let path = `${screenshotBasePath}/${title}.jpg`
        await genericCrawler.takePicture({endpoint, path})
    }

    await browser.close();
}

async function startAsync() {
    const browser = await puppeteer.launch();
    let googleCrawler = new GoogleCrawler(browser);

    
    // screenshot example
    let screenshot = await googleCrawler.takePicture();
    
    // crawler config example
    let pictureConfig = {
        enabled: true
    }

    let search = await googleCrawler.search({terms, pictureConfig});
    
    await browser.close();
    
    await getPicturesOfSearchResult(search);
    console.log(search);
}

async function startParallel() {
    // running process in parallel example
    const browser = await puppeteer.launch();
    let googleCrawler = new GoogleCrawler(browser);

    
    // screenshot example
    let screenshotResult = googleCrawler.takePicture();
    
    // crawler config example
    let terms = 'Nodejs puppeteer crawler';
    let pictureConfig = {
        enabled: true
    }
    let searchResult = googleCrawler.search({terms, pictureConfig});

    let [screenshot, search] = await Promise.all([screenshotResult, searchResult]);

    console.log(search);

    return await browser.close();
}

async function start () {
    // await startParallel();
    createFolderIfNotExists(screenshotsFolder);
    createFolderIfNotExists(googleScreenShotsFolder);
    createFolderIfNotExists(googleSearchFolder);
    await startAsync();
}

start()
