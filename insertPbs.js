import fs from 'fs';

let replaceWrongTLFFs = (text) => {
  return text.replace(/([\s་])\u0f6aང([\s་])/g, '$1\u0f62ང$2'); // TLFF is Tibetan-Letter-Fixed-Form 
  // 1. \u0f6aང may be correct in Sanskrit-transliterated Tibetan, but [\s་]\u0f6aང[\s་] is wrong even in Sanskrit-transliterated Tibetan, commented by Karma Lobsang Gurung 2. what's fixed-form-tibetan-letters, see http://unicode.org/charts/PDF/U0F00.pdf
} 

let getText = (folder) => {
  let fileNames = fs.readdirSync(folder)
                    .filter(fileName => ('.' !== fileName[0]));
  let originalText = fs.readFileSync(folder + '/' + fileNames[0], 'utf8');

  return replaceWrongTLFFs(originalText);
}

let removeNonPbTags = (text) => {
  return text.replace(/<(?!pb).*?>/g, '');
}

let split2Pages = (text) => {
  let pages = removeNonPbTags(text).replace(/<(?!pb).*?>/g, '')
                                   .replace(/</g, '~$%<')
                                   .split('~$%')
                                   .filter(page => (page.match('<')));

  let pageObjs = pages.map(page => {
    let obj = {};
    obj.pbTag = '<jp="' + page.match(/".+?\.(.+?)"/)[1] + '"/>';
    obj.pageP = page.replace(/<.*?>(\r?\n)*/, '');

    return obj;
  });

  return pageObjs;
}

let split2Syls = (text) => {
  return modifyText(text).split('་');
}

let modifyText = (text) => {
  return text.replace(/(\r?\n)+/g, '་')
             .replace(/[༆༈།༎༏༐༑༒་ ]+/g, '་');
}

let insertPbTags = (refFolder, targetFolder) => {
  let refPageObjs = split2Pages(getText(refFolder));
  let targetText = getText(targetFolder);

  refPageObjs.forEach((obj) => {
    let pbTag = obj.pbTag;
    let syls = split2Syls(modifyText(obj.pageP));
    let sylSeparator = '(\r?\n|<.+?>|[༆༈།༎༏༐༑༒་ ])+?';
    let possibleSyl = '[^>༆༈།༎༏༐༑༒་ ]+';
    let matchRegex = syls[0] + sylSeparator;
    let lastMatchRegex = '';

    for (let i = 1; i < syls.length; i++) {
      let regex = new RegExp(matchRegex, 'g');
      let matchResult = targetText.match(regex);

      if (!matchResult) {
        if (lastMatchRegex !== '') {
          lastMatchRegex += (possibleSyl + sylSeparator);
          matchRegex = lastMatchRegex + syls[i] + sylSeparator;
        }
        else if (null === matchResult) {
          matchRegex = syls[i] + sylSeparator;
        }
      }
      else if (matchResult.length > 1) {
        lastMatchRegex = matchRegex;
        matchRegex += syls[i] + sylSeparator;
      }
      else if (1 === matchResult.length) {
        let insertIndex = targetText.search(regex);
        targetText = targetText.slice(0, insertIndex) + pbTag + targetText.slice(insertIndex);
        console.log('insert ', pbTag);
        break;
      }
    }
  });

  return targetText;
}


let insertedPbText = insertPbTags('./takePbTagsHere', './insertPbTagsHere');

fs.writeFileSync('./output.txt', insertedPbText, 'utf8');