const EPub = require("epub-gen");
const path = require("path");
const sanitize    = require("sanitize-filename");

function convert(options) {
    let {subdir} = options;

    var options = {
        title: options.name || "unknown",
        author: "Unknown",
        publisher: "html-2-ebook",
        ...options,
        version: 3
    };

    var content = [];
    options.content.forEach((page)=>{
        if(page.data) {
            content.push({
                ...page,
                title: page.title || "Page " + (content.length + 1)
            });
        }
    })

    options.content =  content;
    
    var p = new EPub(options, path.resolve(subdir, sanitize(options.title) + ".epub")).defer.promise;
  
    p.then(function() {
        console.log(`${options.title} is successfully generated`);
    }).catch((err)=>{
        console.error("Error while generating ebook", err);
    })

    return Promise.resolve(p);
}

module.exports = {
    convert
}