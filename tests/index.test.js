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

    it('Should be able to subscribe/unsubscribe to array mutation', () => {
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

    it('Should be able to serialize to JSON', () => {
      const json = observableArray.$toJSON();
      expect(json).toEqual(JSON.stringify(originArray));
    });
  });
});
