const puppeteer = require('puppeteer');
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const url = 'https://www.amazon.in/Dell-Latitude-3410-Windows10Pro-Fingerprint/dp/B08LKGTT23/';

puppeteer.launch({
    headless:false
}).then(async browser => {
    const page = await browser.newPage();
  /* going to particular url */
    await page.goto(url); //priceblock_ourprice
   await  page.waitForSelector('#priceblock_ourprice')
   
   /* fetching the total count of corona cases */
        const price = await page.evaluate(()=>{
        //    const list=  document.querySelectorAll('#priceblock_ourprice').innerText;
        const list=  document.querySelector('#priceblock_ourprice').innerHTML
        let currentPrice = Number(list.replace(/[^0-9.-]+/g,""));
            //  return list.replace('&nbsp;','').slice(1,10);
         
            return currentPrice;
        });
        if(price <= 94000){
            console.log("WOW! IT'S TIME TO BUY", price)
        }
      
        console.log("price",price)
        async function startTracking() {
            const page = await configureBrowser();
          
            let job = new CronJob('* */30 * * * *', function() { //runs every 30 minutes in this config
              price();
            }, null, true, null, null, true);
            job.start();
        }

      

         /* closing browser after completion */
        // await browser.close()
})