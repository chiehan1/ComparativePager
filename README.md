# ComparativePager
Add Kangyur pb tag to other Kangyur
```
npm install
```
 
Put one kangyur txt or xml which you want to take pb tags from in the "takePbTagsHere" folder.

Put another kangyur txt or xml file which you wish to insert pb tags to in the "insertPbTagsHere" folder.

There should be only one file in "takePbTagsHere" folder, same as "insertPbTagsHere" folder.

Then
```
node index.js
```

The "output.txt" and "uncertainTags.txt" will be created.
The output.txt is the kangyur which the wanted pb tags is inserted to.
The uncertainTags.txt shows the suspected wrong inserted pb.

Some information to avoid bugs:
 
https://github.com/chiehan1/PbInserter/wiki
