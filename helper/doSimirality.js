var diff = require("diff");

function doSimirality (str1, str2) {
  var diffResult = diff.diffChars(str1, str2), same = 0, odd = 0;

  for (var i = 0; i < diffResult.length; i++) {
    var obj = diffResult[i];

    if (!('added' in obj)) {
      same += obj.count;
    } else {
      odd += obj.count;
    }
  }

  return (same * 2) / (odd + (same * 2));
}

module.exports = {
  doSimirality: doSimirality;
}