(function () {
  const NxInterceptor = require('../src');
  const mtMgr = new NxInterceptor({
    async: false,
    items: [
      {
        name: 'aa',
        fn: (data) => {
          return {
            version: 'v1',
            data
          };
        }
      },
      {
        name: 'std',
        fn: (res) => {
          return {
            key: 'bb',
            ...res
          };
        }
      },
      {
        name: 'price-to-float',
        fn: (res) => {
          const { data } = res;
          const { price, ...opts } = data;
          return {
            ...res,
            data: {
              ...opts,
              price: parseFloat(price.toFixed(2))
            }
          };
        }
      }
    ]
  });

  describe('NxInterceptor.methods', function () {
    test('intercetpro for response should get reponse pipline(async)', function (done) {
      mtMgr.options.async = true;
      mtMgr
        .compose({
          id: 100,
          price: 108.2143,
          login: 'afeiship'
        })
        .then((res) => {
          expect(res).toEqual({
            key: 'bb',
            version: 'v1',
            data: { id: 100, login: 'afeiship', price: 108.21 }
          });
          done();
        });
    });

    test('intercetpro for response should get reponse pipline(sync)', function () {
      mtMgr.options.async = false;
      const res = mtMgr.compose({
        id: 100,
        price: 108.2143,
        login: 'afeiship'
      });

      expect(res).toEqual({
        key: 'bb',
        version: 'v1',
        data: { id: 100, login: 'afeiship', price: 108.21 }
      });
    });
  });
})();
