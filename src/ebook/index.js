const EPub          = require("epub-gen");
const path          = require("path");
const sanitize      = require("sanitize-filename");
const fs            = require('fs');
const {groupBy}     = require('lodash');
const afs           = fs.promises;

//npm run ebook "my hike #1" ./test/export ./test/

(async function main() {
    try {
        let args        = process.argv.slice(2);
        //let args        = ["Myebook ebook", "./test/export", "./test/"]; 

        let title       = args[0];
        let sourceDir   = args[1];
        let destDir     = args[2];

        console.info("Title: " + title);
        console.info("Source dir (page.json + images): " + sourceDir);
        console.info("Dest dir (where ebook is generated): " + destDir);

        let pages = JSON.parse(await afs.readFile(path.resolve(sourceDir, "pages.json"), "utf8"));

        let templateDir = path.resolve(__dirname, "template");

        var options = {
            appendChapterTitles: false,
            tocTitle: "Maps",
            css: await afs.readFile(path.resolve(templateDir, "template.css"), "utf8"),
            customHtmlTocTemplatePath: path.resolve(templateDir , "toc.xhtml.ejs"),
            title: title || "unknown",
            author: "map-2-ebook",
            publisher: "map-2-ebook",
            version: 3
        };

        var content = [];
        pages.forEach((page, i)=>{
            let src = path.resolve(sourceDir, page.imageName)
            content.push({
                ...page,
                title: `${page.distCumStart} - ${page.distCumEnd} (${page.trace})`,
                data: `<img src="${src}">`
            });
        })

        options.content =  content;
        options.pages   = groupBy(content, (content)=>{
            return content.trace;
        })
        
        let dest = path.resolve(destDir, sanitize(options.title) + ".epub");
        var p = new EPub(options, dest).defer.promise;
    
        p.then(function() {
            console.info(`${options.title} is successfully generated in ${dest}`);
        }).catch((err)=>{
            console.error("Error while generating ebook", err);
        })
    } catch(err) {
        console.error(err);
    }
})();