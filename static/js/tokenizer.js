const nlp = require("compromise");
const fs = require("node:fs");
const path = require("node:path");

const map = new Map();
var snowball_stop_words;

function snowball_handler() {
  let data = get_content_from_filename("snowball.json");
  snowball_stop_words = new Set(JSON.parse(data));
}

//ported
function tokenize(query) {
  let doc = nlp(query);
  //doc.contractions().expand();
  let data = doc.json();
  let map = new Map();

  //It's probably possible to improve the search system by acknowledging different input sentences,
  //but I'm not going there till I have a barebones search system running.
  //After that, it's into refactor territory

  data.forEach(function (sentence) {
    sentence.terms.forEach(function (item) {
      if (item.normal != "") {
        map.set(item.normal, item.tags[0]);
      }
    });
  });
  return map;
}

function remove_stop_words(map) {
  map.forEach(function (_, key) {
    if (snowball_stop_words.has(key)) {
      map.delete(key);
    }
  });
  return map;
}

function process_doc(document) {
  let words_from_doc = [];
  if (document != "") {
    let tokenized_map = tokenize(document);
    //tokenized_map = remove_stop_words(tokenized_map);
    tokenized_map.forEach(function (value, key) {
      //let lemmatized = autolemma(key, value);
      words_from_doc.push(key);
    });
  }
  return words_from_doc;
}

function get_content_from_filename(folder, filename) {
  const fullPath = path.join(folder, filename);
  if (path.extname(filename) === ".md") {
    try {
      const data = fs.readFileSync(fullPath, "utf8");
      map.set(filename, process_doc(data));
    } catch (err) {
      console.error(`Error reading Markdown file ${filename} at ${fullPath}:`);
    }
  }
}

const folderName = path.resolve(__dirname, "../../../Documents/Obsidian Vault");

try {
  if (fs.existsSync(folderName)) {
    fs.readdirSync(folderName).forEach((file) => {
      get_content_from_filename(folderName, file);
    });
  } else {
    console.error("Directory does not exist:", folderName);
  }
} catch (err) {
  console.error("Error accessing directory:", err);
}

console.log(`map size: ${map.size}`);
let keys = Array.from(map.keys());
let values = Array.from(map.values());

let value_set = new Set();
let tag_set = new Set();

//This tagging system identifies *everything* with a # as the first letter in the token as a tag. That's...not going to work.
//We need to handle all latex & markdown formatting before we do this, as stuff like \#1 gets split into \ and #1 and the #1 gets picked up
//So, yeah. I need to solve this.

values.forEach((item) => {
  item.forEach((tag) => {
    if (tag[0] == "#") {
      tag_set.add(tag);
    }
    value_set.add(tag);
  });
});

tag_set.delete("#");
console.log(tag_set);
