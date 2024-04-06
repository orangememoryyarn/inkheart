const search_box = document.querySelector("#search_box");
const search_button = document.querySelector("#search_button");
const search_results = document.querySelector("#cl");

//could I use the search button for a deeper-than-normal search?
//There might actually be a use for this if I'm looking into adding in date, regex and more complex searches. cmd+enter works for the button too thought
search_button.addEventListener("click", () => {
  find_documents(search_box.value);
});

//woahhhh this works
function find_documents(query) {}

function action(item) {
  alert(item.normal);
}

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

function stem(query) {
  return query;
}

search_box.addEventListener("keyup", function () {
  if (search_box.value != "") {
    //clearing the result showcase
    clear_results();

    //the process of getting search results
    let query = search_box.value;
    query = tokenize(query);
    query = remove_stop_words(query);
    //query = stem(query);
    //let dataset = find_documents(query);

    //looping to append the results to output list
    for (let i = 0; i < query.length; i++) {
      create_search_result_element(query[i]);
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
