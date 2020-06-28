# map-2-ebook
## Why?
I love hiking, and when I am in the wilderness I usually use my phone with an offline map with contour lines and a GPX file to find my way. But it's safer to have an other source of information in case the phone is not available anymore (low battery or broken). For this purpose I can print some maps or keep these maps into my ebook reader. This script have been made to gain a lot of time to prepare these maps.

## What can these scripts do?
These scripts can generate all maps along a trail (a GPX file). Mileage is automatically calculated, and all maps are automatically centered / zoomed to follow the trail and sorted by sections, so that you just have to print or use the other script to transform all these map to an ebook. Then the ebook can be placed to your reader like an USB key.

## How to use it ?
1) Clone the repository and launch console. Use "npm install" command to import all libraries in "node_modules"
2) Generate maps

2.1) Use "npm run map" to launch the app to generate map"

2.2) Drop your GPX files to you browser. All files are automatically generated and downloaded

3) Generate ebook
Launch command line to generate ebook: npm run ebook "Name of my book" path/where/files/are/downloaded/ path/to/generate/ebook (all maps images and pages.json must be in path/where/files/are/downloaded/ directory). For instance, you can use 'npm run ebook "my hike #1" ./test/export ./test/' to regenerate ebook with test data.

Note: "outdoor" tiles are used from this service: https://c.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png (free for <150,000 tiles / month, but you can use any tile supplier replacing this service into "/src/exportmap/map/index.js" or add your own API key

## Test it
You'll find some tests files in "/test" directory:
1) "/tests/GPX" contains two examples of GPX files
2) "/tests/export" contains all data generated with these 2 GPX files (images and pages.json).
3) "/tests/hike #1.epub" is the ebook file generated with these maps 

## Screenshots
![Screenshot 1](https://github.com/dorianrod/map-2-ebook/blob/master/sreenshot1.png)
![Screenshot 2](https://github.com/dorianrod/map-2-ebook/blob/master/sreenshot2.png)
