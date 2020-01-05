const fs = require('fs');
const puppeteer = require('puppeteer');


async function openTest(textByLine){
    const browser = await puppeteer.launch({headless: true});
    
    let count = 0
    console.log(textByLine.length)
    

    // let testpage = await browser.newPage();
    // await scrapeWine(testpage,textByLine[1])

    while(count < textByLine.length){
        let page = await browser.newPage();
        await scrapeWine(page,textByLine[count])
        count++;
    }
    
    await browser.close();
}

async function scrapeWine(page, wineURL){
    await page.goto(wineURL);
    await page.waitFor(100);
    const data = await page.evaluate(() => {
        let factors = ['name','year','BRAND','COUNTRY / STATE','REGION','WINE TYPE','APPELLATION','WINE TYPE','VARIETAL','STYLE','TASTE','BODY','SKU','price']
        let result = {}
            factors.forEach(key => {
            result[key] = 'nil'
        })

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
        while(i < detailsTable.childNodes.length){
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
    
    let factors = ['name','year','BRAND','COUNTRY / STATE','REGION','WINE TYPE','APPELLATION','WINE TYPE','VARIETAL','STYLE','TASTE','BODY','SKU','price']
    let string = ''
    let counter = 0
    while(counter < factors.length){
        string += `${data[factors[counter]]};`
        counter++;
    }

    fs.appendFile('./winelist.txt',string + '\n', (err) => {if(err){throw err;}})     
    // fs.appendFile('./winelist.txt',Object.values(data).join(';') + '\n', (err) => {if(err){throw err;}})     
    return null;

}

function defualtResult(){
    let factors = ['name','year','BRAND','COUNTRY / STATE','REGION','WINE TYPE','APPELLATION','WINE TYPE','VARIETAL','STYLE','TASTE','BODY','SKU','price']
    let result = {}
    factors.forEach(key => {
        result[key] = 'nil'
    })
    return result;
}

const textByLine = fs.readFileSync('scrapeurls.txt').toString().split("\n");
fs.writeFile('./winelist.txt','name;year;brand;country/state;region;Wine Type;Varietal;Style;Taste;Body;SKU\n', (err) => {if(err){throw err;}})     
openTest(textByLine);