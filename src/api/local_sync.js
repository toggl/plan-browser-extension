import * as storage from 'src/utils/storage';
import find from 'lodash.find';
import uuid from 'uuid';

export default function(namespace) {
  const store = {
    get() {
      const items = {};
      items[namespace] = [];

      return storage.get(items).then(function(data) {
        return data[namespace];
      });
    },

    set: models => {
      const data = {};
      data[namespace] = models;
      return storage.set(data);
    },

    serialize(model) {
      return model.toJSON();
    },

    all() {
      return this.get();
    },

    find(model) {
      return this.get().then(models => {
        return find(models, { id: model.id });
      });
    },

    create(model) {
      model.id = uuid.v4();

      return this.get()
        .then(models => {
          const serialized = this.serialize(model);
          models.push(serialized);

          return this.set(models);
        })
        .then(() => model);
    },

    update(model) {
      return this.get()
        .then(models => {
          const serialized = this.serialize(model);
          const previous = find(models, { id: model.id });
          const index = models.indexOf(previous);
          models.splice(index, 1, serialized);
          return this.set(models);
        })
        .then(() => model);
    },

    destroy(model) {
      return this.get().then(models => {
        const previous = find(models, { id: model.id });
        const index = models.indexOf(previous);
        models.splice(index, 1);
        return this.set(models);
      });
    },
  };

  return function sync(method, model, options) {
    let promise;

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
}
