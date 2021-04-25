(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var NxPluginManager = nx.PluginManager || require('@jswork/next-plugin-manager');
  var nxPromiseCompose = nx.promiseComponse || require('@jswork/next-promise-compose');
  var nxCompose = nx.compose || require('@jswork/next-compose');
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
        var composer = this.options.async ? nxPromiseCompose : nxCompose;
        var entities = this.manager.enabled();
        var items = nxFilterMap(
          entities,
          (item) => item.type === inType,
          (item) => item.fn
        );
        return composer.apply(null, items || [])(inOptions);
      },
      /* Proxy manager methods: */
      'register,unregister,gets,enable,disable': function (inName) {
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
