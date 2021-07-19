require('dotenv').config(); 
const fs = require('fs');
const path = require('path');

const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const server = express();

server.use(cors());

const PORT = process.env.PORT || 3333;

server.get('/', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle0' });

  await page.type('[name="username"]', process.env.INSTAGRAM_USER);
  await page.type('[name="password"]', process.env.INSTAGRAM_PASSWORD);

  await Promise.all([
    page.click('[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  await page.goto('https://instagram.com/rocketseat_oficial');

  const imgList = await page.evaluate(() => {
    // toda essa função será executada no browser

    // vamos pegar todas as imagens que estão na parte de posts
    const nodeList = document.querySelectorAll('article img')
    // transformar o NodeList em array
    const imgArray = [...nodeList]

    // transformar os nodes (elementos HTMl) em objetos JS
    const imgList = imgArray.map( ({src}) => ({
      src
    }))

    // colocar para fora de função
    return imgList
  })

  // escrever os dados em um arquivo local (json)
  fs.writeFile('instagram.json', JSON.stringify(imgList, null, 2), err => {
    if (err) throw new Error('something went wrong')

    console.log('well done')
  })

  // await browser.close();

});

server.listen(PORT, () => {
  console.log('Servidor rodando com sucesso na porta 3333')
});