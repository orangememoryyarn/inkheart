
const rss_data = [
  { name: 'NPR : National Public Radio', url: 'https://www.google.com' },
  { name: 'NYT : New York Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
  { name: 'MIT Technlogy Review', url: 'https://cdn.technologyreview.com/topnews.rss' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
  { name: 'Blog : Simon Willison', url: 'https://simonwillison.net/atom/everything/' },
  { name: 'TheSephist : Linus Lee', url: 'https://thesephist.com/index.xml' },
];

const thorn = document.querySelector("#thorn");

const search_box = document.querySelector("#search_box");
const search_button = document.querySelector("#search_button");
const back_button = document.querySelector("#back_button");

const news = document.querySelector("#news");
const notes = document.querySelector("#notes");
const crawler = document.querySelector("#crawler");

const dynamic = document.querySelector(".dynamic");

let binary = false;

news.addEventListener('click', () => {
  if(!binary)
  {
    hide_all_except(news);
    setup_news();
    binary = true;
  }
  else {
    clear_interface();
    binary = false;
  }
});

notes.addEventListener('click', () => {
  if(!binary)
  {
    hide_all_except(notes);
    setup_notes();
    binary = true;
  }
  else {
    clear_interface();
    binary = false;
  }
});

crawler.addEventListener('click', () => {
  if(!binary)
  {
    hide_all_except(crawler);
    setup_crawler();
    binary = true;
  }
  else {
    clear_interface();
    binary = false;
  }
});

function hide_all_except(except_me) {
  const elementsToHide = document.querySelectorAll(".clicker");
  elementsToHide.forEach(element => {
    if(element !== except_me) {
      element.style.display = "none";
    }
  });
}

function show_all() {
  const elementsToShow = document.querySelectorAll(".clicker");
  elementsToShow.forEach(element => {
      element.style.display = "block";
  });
}

function setup_news() {
  let content = get_latest_rss();
  display(content);

}



function setup_notes()
{
  let content = get_note_builder();
  display(content);
}

function get_note_builder()
{

}

function setup_crawler()
{

}

function get_latest_rss() {
  const items = [];
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString("en-US", options);

  rss_data.forEach(feed => {
    const p = document.createElement("p");
    p.innerHTML = `<p class="article_content">${feed.url}</p`;

      p.addEventListener("click", () => {
      localStorage.setItem('name', feed.name);
      localStorage.setItem('url', feed.url);
      localStorage.setItem('date', formattedDate);
      window.location.href = "read.html";
    });
    items.push(p);
  });

  return items;
}



function fetchAndPrint() {

}


function display(stuff)
{

  stuff.forEach(item => {
      thorn.appendChild(item);
  });

  //stuff will always be sent as an array, even if it is only an array of one element
  thorn.style.display = "block";
}


function clear_interface()
{
  show_all();

  thorn.style.display = "none";
  thorn.innerHTML = "";
  //clear and remove the thorn model_aiy_vision_classifier_birds_V1
}


search_button.addEventListener('click', () => {
  do_stuff(search_box.value);
});

search_box.addEventListener('keyup', function (e) {
  if (e.key === 'Enter') {
    do_stuff(search_box.value);
  }
});

function do_stuff(text_box_content) {
  alert(text_box_content);
}
