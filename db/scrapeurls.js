const fs = require('fs');
const puppeteer = require('puppeteer');


async function openTest(){
    // fs.writeFile('./scrapedata.txt',Object.keys(data).join(';') + '\n', (err) => {if(err){throw err;}})
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await crawlCatalogue(page, 'https://www.totalwine.com/c/000011?viewall=true&text=Cabernet%20Sauvignon&page=1&plppricevalue=-40-to-50')
    
    await browser.close();
}


async function crawlCatalogue(page, catalogueURL){
    
    await page.goto(catalogueURL);
    await page.waitFor(300);

    let needToLoadMore = true

    while(needToLoadMore === true){
        needToLoadMore = await page.evaluate(async () => {
            let foo = document.querySelector('#searchPageContainer > div:nth-child(2) > div.pagination__1UO20___ > button') !== null    ;
            return foo;
        })
        // console.log(foo);
        if(needToLoadMore){
            await page.click('#searchPageContainer > div:nth-child(2) > div.pagination__1UO20___ > button');
            await page.waitFor(300)
        }
    }

    
    const WineUrls = await page.evaluate(() => {
        let urls = []
        let list = document.querySelector('.grid__2sELY16y');
        list.childNodes.forEach(card => {
            urls.push("https://www.totalwine.com/" + card.childNodes[1].firstChild.firstChild.getAttribute("href"));
        })
        return urls;
    })
    console.log('got Wine URLS')
    WineUrls.forEach(async (url) => {
        fs.appendFile('./scrapeurls.txt',url+'\n', (err) => {if(err){throw err;}}) 
    })
    return null;
}

async function scrapeWine(page, wineURL){
    await page.goto(wineURL);
    await page.waitFor(300);
    const data = await page.evaluate(() => {
        let result = {}

        let nameYear = document.querySelector('.productTitle__3XDd9UVh').innerText;
        let name = nameYear.split(", ")[0]
        let year = nameYear.split(", ")[1]
        result.name = name;
        result.year = year;

        let detailsTable = document.querySelector('.detailsTableProductInfo__2_nFoPxO');
        let currentChild = detailsTable.childNodes;

        let child = detailsTable.firstChild;
        let key = child.childNodes[0].innerText;
        let value = child.childNodes[1].firstChild.innerText;
        result[key] = value

        let i = 1;
        while(i < 9){
            let child = detailsTable.childNodes[i];
            let key = child.childNodes[0].innerText;
            let value = child.childNodes[1].innerText;
            result[key] = value
            i++;
        }
        
        let priceValue = document.getElementById('edlpPrice').innerText;
        result['price'] = priceValue

        return result
    })
    
    
    fs.appendFile('./scrapedata.txt',Object.values(data).join(';') + '\n', (err) => {if(err){throw err;}})     
    return null;
}

fs.writeFile('./scrapeurls.txt','', (err) => {if(err){throw err;}})     
openTest();