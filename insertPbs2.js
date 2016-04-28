import fs from 'fs';
import glob from 'glob';

class InsertTags {
  constructor(tagsFrom, tagsTo) {
    if (!tagsFrom) {
      tagsFrom = './takePbTagsFrom';
    }
    if (!tagsTo) {
      tagsTo = './insertPbTagsTo';
    }

    this.route = [tagsFrom, tagsTo];
  }
}

let insertLjTags = new InsertTags();

console.log(insertLjTags.route);