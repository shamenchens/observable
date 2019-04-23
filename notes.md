# Observable

Creation:

- `new Observable()`

Pub/Sub:

- `subscribe(subscriber)`
- `unsubscribe(subscriber)`
- `publish()`

# ObservableArray (extends Observable)

Example:

```js
const array = new ObservableArray([1, 2]);

const subscriber = () => console.log('Something changed!');

array.subscribe(subscriber);

array.push(3); // Will call publish()
array[1] = 5; // Will also call publish()

array.unsubscribe(subscriber);
```

Creation:

- `new ObservableArray(array)`

Mutating methods (should call `publish()`):

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- ...

Other methods:

- `slice()`
- `map()`
- `filter()`
- ...

Items:

- `observableArray[0]`
- `observableArray[0] = 'blue'` (should call `publish()`)

Serialization:

- `toJSON()`

# ObservableObject (extends Observable)

Creation:

- `new ObservableObject(object)`

Attributes:

- `observableObject.color`
- `observableObject.color = 'blue'` (should call `publish()`)

# Notes

- When we add an observable item/attribute to an observable array/object, the parent should `subscribe()` to the child so it can automatically `publish()` when the child `publish()`.
- When we remove an observable item/attribute from an observable array/object, the parent should `unsubscribe()` from the child
