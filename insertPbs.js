import fs from 'fs';

let getText = (folder) => {
  let fileNames = fs.readdirSync(folder)
                    .filter(fileName => ('.' !== fileName[0]));
  let originalText = fs.readFileSync(folder + '/' + fileNames[0], 'utf8');

  return replaceWrongTLFFs(originalText);
}

let replaceWrongTLFFs = (text) => {
  return text.replace(/([\s་])\u0f6aང([\s་])/g, '$1\u0f62ང$2'); // TLFF is Tibetan-Letter-Fixed-Form 
  // 1. \u0f6aང may be correct in Sanskrit-transliterated Tibetan, but [\s་]\u0f6aང[\s་] is wrong even in Sanskrit-transliterated Tibetan, commented by Karma Lobsang Gurung 2. what's fixed-form-tibetan-letters, see http://unicode.org/charts/PDF/U0F00.pdf
} 

let split2Pages = (text) => {
  let pages = removeNonPbTags(text).replace(/<(?!pb).*?>/g, '')
                                    .replace(/</g, '~$%<')
                                    .split('~$%')
                                    .filter(page => (page.match('<')));

  let pageObjs = pages.map(page => {
    let obj = {};
    obj.pbId = '<jp="' + page.match(/".+?\.(.+?)"/)[1] + '"/>';
    obj.pageP = page.replace(/<.*?>(\r?\n)*/, '');

    return obj;
  });

  return pageObjs;
}

let removeNonPbTags = (text) => {
  return text.replace(/<(?!pb).*?>/g, '');
}

console.log(split2Pages(getText('./takePbTagsHere')));

let modifyText = (text) => {
  return text.replace(/<(?!pb).*?>/g, '')
              .replace(/\r?\n/g, '་')
              .replace(/[༆༈།༎༏༐༑༒་ ]+/g, '་')
              .replace(/་(<|$)/g, '$1');
}

function AddTags(folderTagFrom, folderTagTo) {
  this.textTagFrom = getText(folderTagFrom);
  this.textTagTo = getText(folderTagTo);
  this.pages = '';
}

AddTags.prototype.split2Pages = function() {
  var pureText = modifyText(this.textTagFrom);
  var pages = pureText.replace(/</g, '~$%<').split('~$%').filter(function(text){
    return text.match('<');
  });
  this.pages = pages;
  return this;
};

AddTags.prototype.insertTags = function() {
  this.pages.forEach(function(text) {
    var syls = text.split('་').slice(2);
    var newPbTag = '<jp="' + text.match(/<[\s\S]*?=".+?\.(.+?)"\/>/)[1] + '"/>';
    var matchSyl = syls[0] + '(\r?\n|<.+?>|[༆༈།༎༏༐༑༒་ ])+?';
    var lastMatchSyl = '';
//console.log(newPbTag);
    for (var i = 1; i < syls.length; i++) {

      var regex = new RegExp(matchSyl, 'g');
      var matchNumber = this.textTagTo.match(regex);

      if (!matchNumber) {
        if (lastMatchSyl !== '') {
//console.log(i, 'unMatch', matchSyl);
          lastMatchSyl += '[^>༆༈།༎༏༐༑༒་ ]+(\r?\n|<.+?>|[༆༈།༎༏༐༑༒་ ])+?';
          matchSyl = lastMatchSyl + syls[i] + '(\r?\n|<.+?>|[༆༈།༎༏༐༑༒་ ])+?';
          continue;
        }
        else {
          matchSyl = syls[i] + '(\r?\n|<.+?>|[༆༈།༎༏༐༑༒་ ])+?';
          continue;
        }
      }
      else if (matchNumber.length > 1) {
//console.log(i, matchNumber.length, matchSyl);
        lastMatchSyl = matchSyl;
        matchSyl += syls[i] + '(\r?\n|<.+?>|[༆༈།༎༏༐༑༒་ ])+?';
        continue;
      }
      else if (matchNumber.length === 1) {
//console.log(i, 'matched', matchSyl);
        var index = this.textTagTo.search(regex);
        this.textTagTo = this.textTagTo.slice(0, index) + newPbTag + this.textTagTo.slice(index);
        break;
      }
    }
  }.bind(this));

  return this;
};

var ljTagToDege = new AddTags('./takePbTagsHere', './insertPbTagsHere');

var aaa = ljTagToDege.split2Pages().insertTags().textTagTo;

//fs.writeFileSync('./output.txt', aaa, 'utf8');

