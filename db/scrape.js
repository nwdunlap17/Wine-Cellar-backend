const fs = require('fs');
const puppeteer = require('puppeteer');


async function openTest(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    // await page.goto('https://www.totalwine.com/wine/red-wine/cabernet-sauvignon/caymus-cabernet/p/223968750?s=1411&igrules=true')
    // await scrapeWine(page, 'https://www.totalwine.com/wine/red-wine/cabernet-sauvignon/caymus-cabernet/p/223968750?s=1411&igrules=true');

    await crawlCatalogue(page, 'https://www.totalwine.com/c/000011?viewall=true&text=Cabernet%20Sauvignon&page=1&plppricevalue=-40-to-50')
    
    await browser.close();
}


async function crawlCatalogue(page, catalogueURL){
    await page.goto(catalogueURL);
    await page.waitFor(100);
    const data = await page.evaluate(() => {
    })
    // fs.writeFile('./scrapedata.txt',Object.keys(data).join(';') + '\n', (err) => {if(err){throw err;}})
    
    // fs.appendFile('./scrapedata.txt',Object.values(data).join(';') + '\n', (err) => {if(err){throw err;}})     
    return null;
}


async function scrapeWine(page, wineURL){
    await page.goto(wineURL);
    await page.waitFor(100);
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
    // fs.writeFile('./scrapedata.txt',Object.keys(data).join(';') + '\n', (err) => {if(err){throw err;}})
    
    // fs.appendFile('./scrapedata.txt',Object.values(data).join(';') + '\n', (err) => {if(err){throw err;}})     
    return null;
}

openTest();