# download-instagram-photos
## Grab instagram photos from any profile url (For entertainment / demo purpose only)

## Screenshot
![alt Screenshot](/screenshot.gif)

## How to run

Run the following command to download images from https://www.instagram.com/sajithamma

```bash
npm install
node index.js

```

## Technologies Used

- puppeteer
- axios 
- node-html-parser

## Coding Basics

```javascript

 browser = await puppeteer.launch(
            {
                headless: true,
                args: ["--disable-setuid-sandbox"],
                'ignoreHTTPSErrors': true,
            });

```

### Use auto scroll to load more images

```javascript

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

```
### Write the scrppable object logic

```javascript

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

```

### finally call the function

```javascript

startScrapping(browserInstance, InstaScraperLogicObject);


```