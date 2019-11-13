const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      if (err) {
        console.log('err is', err);
      } else {
        items[id] = id;
        items[text] = text;
        callback(null, { id, text });
      }
    });

  });

};

exports.readAll = (callback) => {
  // var items = fs.readdir(path.join(exports.dataDir), (err, files) => {
  //   console.log(files);
  //   if (err) {
  //     console.log('err ', err);
  //   } else {
  //     var textData = _.map(files, (data, id) => {
  //       var text = fs.readFile(path.join(exports.dataDir, data), (err, data) =>{
  //         console.log('text', data.toString());
  //         return { id: id, text: data.toString() };
  //       });
  //       callback(null, textData);
  //     });

  //   }
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('err');
    } else {
      var todoList = files.map((file) => {
        let item = path.basename(file, '.txt');
        // var text = fs.readFile(path.join(exports.dataDir, file), 'utf8', (err, data) =>{
        //   console.log('text', data);
        // });

        return { id: item, text: item };
      });
      callback(null, todoList);
    }
  });

};

exports.readOne = (id, callback) => {

  fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: data.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  // if (fs.existsSync(exports.dataDir, id + '.txt')) {
  fs.access(path.join(exports.dataDir, id + '.txt'), fs.F_OK, (err) => {
    if (err) {
      console.log('Access Error', err);
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });


};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
