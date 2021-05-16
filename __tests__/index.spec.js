(function () {
  const NxInterceptor = require('../src');
  let mtMgr;

  describe('NxInterceptor.methods', function () {
    beforeEach(function () {
      mtMgr = new NxInterceptor({
        async: false,
        items: [
          {
            name: 'aa',
            type: 'response',
            fn: (data) => {
              return {
                version: 'v1',
                data
              };
            }
          },
          {
            name: 'std',
            type: 'response',
            fn: (res) => {
              return {
                key: 'bb',
                ...res
              };
            }
          },
          {
            name: 'price-to-float',
            type: 'response',
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
    });

    test('intercetpro for response should get reponse pipline(async)', function (done) {
      mtMgr.options.async = true;
      mtMgr.register({
        name: 'published-at',
        type: 'response',
        fn: (res) => {
          const { data } = res;
          return {
            ...res,
            data: { ...data, published: '2021-04-25' }
          };
        }
      });

      // console.log(mtMgr.gets());

      mtMgr
        .compose(
          {
            id: 100,
            price: 108.2143,
            login: 'afeiship'
          },
          'response'
        )
        .then((res) => {
          expect(res).toEqual({
            key: 'bb',
            version: 'v1',
            data: {
              id: 100,
              login: 'afeiship',
              price: 108.21,
              published: '2021-04-25'
            }
          });
          done();
        });
    });

    test('intercetpro for response should get reponse pipline(sync)', function () {
      mtMgr.options.async = false;
      const res = mtMgr.compose(
        {
          id: 100,
          price: 108.2143,
          login: 'afeiship'
        },
        'response'
      );

      // console.log(mtMgr.gets());

      expect(res).toEqual({
        key: 'bb',
        version: 'v1',
        data: { id: 100, login: 'afeiship', price: 108.21 }
      });
    });

    test('single types support', () => {
      var interceptor = new NxInterceptor({
        async: false,
        types: ['meta'],
        items: [
          {
            fn: (meta) => {
              const fields = meta.fields;
              meta.fields = fields.map((item) => item.toUpperCase());
              return meta;
            }
          },
          {
            fn: (meta) => {
              const fields = meta.fields;
              meta.fields = fields.map((item) => item + item);
              return meta;
            }
          }
        ]
      });

      const res = interceptor.compose({ fields: ['a', 'b'] });
      expect(res).toEqual({ fields: ['AA', 'BB'] });
    });
  });
})();
