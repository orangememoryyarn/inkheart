  const name = localStorage.getItem('name');
  const url = localStorage.getItem('url');
  const date = localStorage.getItem('date');


  document.getElementById("inv").href = url;
  document.getElementById("page-title").innerText = name;
  document.getElementById("topic-date").innerText = date;

  document.getElementById("back_button").addEventListener('click', () => {
    history.back();
  });
