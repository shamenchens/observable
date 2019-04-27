import Observable from '../src/index';

describe('Observable', () => {
  describe('Observable Array', () => {
    let originArray;
    let observableArray;

    beforeEach(() => {
      originArray = [1, 2];
      observableArray = new Observable(originArray);
    });

    it('Should be an observable array', () => {
      expect(Array.isArray(observableArray)).toBeTruthy();
      expect(observableArray.$isObservable).toBeTruthy();
    });

    it('Should have same value as original', () => {
      observableArray.forEach((value, index) => {
        expect(value).toEqual(originArray[index]);
      });
    });

    it('Should serialize to JSON', () => {
      const json = observableArray.$toJSON();
      expect(json).toEqual(JSON.stringify(originArray));
    });

    it('Should subscribe/unsubscribe to array mutation', () => {
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();

      observableArray.$subscribe(subscriber1);
      expect(subscriber1).toHaveBeenCalledTimes(0);
      expect(subscriber2).toHaveBeenCalledTimes(0);

      observableArray.push(3);
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(0);

      observableArray.$unsubscribe(subscriber1);
      observableArray.$subscribe(subscriber2);
      observableArray.push(4);
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(1);

      observableArray.$unsubscribe(subscriber2);
      observableArray.push(5);
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(1);
    });

    it('Should get notify from observable children update', () => {
      const subscriberParent = jest.fn();
      const subscriberChild = jest.fn();

      const observableChild = new Observable([]);
      observableArray.push(observableChild);

      observableArray.$subscribe(subscriberParent);
      observableChild.$subscribe(subscriberChild);
      expect(subscriberParent).toHaveBeenCalledTimes(0);
      expect(subscriberChild).toHaveBeenCalledTimes(0);

      observableChild.push(1);
      expect(subscriberParent).toHaveBeenCalledTimes(1);
      expect(subscriberChild).toHaveBeenCalledTimes(1);

      observableArray[observableArray.indexOf(observableChild)] = null;
      expect(subscriberParent).toHaveBeenCalledTimes(2);
      expect(subscriberChild).toHaveBeenCalledTimes(1);

      observableChild.push(2);
      expect(subscriberParent).toHaveBeenCalledTimes(2);
      expect(subscriberChild).toHaveBeenCalledTimes(2);
    });
  });

  describe('Observable Object', () => {
    let originObject;
    let observableObject;

    beforeEach(() => {
      originObject = {
        id: 1,
        name: {
          firstName: 'John',
          lastName: 'Doe'
        }
      };
      observableObject = new Observable(originObject);
    });

    it('Should be an observable object', () => {
      expect(typeof observableObject).toEqual('object');
      expect(observableObject.$isObservable).toBeTruthy();
    });

    it('Should have same value as original', () => {
      for (let key in observableObject) {
        expect(observableObject[key]).toEqual(originObject[key]);
      }
    });

    it('Should serialize to JSON', () => {
      const json = observableObject.$toJSON();
      expect(json).toEqual(JSON.stringify(originObject));
    });

    it('Should subscribe/unsubscribe to object mutation', () => {
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();

      observableObject.$subscribe(subscriber1);
      expect(subscriber1).toHaveBeenCalledTimes(0);
      expect(subscriber2).toHaveBeenCalledTimes(0);

      observableObject.id = 2;
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(0);

      observableObject.name.firstName = 'Jane';
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(0);

      observableObject.$unsubscribe(subscriber1);
      observableObject.$subscribe(subscriber2);
      observableObject.id = 3;
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(1);

      observableObject.$unsubscribe(subscriber2);
      observableObject.id = 4;
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(1);
    });

    it('Should get notify from observable children update', () => {
      const subscriberParent = jest.fn();
      const subscriberChild = jest.fn();

      const observableChild = new Observable({});
      observableObject.children = observableChild;

      observableObject.$subscribe(subscriberParent);
      observableChild.$subscribe(subscriberChild);
      expect(subscriberParent).toHaveBeenCalledTimes(0);
      expect(subscriberChild).toHaveBeenCalledTimes(0);

      observableChild.id = 1;
      expect(subscriberParent).toHaveBeenCalledTimes(1);
      expect(subscriberChild).toHaveBeenCalledTimes(1);

      observableObject.children = null;
      expect(subscriberParent).toHaveBeenCalledTimes(2);
      expect(subscriberChild).toHaveBeenCalledTimes(1);

      observableChild.id = 2;
      expect(subscriberParent).toHaveBeenCalledTimes(2);
      expect(subscriberChild).toHaveBeenCalledTimes(2);

      observableObject.children = observableChild;
      expect(subscriberParent).toHaveBeenCalledTimes(3);
      expect(subscriberChild).toHaveBeenCalledTimes(2);

      delete observableObject.children;
      expect(subscriberParent).toHaveBeenCalledTimes(4);
      expect(subscriberChild).toHaveBeenCalledTimes(2);
    });
  });
});
