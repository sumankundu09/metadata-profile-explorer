const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const base64 = require('base-64');

const port = process.env.PORT || 3000;
var app = express();
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.post('/processZip', (req, res) => {
  var resContent = [];
  if (req.body) {
    var zipContent = req.body.content;
    var zip = new require('node-zip')(zipContent, {base64: true, checkCRC32: true});
    Object.keys(zip.files).forEach((fileName) => {
      if (_.startsWith(fileName, 'profiles/') && !zip.files[fileName].dir) {
        var curProfile = {
          "fileName": _.split(fileName, '/')[1],
          "data": base64.encode(zip.files[fileName]._data)
        }
        resContent.push(curProfile);
      }
    });
  }
  res.send(resContent);
});

app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
