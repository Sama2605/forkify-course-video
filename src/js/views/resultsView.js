import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    // console.log(this._data); //same as model.state.search.results in controller render results
    return this._data.map(result => previewView.render(result, false)).join(''); //need to map over the array and then join so it will return the string
  }
}

export default new ResultsView();
