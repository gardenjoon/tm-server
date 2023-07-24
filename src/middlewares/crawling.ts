import { load } from "cheerio";
import request from "request";
import puppeteer, { TimeoutError } from "puppeteer";

export const crawler = async (id: string) => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],

        });
        const page = await browser.newPage();

        const url = `https://place.map.kakao.com/${id}`;

        let ulList = [];
        await page.goto(url);
        await page.waitForSelector('div.cont_menu ul.list_menu li', {timeout: 1000})
        const content = await page.content();
        const $ = load(content);
        $('div.cont_menu ul.list_menu li').map(function(index, elem) {
            if (checkWord($(elem).find('div.info_menu span.loss_word').text())) {
                ulList.push({
                    res_id: parseInt(id),
                    menu_name: convertWord($(elem).find('div.info_menu span.loss_word').text()),
                    menu_price: convertWord($(elem).find('em.price_menu').text()),
                    description: $(elem).find('p.txt_menu').text() != '' ? $(elem).find('p.txt_menu').text() : null,
                })
            };
        })
        await page.close();
        await browser.close();

        return ulList;
    } 
    catch (error) {
        if (error.constructor === TimeoutError) {
            return null;
        } else {
            console.log(error);
        }
    }
}

const checkWord = (text: string) => {
    const reg = /소주|맥주|사케|와인|[wineWINE]|음료수|막걸리|하이볼|산토리|삿포로|아사히|기린|참이슬|처음처럼|진로|좋은데이|대선|잎새주|이제우린|한라산|카스|테라|필라이트|클라우드|오비라거|하이트|맥스|켈리/;
    if (text.match(reg)) {
        return false
    }
    return true
}

const convertWord = (text: string) => {
    if (text.includes('추천')) {
        return text.split('추천').pop()
    }
    if (text.includes('가격')) {
        return parseInt(text.split('가격:').pop().replace(',', ''))
    }
    return text;
}

export const checkToCrwal = async() => {

}

const crawl = (url: string) =>
new Promise<string>((resolve, reject) => {
    request.get({
            url: url
        }, (err, res) => {
        if (err) reject(err);
        resolve(res.body);
    });
});

const extract = (html: string, j:number) => {
    if (html === '') return [];
    const $ = load(html);
    const crawledRealtimeKeywords = $('ul.list_menu li');
    const keywords = $(crawledRealtimeKeywords)
      .map(
        (i, ele) => {
            console.log($(ele).text());
            return {content: $(ele).text(),
            link: $(ele).attr(),};
        },
      )
      .get();
    return keywords;
};