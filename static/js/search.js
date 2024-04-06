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

function tokenize(query) {
  let doc = nlp(query);
  //doc.contractions().expand();
  let data = doc.json();
  arr = [];

  data[0].terms.forEach(function (item) {
    if (item.normal != "") {
      arr.push(item.normal);
    }
  });

  return arr;
}

function remove_stop_words(arr) {
  arr = arr.filter(function (val) {
    return snowball_stop_words.indexOf(val) == -1;
  });

  return arr;
}

function autolemma(word) {
  alert("at autolemma");
  try {
    alert("before lemmatization");
    var lemmatizer = new Lemmatizer();
    alert(lemmatizer.lemmas(word));
    alert("post-lemmas");
  } catch (error) {
    return error;
  }
  return word;
}

search_box.addEventListener("keyup", function () {
  if (search_box.value != "") {
    //clearing the result showcase
    clear_results();
    //the process of getting search results
    let query = search_box.value;
    let saved_query = query;
    query = tokenize(query);
    query = remove_stop_words(query);
    //create_search_result_element(autofill(saved_query));

    //looping to append the results to output list
    for (let i = 0; i < query.length; i++) {
      create_search_result_element(autolemma(query[i]));
    }
  } else {
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
