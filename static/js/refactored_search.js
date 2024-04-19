//DOM constants
const search_box = document.querySelector("#search_box");
const search_button = document.querySelector("#search_button");
const search_results = document.querySelector("#cl");

//Lemmatizer initialization
var lemmatizer = new Lemmatizer();

/*
This focuses on the search_box when the page is loaded
This removes the need for the user to manually click on the search_box before starting to type
*/
window.onload = function () {
  search_box.focus();
};

function process_user_input() {
  //clearing the results
  if (search_box.value != "") {
    //creating a map of (word, word type)
    let tokenized_map = tokenize_with_word_type(search_box.value);

    //removing stop words from the map
    tokenized_map = remove_stop_words(tokenized_map);
    console.log(tokenized_map);
    //creating a map of matches
    let matches = new Map();
    tokenized_map.forEach(function (word_type, word) {
      let lemmatized_word = autolemma(word, word_type);
      let matched_docs = match(lemmatized_word);
      matches.set(word, matched_docs);
    });
  }
}

function clear_results() {
  search_box.value = "";
}

/*
function tokenize_with_word_type(raw_string_from_searchbox)
This function accepts the raw search_box.value as a STRING and returns a MAP of (word, word_type) pairs
*/
function tokenize_with_word_type(raw_string_from_searchbox) {
  //constructing an array of nested sentences with compromise.js's .json() function
  //Example: [['The','dancing', 'dragon', 'died'], ['sentence2]]
  let array_of_sentences = nlp(query).json();
  let map = new Map();

  array_of_sentences.forEach(function (sentence) {
    sentence.terms.forEach(function (token) {
      if (token.normal != "") {
        map.set(token.normal, token.tags[0]);
      }
    });
  });

  return map;
}

function remove_stop_words(map) {
  let snowball_set = load_file((key = "snowy"), (source = "snowball.json"));
  snowball_set.forEach(function (token) {
    if (map.has(token)) {
      map.delete(token);
    }
  });
}

function load_file(key, source) {
  if (localStorage.getItem(key)) {
    return localStorage.getItem(key).json();
  } else {
    fetch(source).then(
      (response) =>
        function () {
          response = response.json();
          loadStorage.setItem(key, response);
          alert(response);
          return response;
        },
    );
  }
}

function debounce(func, timeout = 30) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const processchange = debounce(() => process_user_input());
