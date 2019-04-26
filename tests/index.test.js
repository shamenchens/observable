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
      const subscriber1 = jest.fn();
      const subscriberChild = jest.fn();

      const observableChild = new Observable([]);
      observableArray.push(observableChild);

      observableArray.$subscribe(subscriber1);
      observableChild.$subscribe(subscriberChild);
      expect(subscriber1).toHaveBeenCalledTimes(0);
      expect(subscriberChild).toHaveBeenCalledTimes(0);

      observableChild.push(1);
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriberChild).toHaveBeenCalledTimes(1);

      observableArray[observableArray.indexOf(observableChild)] = null;
      expect(subscriber1).toHaveBeenCalledTimes(2);
      expect(subscriberChild).toHaveBeenCalledTimes(1);

      observableChild.push(2);
      expect(subscriber1).toHaveBeenCalledTimes(2);
      expect(subscriberChild).toHaveBeenCalledTimes(2);
    });
  });
});
