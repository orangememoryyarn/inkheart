const search_box = document.querySelector("#search_box");
const search_button = document.querySelector("#search_button");
const search_results = document.querySelector("#cl");

window.onload = function () {
  search_box.focus();
};

//could I use the search button for a deeper-than-normal search?
//There might actually be a use for this if I'm looking into adding in date, regex and more complex searches. cmd+enter works for the button too thought

/*
search_button.addEventListener("click", () => {
  find_documents(search_box.value);
});
*/

var snowball_stop_words = [
  "i",
  "me",
  "my",
  "myself",
  "we",
  "us",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "will",
  "would",
  "shall",
  "should",
  "can",
  "could",
  "may",
  "might",
  "must",
  "ought",
  "i'm",
  "you're",
  "he's",
  "she's",
  "it's",
  "we're",
  "they're",
  "i've",
  "you've",
  "we've",
  "they've",
  "i'd",
  "you'd",
  "he'd",
  "she'd",
  "we'd",
  "they'd",
  "i'll",
  "you'll",
  "he'll",
  "she'll",
  "we'll",
  "they'll",
  "isn't",
  "aren't",
  "wasn't",
  "weren't",
  "hasn't",
  "haven't",
  "hadn't",
  "doesn't",
  "don't",
  "didn't",
  "won't",
  "wouldn't",
  "shan't",
  "shouldn't",
  "can't",
  "cannot",
  "couldn't",
  "mustn't",
  "let's",
  "that's",
  "who's",
  "what's",
  "here's",
  "there's",
  "when's",
  "where's",
  "why's",
  "how's",
  "daren't",
  "needn't",
  "oughtn't",
  "mightn't",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "one",
  "every",
  "least",
  "less",
  "many",
  "now",
  "ever",
  "never",
  "say",
  "says",
  "said",
  "also",
  "get",
  "go",
  "goes",
  "just",
  "made",
  "make",
  "put",
  "see",
  "seen",
  "whether",
  "like",
  "well",
  "back",
  "even",
  "still",
  "way",
  "take",
  "since",
  "another",
  "however",
  "two",
  "three",
  "four",
  "five",
  "first",
  "second",
  "new",
  "old",
  "high",
  "long",
];

//make this return a dictionary of word:type pairs
function tokenize(query) {
  let doc = nlp(query);
  //doc.contractions().expand();
  let data = doc.json();
  let map = new Map();

  data[0].terms.forEach(function (item) {
    if (item.normal != "") {
      map.set(item.normal, item.tags[0]);
    }
  });

  return map;
}

function remove_stop_words(map) {
  map.forEach(function (_, key) {
    if (!(snowball_stop_words.indexOf(key) == -1)) {
      map.delete(key);
    }
  });
  return map;
}

function autolemma(word, type) {
  try {
    var lemmatizer = new Lemmatizer();
    type = type.toLowerCase();

    if (
      type == "noun" ||
      type == "verb" ||
      type == "adverb" ||
      type == "adjective"
    ) {
      if (type == "adverb") {
        type = "adv";
      }
      if (type == "adjective") {
        type = "adj";
      }

      word = lemmatizer.lemmas(word, type);
    }
  } catch (error) {
    alert(error);
    return error;
  }

  return word;
}

search_box.addEventListener("keyup", function () {
  if (search_box.value != "") {
    //clearing the result showcase
    clear_results();

    //the process of getting search results
    let tokenized_map = tokenize(search_box.value);
    tokenized_map = remove_stop_words(tokenized_map);

    tokenized_map.forEach(function (value, key) {
      let lemmatized = autolemma(key, value);
      create_search_result_element(lemmatized);
    });
  }
});

function create_search_result_element(information) {
  let box = document.createElement("div");
  box.classList.add("blocky");
  box.innerHTML = information;
  search_results.append(box);
}

function clear_results() {
  search_results.innerHTML = "";
}
