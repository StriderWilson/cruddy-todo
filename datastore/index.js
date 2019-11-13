const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
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


  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('err');
    } else {
      var todoList = files.map((file) => {
        return new Promise(function (resolve, reject) {
          let item = path.basename(file, '.txt');
          fs.readFile(path.join(exports.dataDir, file), (err, data) =>{
            if (err) {
              reject(err);
            } else {
              resolve({ id: item, text: data.toString()});
            }
          });
        });
      });
      // console.log(todoList);

      // callback(null, todoList);
      Promise.all(todoList)
        .then(function(results) {
          todoList = results;
          callback(null, todoList);
          // console.log(todoList);
          // return todoList;
        })
        .catch(error => console.log(`error in promises ${error}`));
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
