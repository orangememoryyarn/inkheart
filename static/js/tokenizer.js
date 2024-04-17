const nlp = require("compromise");
const fs = require("node:fs");
var Tokenizer = require("tokenize-text");
var tk = new Tokenizer();

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

function build_map(folder, filename) {
  const fullPath = path.join(folder, filename);
  if (path.extname(filename) === ".md") {
    try {
      const data = fs.readFileSync(fullPath, "utf8");
      console.log(tk_alternative(data));
      map.set(filename, process_doc(data));
    } catch (err) {
      console.error(
        `Error reading Markdown file ${filename} at ${fullPath}:`,
        err,
      );
    }
  }
}

const folderName = path.resolve(__dirname, "../../../Documents/Obsidian Vault");

if (fs.existsSync(folderName)) {
  let names = fs.readdirSync(folderName);
  build_map(folderName, names[22]);
}

function tk_alternative(document) {
  let tk_m = tk.sections()(document);
  return tk_m;
}

let a = Array.from(map.keys);
console.log(a);
