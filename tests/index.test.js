import Observable from '../src/index';

describe('Observable', () => {
  describe('Observable Array', () => {
    let originArray;
    let observableArray;

    beforeEach(() => {
      originArray = [3, 2, 1];
      observableArray = new Observable(originArray);
    });

    it('Should be an observable array', () => {
      expect(Array.isArray(observableArray)).toBeTruthy();
      expect(observableArray.$isObservable).toBeTruthy();
    });

    it('Should have same value as original array', () => {
      observableArray.forEach((value, index) => {
        expect(value).toEqual(originArray[index]);
      });
    });

    it('Should publish to subscribers when assigning different value', () => {
      const subscriber1 = jest.fn();
      expect(subscriber1).not.toHaveBeenCalled();

      observableArray.$subscribe(subscriber1);
      observableArray[0] = 1;
      expect(subscriber1).toHaveBeenCalled();
    });

    it(`Shouldn't publish to subscribers when assigning same value`, () => {
      const subscriber1 = jest.fn();
      expect(subscriber1).not.toHaveBeenCalled();

      observableArray.$subscribe(subscriber1);
      observableArray[0] = 3;
      expect(subscriber1).not.toHaveBeenCalled();
    });

    it('Should publish to subscribers when assigning array length', () => {
      const subscriber1 = jest.fn();
      expect(subscriber1).not.toHaveBeenCalled();

      observableArray.$subscribe(subscriber1);
      observableArray.length = 0;
      expect(subscriber1).toHaveBeenCalled();
    });

    it(`Shouldn't publish to unsubscribed subscribers`, () => {
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();

      observableArray.$subscribe(subscriber1);
      observableArray.$subscribe(subscriber2);
      expect(subscriber1).toHaveBeenCalledTimes(0);
      expect(subscriber2).toHaveBeenCalledTimes(0);

      observableArray.push(3);
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(1);

      observableArray.$unsubscribe(subscriber1);
      observableArray.push(4);
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(2);
    });

    describe('Observable Array w/ Observable Children', () => {
      it('Should publish to subscribers when observable children updated', () => {
        const subscriberParent = jest.fn();

        const observableChild = new Observable([]);
        observableArray.push(observableChild);

        observableArray.$subscribe(subscriberParent);
        expect(subscriberParent).not.toHaveBeenCalled();

        // Updating observable child should trigger publish on parent.
        observableChild.push(1);
        expect(subscriberParent).toHaveBeenCalled();
      });

      it('Should update subscriber when observable replaced by another observable', () => {
        const subscriberParent = jest.fn();

        const observableChild1 = new Observable([]);
        const observableChild2 = new Observable([]);
        observableArray.push(observableChild1);

        observableArray.$subscribe(subscriberParent);
        expect(subscriberParent).not.toHaveBeenCalled();

        // Updating observable child should trigger publish on parent.
        observableChild1[0] = 1;
        expect(subscriberParent).toHaveBeenCalledTimes(1);

        // Replacing observable child should trigger publish on parent.
        const index = observableArray.indexOf(observableChild1);
        observableArray[index] = observableChild2;
        expect(subscriberParent).toHaveBeenCalledTimes(2);

        // Removed observable child shouldn't trigger publish on parent.
        observableChild1[0] = 2;
        expect(subscriberParent).toHaveBeenCalledTimes(2);

        // Newly added observable child should trigger publish on parent.
        observableChild2[0] = 1;
        expect(subscriberParent).toHaveBeenCalledTimes(3);
      });

      it(`Shouldn't publish to subscribers for removed observable children`, () => {
        const subscriberParent = jest.fn();

        const observableChild = new Observable([]);
        observableArray.push(observableChild);

        observableArray.$subscribe(subscriberParent);
        expect(subscriberParent).not.toHaveBeenCalled();

        // Removing observable child should trigger publish on parent.
        const index = observableArray.indexOf(observableChild);
        observableArray[index] = null;
        expect(subscriberParent).toHaveBeenCalledTimes(1);

        // Removed observable child shouldn't trigger publish on parent.
        observableChild.push(1);
        expect(subscriberParent).toHaveBeenCalledTimes(1);
      });
    });

    describe('Mutator Methods', () => {
      it('Should publish to subscribers for mutator method - copyWithin', () => {
        const subscriber1 = jest.fn();
        expect(subscriber1).not.toHaveBeenCalled();

        observableArray.$subscribe(subscriber1);
        observableArray.copyWithin(0, 1);
        expect(subscriber1).toHaveBeenCalled();
      });

      it('Should publish to subscribers for mutator method - fill', () => {
        const subscriber1 = jest.fn();
        expect(subscriber1).not.toHaveBeenCalled();

        observableArray.$subscribe(subscriber1);
        observableArray.fill(0);
        expect(subscriber1).toHaveBeenCalled();
      });

      it('Should publish to subscribers for mutator method - pop', () => {
        const subscriber1 = jest.fn();
        expect(subscriber1).not.toHaveBeenCalled();

        observableArray.$subscribe(subscriber1);
        observableArray.pop();
        expect(subscriber1).toHaveBeenCalled();
      });

      it('Should publish to subscribers for mutator method - push', () => {
        const subscriber1 = jest.fn();
        expect(subscriber1).not.toHaveBeenCalled();

        observableArray.$subscribe(subscriber1);
        observableArray.push(3);
        expect(subscriber1).toHaveBeenCalled();
      });

      it('Should publish to subscribers for mutator method - reverse', () => {
        const subscriber1 = jest.fn();
        expect(subscriber1).not.toHaveBeenCalled();

        observableArray.$subscribe(subscriber1);
        observableArray.reverse();
        expect(subscriber1).toHaveBeenCalled();
      });

      it('Should publish to subscribers for mutator method - shift', () => {
        const subscriber1 = jest.fn();
        expect(subscriber1).not.toHaveBeenCalled();

        observableArray.$subscribe(subscriber1);
        observableArray.shift();
        expect(subscriber1).toHaveBeenCalled();
      });

      it('Should publish to subscribers for mutator method - sort', () => {
        const subscriber1 = jest.fn();
        expect(subscriber1).not.toHaveBeenCalled();

        observableArray.$subscribe(subscriber1);
        observableArray.sort();
        expect(subscriber1).toHaveBeenCalled();
      });

      it('Should publish to subscribers for mutator method - splice', () => {
        const subscriber1 = jest.fn();
        expect(subscriber1).not.toHaveBeenCalled();

        observableArray.$subscribe(subscriber1);
        observableArray.splice(0, 1);
        expect(subscriber1).toHaveBeenCalled();
      });

      it('Should publish to subscribers for mutator method - unshift', () => {
        const subscriber1 = jest.fn();
        expect(subscriber1).not.toHaveBeenCalled();

        observableArray.$subscribe(subscriber1);
        observableArray.unshift(0);
        expect(subscriber1).toHaveBeenCalled();
      });
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

    it('Should have same value as original object', () => {
      for (let key in observableObject) {
        expect(observableObject[key]).toEqual(originObject[key]);
      }
    });

    it('Should publish to subscribers when assigning different value', () => {
      const subscriber1 = jest.fn();

      observableObject.$subscribe(subscriber1);
      expect(subscriber1).not.toHaveBeenCalled();

      observableObject.id = 2;
      expect(subscriber1).toHaveBeenCalled();
    });

    it(`Shouldn't publish to subscribers when assigning different value`, () => {
      const subscriber1 = jest.fn();

      observableObject.$subscribe(subscriber1);
      expect(subscriber1).not.toHaveBeenCalled();

      observableObject.id = 1;
      expect(subscriber1).not.toHaveBeenCalled();
    });

    it(`Shouldn't publish to unsubscribed subscribers`, () => {
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();

      observableObject.$subscribe(subscriber1);
      observableObject.$subscribe(subscriber2);
      expect(subscriber1).toHaveBeenCalledTimes(0);
      expect(subscriber2).toHaveBeenCalledTimes(0);

      observableObject.id = 2;
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(1);

      observableObject.$unsubscribe(subscriber1);
      observableObject.id = 3;
      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(2);
    });

    describe('Observable Object w/ Observable Children', () => {
      it('Should publish to subscribers when observable children update', () => {
        const subscriberParent = jest.fn();

        const observableChild = new Observable({});
        observableObject.children = observableChild;

        observableObject.$subscribe(subscriberParent);
        expect(subscriberParent).not.toHaveBeenCalled();

        // Updating observable child should trigger publish on parent.
        observableChild.id = 1;
        expect(subscriberParent).toHaveBeenCalled();
      });

      it('Should update subscriber when observable replaced by another observable', () => {
        const subscriberParent = jest.fn();

        const observableChild1 = new Observable({});
        const observableChild2 = new Observable({});
        observableObject.children = observableChild1;

        observableObject.$subscribe(subscriberParent);
        expect(subscriberParent).not.toHaveBeenCalled();

        // Updating observable child should trigger publish on parent.
        observableChild1.id = 1;
        expect(subscriberParent).toHaveBeenCalledTimes(1);

        // Replacing observable child should trigger publish on parent.
        observableObject.children = observableChild2;
        expect(subscriberParent).toHaveBeenCalledTimes(2);

        // Removed observable child shouldn't trigger publish on parent.
        observableChild1.id = 1;
        expect(subscriberParent).toHaveBeenCalledTimes(2);

        // Newly added observable child should trigger publish on parent.
        observableChild2.id = 1;
        expect(subscriberParent).toHaveBeenCalledTimes(3);
      });

      it(`Shouldn't publish to subscribers for removed observable children`, () => {
        const subscriberParent = jest.fn();

        const observableChild = new Observable({});
        observableObject.children = observableChild;

        observableObject.$subscribe(subscriberParent);
        expect(subscriberParent).not.toHaveBeenCalled();

        // Removing observable child should trigger publish on parent.
        delete observableObject.children;
        expect(subscriberParent).toHaveBeenCalledTimes(1);

        // Removed observable child shouldn't trigger publish on parent.
        observableChild.id = 2;
        expect(subscriberParent).toHaveBeenCalledTimes(1);
      });
    });
  });
});
