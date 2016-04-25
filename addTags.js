import fs from 'fs';

function getText(folder) {
  var fileName = fs.readdirSync(folder).filter(function(fileName) {
    if('.' !== fileName[0]) {
      return fileName;
    }
  });
  return fs.readFileSync(folder + '/' + fileName, 'utf8');
}

function AddTags(folderTagsFrom, folderTagsAddTo) {
  this.lijiang = getText(folderTagsFrom);
  this.dege = getText(folderTagsAddTo);
}

AddTags.prototype.split2Pages = function() {
  var pureText = this.lijiang.replace(/<(?!pb).*?>/g, '').replace(/\r?\n/g, ' ');
  var pages = pureText.replace(/</g, '~$%<').split('~$%');

  console.log(pages);
  return this;
}

var addLjTags = new AddTags('./assets/lijiang', './assets/dege');

addLjTags.split2Pages();