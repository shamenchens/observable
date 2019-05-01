export default class Observable {
  constructor(originalObject) {
    const proxyHandler = {
      get: (target, key) => {
        if (/^\$/.test(key.toString())) {
          return Reflect.get(this, key);
        } else {
          return Reflect.get(target, key);
        }
      },
      set: (target, key, nextValue) => {
        const hasKey = Reflect.has(target, key);
        const prevValue = hasKey && Reflect.get(target, key);
        if (prevValue !== nextValue) {
          if (prevValue && prevValue.$isObservable) {
            prevValue.$unsubscribe(this.publish);
          }
          if (nextValue && nextValue.$isObservable) {
            nextValue.$subscribe(this.publish);
          }
          this.publish();
        }
        return Reflect.set(target, key, nextValue);
      },
      deleteProperty: (target, key) => {
        const prevValue = Reflect.get(target, key);
        if (prevValue && prevValue.$isObservable) {
          prevValue.$unsubscribe(this.publish);
        }
        this.publish();
        return Reflect.deleteProperty(target, key);
      }
    };

    this.proxyObject = new Proxy(originalObject, proxyHandler);
    this.originObject = originalObject;
    // Subscribers for this observable object
    this.subscribers = [];

    this.$subscribe = this.$subscribe.bind(this);
    this.$unsubscribe = this.$unsubscribe.bind(this);
    this.publish = this.publish.bind(this);
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

  publish() {
    this.subscribers.forEach(callback => {
      callback();
    });
  }
}
