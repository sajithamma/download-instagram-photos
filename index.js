const puppeteer = require('puppeteer');

//Browser Launch Promise
let browserInstance = startBrowser();

async function startBrowser() {

    let browser;
    try {

        console.log('opening browser...');

        browser = await puppeteer.launch(
            {
                headless: true,
                args: ["--disable-setuid-sandbox"],
                'ignoreHTTPSErrors': true,
            });

        return browser;

    } catch (err) { console.log('Could not create browser instance', err) }
}



async function startScrapping(browserInstance, scraperLogicObject) {
    let browser;
    try {
        //Execute the promise and get the instance
        browser = await browserInstance;
        await scraperLogicObject.scraper(browser);

    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 300;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}


//Create a scrapper object with instagram logic
const InstaScraperLogicObject = {

    url: 'https://www.instagram.com/sajithamma',

    callback: (result) => { console.log(result) },

    async scraper(browser) {

        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page
        await page.goto(this.url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('article');
        // Get the link to all the required books


        const getImgSrc = await page.$$eval('article img', imgs => imgs.map(img => img.src));
        this.callback(getImgSrc);


    }
}

//Create a scrapper object with instagram logic
const TwitterScraperLogicObject = {

    url: 'https://twitter.com/jondishotsky?lang=en',

    callback: (result) => { console.log(result) },

    async scraper(browser) {

        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page
        await page.goto(this.url);

        await page.setViewport({
            width: 1200,
            height: 800
        });

        await autoScroll(page);

        // Wait for the required DOM to be rendered
        await page.waitForSelector('[data-testid*="tweetText"]');
        // Get the link to all the required books


        const getImgSrc = await page.$$eval('[data-testid*="tweetText"]', articles => articles.map(article => article.innerText));
        this.callback(getImgSrc);


    }
}



// Pass the browser instance to the scraper controller
//startScrapping(browserInstance, TwitterScraperLogicObject);

startScrapping(browserInstance, InstaScraperLogicObject);