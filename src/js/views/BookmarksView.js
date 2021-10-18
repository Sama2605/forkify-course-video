import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it;)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log(this._data); //same as model.state.search.results in controller render results
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join(''); //need to map over the array and then join so it will return the string
  }
}

export default new BookmarksView();
