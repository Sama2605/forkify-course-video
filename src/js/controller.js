import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeViews.js';
import 'core-js/stable'; //polyfills for es6 features to support old browsers
import 'regenerator-runtime/runtime'; //for polyfilling async/await
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import AddRecipeView from './views/addRecipeView.js';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}
// const recipeContainer = document.querySelector('.recipe'); //to insert html into our dom, using insert adjacement method. Here we select parent element

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
////////

//making an Ajax request to an API - we use the fetch function. async function run in the background.
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); //getting recipe id from the hash
    // console.log(id);
    if (!id) return; //guard-clause in case we trying to render the page without id

    recipeView.renderSpinner(); // calling function renderSpiner

    //0 Update results view to mark selected search resluts
    resultsView.update(model.getSearchResultPage());
    //updating bookmarks
    bookmarksView.update(model.state.bookmarks);

    //1.Loading recipe
    await model.loadRecipe(id); // loadRecipe is a async f.which going to return promise so we have to await that promise here in the execution of this async f. Also this f.does not return anything so we dont have to store the result in a new variable, instead here we will get access to state.recipe in model.js
    // // const recipe = model.state.recipe;
    // const { recipe } = model.state; NOT NEEDED ANYMORE
    //2.Rendering recipe
    recipeView.render(model.state.recipe); //render method will accept recipe data and store it into the object RecipeView
    // controlServings();
  } catch (err) {
    // console.log(err);
    recipeView.renderError();
    console.error(err);
  }
};
// controlRecipes(); we remove this f.call as we now use it in eventlistener

const controlSearchResults = async function () {
  try {
    // 0. Render spinner in searchresults view
    resultsView.renderSpinner();

    //1. get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2. load search results
    await model.loadSearchResults(query);

    //3. render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    //4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    // console.log(err);
  }
};

const controlPAgination = function (goToPage) {
  //1. render  new results
  resultsView.render(model.getSearchResultPage(goToPage));

  //2. Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update yhe recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1, Add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2, Update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Succes message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // CHange ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('❤', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes); //implementing Publisher-Subscriber pattern
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPAgination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
