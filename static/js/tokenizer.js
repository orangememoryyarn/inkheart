//npm imports
const nlp = require("compromise");
const fs = require("node:fs");
const path = require("node:path");

//defining tokenizer
var Tokenizer = require("tokenize-text");
var tokenize = new Tokenizer();

/*
tokenize(raw_document_text)
This function returns a MAP of the tokens present in the STRING document it is passed.
The MAP consists of (word, INTEGER frequency) pairs
If there is an error, it will print the error message to console and return an empty SET
*/

function tokenizer(raw_document) {
  try {
    let array_of_tokens = tokenize.words()(raw_document);
    let map_of_tokens = new Map();
    array_of_tokens.forEach(function (token_object) {
      if (map_of_tokens.has(token_object.value)) {
        map_of_tokens.set(
          token_object.value,
          map_of_tokens.get(token_object.value) + 1,
        );
      } else {
        map_of_tokens.set(token_object.value, 1);
      }
    });
    return map_of_tokens;
  } catch (err) {
    console.error(`Error tokenizing Markdown file`);
  }
}

/*
get_token_set_from_one_document(path_to_document, document_name)
This function accepts the STRING path to a document relative to the directory, and the STRING document name
If the document does not exist, it will return an empty MAP.
If the document is not a markdown document, it will return an empty MAP.
If the document exists and is a markdown document, it will return the MAP of (token, INTEGER frequency).
*/
function get_token_set_from_one_document(path_to_document, document_name) {
  if (path.extname(document_name) === ".md") {
    //get raw markdown file content as STRING
    try {
      let file_contents = fs.readFileSync(
        path.join(path_to_document, document_name),
        "utf-8",
      );

      //get MAP of tokens from file
      let map_of_tokens = tokenizer(file_contents);
      return map_of_tokens;
    } catch (err) {
      console.error(
        `Error reading Markdown file ${document_name} at ${path.join(path_to_document, document_name)}:`,
      );
    }
    return new Map();
  }
  return new Map();
}

function construct_index(everything_maps) {
  let inverted_index = new Map();
  everything_maps.forEach(function (map_of_tokens, fileName) {
    map_of_tokens.forEach(function (frequency, token) {
      if (inverted_index.has(token)) {
        inverted_index.set(
          token,
          inverted_index.get(token).add([fileName, frequency]),
        );
      } else {
        let blank_set = new Set();
        blank_set.add([fileName, frequency]);
        inverted_index.set(token, blank_set);
      }
    });
  });
  return inverted_index;
}

const folderName = path.resolve(__dirname, "../../../Documents/Obsidian Vault");

//building a (document_name, [raw document, set of tags]) map
let map = new Map();
if (fs.existsSync(folderName)) {
  let names = fs.readdirSync(folderName);
  names.forEach(function (fileName) {
    map.set(fileName, get_token_set_from_one_document(folderName, fileName));
  });
}

//creating a set of stop words from the snowball json file
const setpath = (path.resolve(__dirname, "static/js"), "snowball.json");
let page = fs.readFileSync(setpath, "utf-8");
let snowball_stops = new Set(JSON.parse(page));

//making the index
let inverted_index = construct_index(map);

//removing stop words
snowball_stops.forEach(function (token) {
  if (inverted_index.has(token)) {
    inverted_index.delete(token);
  }
});

console.log(inverted_index);
