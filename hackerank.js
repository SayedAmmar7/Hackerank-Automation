const puppeteer = require("puppeteer");

let cTab;
let email = "";
let password = "";

let browserofPenPromise = puppeteer.launch({
    headless: false,
    debuggingPort: null,
    args: ["--start=maximized"],

    // chrome://version/
    //executablePath:
    // "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
});

browserofPenPromise
    .then(function (browser) {
        console.log("browser is open");
        // console.log(browser);
        let allTabsPromises = browser.pages(); // Return an Array of all open pages inside the browser
        return allTabsPromises;
    })
    .then(function (allTabs) {
        cTab = allTabs[0];
        console.log("new tab");
        let visitinLoginPagePromise = cTab.goto("https://www.hackerrank.com/auth/login");
        return visitinLoginPagePromise;
    })
    .then(function () {
        console.log('opened hackerank login page');
        let emailWillBeTypePromise = cTab.type("input[name='username']", email);
        return emailWillBeTypePromise;
    })

    .then(function () {
        console.log("paaword hs been typed");
        let passwordWillBeTypePromise = cTab.type("input[name='password']", password);
        return passwordWillBeTypePromise;
    })
    .then(function () {
        console.log("login button");
        let WillBeLoggedPromise = cTab.click(
            ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"
        );
        return WillBeLoggedPromise;
    })
    .then(function () {
        console.log("Alogorithm opened");
        let algorithmTabOpenedPromise = waitAndClicked("a[data-attr1='algorithms']");
        return algorithmTabOpenedPromise;
        // let myPromise = new Promise(function(resolve,reject) {
        //  let waitforSelectorPromise = cTab.waitForSelector(selector);
    })

    .then(function () {
        console.log("algorithm page is opened");
        let allQuesPromise = cTab.waitForSelector(
            'a[data-analytics="ChallengeListChallengeName"]'
        );
        return allQuesPromise;
    })
    .then(function () {

        function getAllQuesLinks() {
            let allElemArr = document.querySelectorAll(
                'a[data-analytics="ChallengeListChallengeName"]'
            );
            let linksArr = [];
            for (let i = 0; i < allElemArr.length; i++) {
                linksArr.push(allElemArr[i].getAttribute("href"));
            }
            return linksArr;
        }
        let linksArrPromise = cTab.evaluate(getAllQuesLinks);
        console.log(linksArrPromise);
        return linksArrPromise;
    })

    .then(function (linksArr) {
        console.log("links to all ques received");
        console.log(linksArr);
        //  question solve krna h
        //link to the question to besolved, idx of the linksArr
        let questionWillBeSolvedPromise = questionSolver(linksArr[0], 0);
        /* for (let i = 1; i < linksArr.length; i++){
           questionWillBeSolvedPromise = questionWillBeSolvedPromise.then(function () {
             return questionSolver(linksArr[i], i);
           })
           // a = 10;
           // a = a + 1; 
         } */
        return questionWillBeSolvedPromise;
    })
    .then(function () {
        console.log("question is solved");
    })



    .catch(function (err) {
        console.log(err)
    })

function waitAndClicked(algobtn) {
    let waitClickPromise = new Promise(function (resolve, reject) {
        let waitforSelectorPromise = cTab.waitForSelector(algobtn);
        waitforSelectorPromise
            .then(function () {
                let clickPromise = cTab.click(algobtn);
                console.log("algo btn is found")
                return clickPromise;
            })
            .then(function () {
                console.log("algo btn is clicked")
                resolve();

            })
            .catch(function (err) {
                reject(err);
            })
    });
    return waitClickPromise;
}

function questionSolver(url, idx) {
    return new Promise(function (resolve, reject) {
        let fullLink = `https://www.hackerrank.com${url}`;
        let gotoQuestionPagePromise = cTab.goto(fullLink);

        gotoQuestionPagePromise.then(function () {
            console.log("question page opened");
            resolve();
        })
            .catch(function (err) {
                console.log(err);
            })
    })
}
