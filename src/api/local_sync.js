var Promise = require('bluebird');
var storage = require('../utils/storage');
var find = require('lodash.find');
var uuid = require('uuid');

module.exports = function(namespace) {
  var store = {
    get: function() {
      var items = {};
      items[namespace] = [];

      return storage.get(items)
        .then(function(data) {
          return data[namespace];
        });
    },

    set: function(models) {
      var data = {};
      data[namespace] = models;
      return storage.set(data);
    },

    serialize: function(model) {
      return model.toJSON();
    },

    all: function() {
      return this.get();
    },

    find: function(model) {
      return this.get()
        .then(function(models) {
          return find(models, {id: model.id});
        });
    },

    create: function(model) {
      var self = this;

      model.id = uuid.v4();

      return this.get()
        .then(function(models) {
          var serialized = self.serialize(model);
          models.push(serialized);

          return self.set(models);
        })
        .then(function() {
          return model;
        });
    },

    update: function(model) {
      var self = this;

      return this.get()
        .then(function(models) {
          var serialized = self.serialize(model);
          var previous = find(models, {id: model.id});
          var index = models.indexOf(previous);
          models.splice(index, 1, serialized);
          return self.set(models);
        })
        .then(function() {
          return model;
        });
    },

    destroy: function(model) {
      var self = this;

      return this.get()
        .then(function(models) {
          var previous = find(models, {id: model.id});
          var index = models.indexOf(previous);
          models.splice(index, 1);
          return self.set(models);
        });
    }
  };

  return function sync(method, model, options) {
    var promise;

    switch (method) {
      case 'read':
        promise = model.isCollection ? store.all() : store.find(model);
        break;
      case 'create':
        promise = store.create(model);
        break;
      case 'update':
        promise = store.update(model);
        break;
      case 'delete':
        promise = store.destroy(model);
        break;
    }

    return promise.then(options.success, options.error);
  };
};
