const nlp = require("compromise");
const fs = require("node:fs");
var Tokenizer = require("tokenize-text");
var tk = new Tokenizer();

const path = require("node:path");
const { clearScreenDown } = require("node:readline");

const map = new Map();

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

function build_map(folder, filename) {
  const fullPath = path.join(folder, filename);
  if (path.extname(filename) === ".md") {
    try {
      const data = fs.readFileSync(fullPath, "utf8");
      let tuple = [];
      tuple.push(data);
      tuple.push(process_doc(data));
      map.set(filename, tuple);
    } catch (err) {
      console.error(`Error reading Markdown file ${filename} at ${fullPath}:`);
    }
  }
}

const folderName = path.resolve(__dirname, "../../../Documents/Obsidian Vault");

if (fs.existsSync(folderName)) {
  let names = fs.readdirSync(folderName);
  names.forEach(function (item) {
    build_map(folderName, item);
  });
}
function tk_alternative(document) {
  let tk_m = tk.sections()(document);
  return tk_m;
}

let keys = Array.from(map.keys());
let values = Array.from(map.values());

function build_index(everything_maps) {
  let inverted_index = new Map();
  everything_maps.forEach(function (value, filename) {
    value[1].forEach(function (token) {
      if (inverted_index.has(token)) {
        inverted_index.set(token, inverted_index.get(token).add(filename));
      } else {
        inverted_index.set(token, new Set());
      }
    });
  });
  return inverted_index;
}

//creating a set of stop words from the snowball json file
const setpath = (path.resolve(__dirname, "static/js"), "snowball.json");
let page = fs.readFileSync(setpath, "utf-8");
let snowball_stops = new Set(JSON.parse(page));

//making the index
let inverted_index = build_index(map);
snowball_stops.forEach(function (token) {
  if (inverted_index.has(token)) {
    inverted_index.delete(token);
  }
});
