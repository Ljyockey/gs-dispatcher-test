describe('EventDispatcher', () => {

  let testObj

  beforeEach(() => {
    testObj = {}
  })

  it('Should mixin Dispatcher methods on given object', () => {
    EventDispatcher.mixin(testObj);

    expect(typeof testObj.addEventListener).toBe('function');
    expect(typeof testObj.dispatchEvent).toBe('function');
    expect(typeof testObj.removeEventListener).toBe('function');
    expect(typeof testObj.hasListenerFor).toBe('function');
    expect(typeof testObj.hasCallbackFor).toBe('function');
  });

  it('Should add event listener to internal map', () => {
    const testFunction = function () {
      console.log('a test function');
    };
    EventDispatcher.mixin(testObj);
    testObj.addEventListener('test', testFunction);

    expect(testObj.hasListenerFor('test')).toBeTruthy();
    expect(testObj.hasCallbackFor('test', testFunction)).toBeTruthy();
  });

  it('Should allow multiple event listeners to be added for one event', () => {
    const testFunction = function () {
      console.log('a test function');
    };
    const testFunction2 = function () {
      console.log('a second test function');
    };
    EventDispatcher.mixin(testObj);
    testObj.addEventListener('test', testFunction);
    testObj.addEventListener('test', testFunction2);

    expect(testObj.hasListenerFor('test')).toBeTruthy();
    expect(testObj.hasCallbackFor('test', testFunction)).toBeTruthy();
    expect(testObj.hasCallbackFor('test', testFunction2)).toBeTruthy();
  });

  it('Should call registered callbacks when event fired', () => {
    let success1 = false;
    let success2 = false;
    const testFunction = function () {
        success1 = true;
    };
    const testFunction2 = function () {
        success2 = true;
    };
    EventDispatcher.mixin(testObj);
    testObj.addEventListener('test', testFunction);
    testObj.addEventListener('test', testFunction2);
    testObj.dispatchEvent('test');

    expect(success1).toBeTruthy();
    expect(success2).toBeTruthy();
  });

  it('Should not call registered callback if removed', () => {
    let success1 = false;
    let success2 = false;
    const testFunction = function () {
        success1 = true;
    };
    const testFunction2 = function () {
        throw new Error('I should not be called');
    };
    EventDispatcher.mixin(testObj);
    testObj.addEventListener('test', testFunction);
    testObj.addEventListener('test', testFunction2);
    testObj.removeEventListener('test', testFunction2);
    testObj.dispatchEvent('test');

    expect(success1).toBeTruthy();
    expect(success2).toBeFalsy();
  });

  it('Should return false hasListenerFor if method is not added', () => {
    let success1 = false;
    const scope = {
        executeSuccess: true
    };
    const testFunction = function () {
        if (this.executeSuccess) {
            success1 = true;
        }
    };
    EventDispatcher.mixin(testObj);
    testObj.addEventListener('test', testFunction, scope);
    testObj.dispatchEvent('test');

    expect(testObj.hasListenerFor('test')).toBeTruthy();
    expect(testObj.hasListenerFor('test2')).toBeFalsy();
  });

  it('Should return false hasCallbackFor if method is not added', () => {
    let success1 = false;
    const scope = {
        executeSuccess: true
    };
    const testFunction = function () {
        if (this.executeSuccess) {
            success1 = true;
        }
    };
    EventDispatcher.mixin(testObj);
    testObj.addEventListener('test', testFunction, scope);
    testObj.dispatchEvent('test');

    expect(testObj.hasCallbackFor("test", testFunction)).toBeTruthy();
    expect(testObj.hasCallbackFor("test", function () {})).toBeFalsy();
  });

  it('Should allow callbacks to be executed in a given scope', () => {
    let success1 = false;
    const scope = {
        executeSuccess: true
    };
    const testFunction = function () {
        if (this.executeSuccess) {
            success1 = true;
        }
    };
    EventDispatcher.mixin(testObj);
    testObj.addEventListener('test', testFunction, scope);
    testObj.dispatchEvent('test');

    expect(success1).toBeTruthy();
  });

  it('Should not share the same listener map', () => {
    var testObj2 = {};
    var success1 = false;
    var success2 = false;

    var testFunction = function () {
      success1 = true;
    };
    var testFunction2 = function () {
      success2 = true;
    };

    EventDispatcher.mixin(testObj);
    EventDispatcher.mixin(testObj2);
    testObj.addEventListener('test', testFunction);
    testObj2.addEventListener('test', testFunction2);
    testObj.dispatchEvent('test');

    expect(success1).toBeTruthy();
    expect(success2).toBeFalsy();
  });
});