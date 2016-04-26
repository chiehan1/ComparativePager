var fs = require('fs');

function getText(folder) {
  var fileNames = fs.readdirSync(folder).filter(function(fileName) {
      return '.' !== fileName[0];
  });
  return fs.readFileSync(folder + '/' + fileNames[0], 'utf8');
}

function modifyText1(text) {
  return text.replace(/<(?!pb).*?>/g, '')
              .replace(/\r?\n/g, '་')
              .replace(/[༆༈།༎༏༐༑༒་ ]+/g, '་')
              .replace(/་(<|$)/g, '$1');
}

function matchOne(syls, text) {

}

function AddTags(folderTagFrom, folderTagTo) {
  this.textTagFrom = getText(folderTagFrom);
  this.textTagTo = getText(folderTagTo);
  this.pages = '';
}

AddTags.prototype.split2Pages = function() {
  var pureText = modifyText1(this.textTagFrom);
  var pages = pureText.replace(/</g, '~$%<').split('~$%').filter(function(text){
    return text.match('<');
  });
  this.pages = pages;
  return this;
}

AddTags.prototype.insertTags = function() {
  this.pages.forEach(function(text) {
    var syls = text.split('་');
    var newPbTag = syls[1].match('id="(.+?)"/>')[1];
    var wholeNewTag = '<jp="' + newPbTag + '"/>';

    for(var i = 2; i < syls.length; i++) {
      var matchSyl = syls[i];
      var matchNumber = null;
      var regex = '';

      for(var j = i + 1; j < syls.length; j++) {
        regex = new RegExp(matchSyl, 'g');
        matchNumber = this.textTagTo.match(regex);
        if(!matchNumber) {
          break;
        }
        else if (matchNumber.length === 1) {
          break;
        }
        else if(matchNumber.length > 1) {
          matchSyl += '(\r?\n|<.+?>|[༆༈།༎༏༐༑༒་ ])+?' + syls[j];
          continue;
        }
      }
      if(!matchNumber) {
        i = j - 1;
      }
      else if(matchNumber.length === 1) {
        var index = this.textTagTo.search(regex);
        this.textTagTo = this.textTagTo.slice(0, index) + wholeNewTag + this.textTagTo.slice(index);
        break;
      }
    }
  }.bind(this));

  return this;
}

var ljTagToDege = new AddTags('./assets/lijiang', './assets/dege');

var aaa = ljTagToDege.split2Pages().insertTags().textTagTo;

//aaa;
console.log(aaa);