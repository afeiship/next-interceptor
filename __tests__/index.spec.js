require('../src');

jest.setTimeout(60 * 1000);

describe('api.basic test', () => {
  test('sync nx.interceptor', function () {
    const interceptor = new nx.Interceptor({
      items: [
        {
          type: 'request',
          fn: function (inOptions) {
            return inOptions + '1';
          }
        },
        {
          type: 'request',
          fn: function (inOptions) {
            return inOptions + '2';
          }
        },
        {
          type: 'response',
          fn: function (inOptions) {
            return inOptions + '3';
          }
        }
      ]
    });

    const result = interceptor.compose('a', 'request');
    expect(result).toBe('a12');
  });

  test('async nx.interceptor', function () {
    const interceptor = new nx.Interceptor({
      async: true,
      items: [
        {
          type: 'request',
          fn: function (inOptions) {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(inOptions + '1');
              }, 100);
            });
          }
        },
        {
          type: 'request',
          fn: function (inOptions) {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(inOptions + '2');
              }, 100);
            });
          }
        },
        {
          type: 'response',
          fn: function (inOptions) {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(inOptions + '3');
              }, 100);
            });
          }
        }
      ]
    });

    return interceptor.compose('a', 'request').then((result) => {
      expect(result).toBe('a12');
    });
  });

  // sync + async
  test('sync + async nx.interceptor', function () {
    const interceptor = new nx.Interceptor({
      async: true,
      items: [
        {
          type: 'request',
          fn: function (inOptions) {
            return inOptions + '1';
          }
        },
        {
          type: 'request',
          fn: function (inOptions) {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(inOptions + '2');
              }, 100);
            });
          }
        },
        {
          type: 'response',
          fn: function (inOptions) {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(inOptions + '3');
              }, 100);
            });
          }
        }
      ]
    });

    return interceptor.compose('a', 'request').then((result) => {
      expect(result).toBe('a12');
    });
  });
});
