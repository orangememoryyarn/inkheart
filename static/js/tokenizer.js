//npm imports
const nlp = require("compromise");
const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

//defining tokenizer
var Tokenizer = require("tokenize-text");
var tokenize = new Tokenizer();

/*
tokenize(raw_document_text)
This function returns a MAP of the tokens present in the STRING document it is passed.
The MAP consists of (word, INTEGER frequency) pairs
If there is an error, it will print the error message to console and return an empty MAP
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
  return new Map();
}

/*
get_token_set_from_one_document(path_to_document, document_name)
This function accepts the STRING path to a MARKDOWN document relative to the directory, and the STRING document name
Only MARKDOWN documents are passed to this function (there is an if statement checking path extensions)
If the document does not exist, it will return an empty MAP.
If the document exists, it will return the MAP of (word, INTEGER frequency).
*/
function get_token_set_from_one_document(path_to_document, document_name) {
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

/*
construct_index(everything_maps)
This function accepts a MAP of all the documents, arranged in (document_name, map_of_tokens) pairs.
The map_of_tokens MAP consists of (word, INTEGER frequency) pairs.
If everything_maps is empty, it will return an empty map.
It will otherwise return a completed inverted index made of (word, [document_name, frequency]) pairs
*/
function construct_index(everything_maps) {
  let inverted_index = new Map();
  everything_maps.forEach(function (map_of_tokens, fileName) {
    map_of_tokens.forEach(function (frequency, token) {
      if (inverted_index.has(token)) {
        let file_list = inverted_index.get(token);
        file_list.push([fileName, frequency]);
        inverted_index.set(token, file_list);
      } else {
        let blank_list = [];
        blank_list.push([fileName, frequency]);
        inverted_index.set(token, blank_list);
      }
    });
  });
  //If everything_maps is blank, inverted_index will be an empty MAP
  return inverted_index;
}

//defining the folder in which documents are stored
const folderName = path.resolve(__dirname, "../../../../../Obsidian Vault");
console.log(folderName);

//building a (document_name, [raw document, set of tags]) map
let map = new Map();
let statistics = new Map();
try {
  if (fs.existsSync(folderName)) {
    let names = fs.readdirSync(folderName);
    names.forEach(function (fileName) {
      if (path.extname(fileName) === ".md") {
        map.set(
          fileName,
          get_token_set_from_one_document(folderName, fileName),
        );
        statistics.set(fileName, fs.statSync(path.join(folderName, fileName)));
      }
    });
  }
} catch (err) {
  console.log(`Error loading folder ${err}`);
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

//serializing the index
const tempObj_index = Object.fromEntries(inverted_index);
const serialized_index = JSON.stringify(tempObj_index, null, 2);

const tempObj_statistics = Object.fromEntries(statistics);
const serialized_statistics = JSON.stringify(tempObj_statistics, null, 2);

//writing the serialized index to the index.json file
try {
  fs.writeFileSync("indexed.json", serialized_index);
  fs.writeFileSync("statistics.json", serialized_statistics);
} catch (error) {
  console.error("Error writing to index.json");
}
