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
        const hasKey = Reflect.has(target, key);
        const prevValue = hasKey && Reflect.get(target, key);
        const isPrevObservable = prevValue && prevValue.$isObservable;
        const isNextObservable = value && value.$isObservable;
        if (!hasKey && isNextObservable) {
          // Add observer to observable child
          const observer = () => {
            this.publish();
          };
          value.$subscribe(observer);
          this.observers[key] = observer;
        } else if (hasKey && isPrevObservable && !isNextObservable) {
          // Remove observer from observable child
          prevValue.$unsubscribe(this.observers[key]);
          delete this.observers[key];
        }
        return Reflect.set(target, key, value);
      },
      deleteProperty: (target, key) => {
        const prevValue = Reflect.get(target, key);
        const isPrevObservable = prevValue && prevValue.$isObservable;
        if (isPrevObservable) {
          // Remove observer from observable child
          prevValue.$unsubscribe(this.observers[key]);
          delete this.observers[key];
        }
        this.publish();
        return Reflect.deleteProperty(target, key);
      }
    };

    this.proxyObject = new Proxy(originalObject, proxyHandler);
    this.originObject = originalObject;
    // Subscribers for this observable object
    this.subscribers = [];
    // Observers for observable children update
    this.observers = {};

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
