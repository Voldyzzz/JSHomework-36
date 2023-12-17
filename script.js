const refs = {
  jokesCategories: document.querySelector("#jokesCategories"),
  jokesList: document.querySelector("#jokesList"),
  liItems: [],
};

const getFile = (file) =>
  fetch(file).then((data) =>
    data.ok ? data.json() : Promise.reject(data.statusText)
  );

getFile("https://api.chucknorris.io/jokes/categories")
  .then((data) => {
    addOptionsInSelect(jokesCategories, data);
  })
  .catch((err) => console.log("Error: ", err));

refs.jokesCategories.addEventListener("change", handlerJokesCategoriesChange);

refs.jokesList.addEventListener("click", handlerJokesListClick);

function addOptionsInSelect(select, data) {
  data.forEach((category) => {
    jokesOption = document.createElement("option");
    jokesOption.value = category;
    jokesOption.innerText = category;
    select.appendChild(jokesOption);
  });
}

function addJokeToList(list, objWithJoke) {
  liItem = document.createElement("li");
  liItem.innerHTML = `<p>Category: <b>${objWithJoke.categories[0]}</b></p>
  <p>${objWithJoke.value}</p>
  <button class ="remove-btn">Remove joke</button>`;
  list.appendChild(liItem);
  refs.liItems.push(liItem);
}

function disabledOption(selectItem, category) {
  const options = selectItem.querySelectorAll("option");
  options.forEach((option) => {
    if (option.value === category[0]) {
      option.disabled = true;
    }
  });
}

function changeDisabledOption(selectItem, element) {
  const options = selectItem.querySelectorAll("option");
  const category = element.querySelector("b");

  options.forEach((option) => {
    if (option.value === category.innerText) {
      option.disabled = false;
    }
  });
}

// hadlers

function handlerJokesCategoriesChange() {
  getFile(
    `https://api.chucknorris.io/jokes/random?category=${refs.jokesCategories.value}`
  )
    .then((data) => {
      addJokeToList(jokesList, data);
      return data.categories;
    })
    .then((category) => {
      disabledOption(jokesCategories, category);
    })
    .catch((err) => console.log(err));
}

function handlerJokesListClick(event) {
  if (event.target.className === "remove-btn") {
    event.target.parentElement.remove();
    changeDisabledOption(jokesCategories, event.target.parentElement);
  }
}
