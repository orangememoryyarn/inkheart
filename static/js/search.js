
const search_box = document.querySelector("#search_box");
const search_button = document.querySelector("#search_button");
const back_button = document.querySelector("#back_button");

const news = document.querySelector("#news");

news.addEventListener('click', () => {
  hide_all_except(news);
  setup_news();
});

function hide_all_except(except_me) {
  const elementsToHide = document.querySelectorAll(".clicker");
  elementsToHide.forEach(element => {
    if(element !== except_me) {
      element.style.display = "none";
    }
  });
}

function setup_news()
{
  let content = get_latest_rss();
  display(content);
}

function get_latest_rss()
{
  fetchAndPrint();
  //open up the .txt file and get the rss info
  //actually grab the rss info from the net
  //take the most popular rss stuff for each
}


function fetchAndPrint() {

}


function display(stuff)
{

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

function get_rss()
{

}
