export default class Observable {
  constructor(originalObject) {
    const proxyHandler = {
      get: (target, key) => {
        if (/^\$/.test(key.toString())) {
          const value = Reflect.get(this, key);
          return typeof value === 'function' ? value.bind(this) : value;
        } else {
          return Reflect.get(target, key);
        }
      },
      set: (target, key, value) => {
        if (!(Array.isArray(target) && key === 'length')) {
          this.publish();
        }
        return Reflect.set(target, key, value);
      },
      deleteProperty: (target, key) => {
        this.publish();
        return Reflect.deleteProperty(target, key);
      }
    };

    this.proxyObject = new Proxy(originalObject, proxyHandler);
    this.originObject = originalObject;
    this.subscribers = [];

    return this.proxyObject;
  }

  get $isObservable() {
    return true;
  }

  $subscribe(callback) {
    if (typeof callback !== 'function') return;
    this.subscribers.push(callback);
  }

  $unsubscribe(callback) {
    if (typeof callback !== 'function') return;
    const index = this.subscribers.indexOf(callback);
    if (index >= 0) {
      this.subscribers.splice(index, 1);
    }
  }

  $toJSON() {
    return JSON.stringify(this.originObject);
  }

  publish() {
    this.subscribers.forEach(callback => {
      callback();
    });
  }
}
