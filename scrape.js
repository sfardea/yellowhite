
const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

let url = 'https://www.pagesjaunes.fr/pagesblanches/recherche?quoiqui=cohen&ou=Paris%20%2875%29&idOu=L07505600&proximite=0&quoiQuiInterprete=cohen&contexte=hKOoKTJEpiIyUY/qF5a4%2Bw%3D%3D&page=10';

let scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  
  await page.goto(url, { 
    waitUntil: 'domcontentloaded' 
  });

  const results = await page.evaluate(() => {
    
    let data = [];
    
    let elements = document.querySelectorAll('article');

    for (element of elements) {
      
      let name = element.childNodes[3].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[3].innerText;
      let adress = element.childNodes[3].childNodes[3].childNodes[3].childNodes[1].innerText;
	  	
      data.push({ 
        'name': name, 
        'adress': adress 
      });
    }

  return data;
  });

  // Scrape
  browser.close();
  
  return results;
};

scrape().then((value) => {
  app.get('/', (req, res) => res.send(value));
});

app.listen(3200);