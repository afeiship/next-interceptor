(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var NxPluginManager = nx.PluginManager || require('@jswork/next-plugin-manager');
  var nxPromiseCompose = nx.promiseComponse || require('@jswork/next-promise-compose');
  var nxPipe = nx.pipe || require('@jswork/next-pipe');
  var nxFilterMap = nx.filterMap || require('@jswork/next-filter-map');
  var DEFAULT_OPTIONS = {
    async: false,
    types: ['request', 'response'],
    items: []
  };

  var NxInterceptor = nx.declare('nx.Interceptor', {
    methods: {
      init: function (inOptions) {
        this.options = nx.mix(null, DEFAULT_OPTIONS, inOptions);
        this.manager = NxPluginManager.getInstance(this.options.items, 'name');
      },
      compose: function (inOptions, inType) {
        var composer = this.options.async ? nxPromiseCompose : nxPipe;
        var entities = this.manager.enabled();
        var filterFn = (item) => item.fn;
        var items = inType
          ? nxFilterMap(entities, (item) => [item.fn, item.type === inType])
          : entities.map(filterFn);
        return composer.apply(null, items || [])(inOptions);
      },
      /* Proxy manager methods: */
      'register,unregister,enable,disable': function (inName) {
        return function () {
          var ctx = this.manager;
          return ctx[inName].apply(ctx, arguments);
        };
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxInterceptor;
  }
})();
