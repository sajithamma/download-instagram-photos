const puppeteer = require('puppeteer');
var fs = require('fs');
var request = require('request');
const firebase = require("firebase");

const firebaseConfig = {
    apiKey: "AIzaSyCDr9X1wMofJhXuDuE_VMgTzbIgWym7Nwk",
    authDomain: "ecstatic-emblem-315808.firebaseapp.com",
    projectId: "ecstatic-emblem-315808",
    storageBucket: "ecstatic-emblem-315808.appspot.com",
    messagingSenderId: "382240764822",
    appId: "1:382240764822:web:c8fc79457719d914f8a3b7",
    databaseURL: "https://ecstatic-emblem-315808-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

db.collection("users").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
})
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });




var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

var crypto = require('crypto');

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

    callback: (result) => {

        //console.info(result)

        result.forEach(function (item) {

            var filename = crypto.createHash('md5').update(item).digest('hex');
            download(item, filename + ".jpg", () => { });


        });





    },

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

        await browser.close();


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

