(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var NxPluginManager = nx.PluginManager || require('@jswork/next-plugin-manager');
  var nxPromiseCompose = nx.promiseComponse || require('@jswork/next-promise-compose');
  var nxCompose = nx.compose || require('@jswork/next-compose');
  var nxFilterMap = nx.filterMap || require('@jswork/next-filter-map');
  var DEFAULT_OPTIONS = {
    async: true,
    items: []
  };

  var NxInterceptor = nx.declare('nx.Interceptor', {
    methods: {
      init: function (inOptions) {
        this.options = nx.mix(null, DEFAULT_OPTIONS, inOptions);
        this.manager = NxPluginManager.getInstance(this.options.items, 'name');
      },
      register: function (inName, inType, inFn) {
        this.manager.register({ name: inName, type: inType, fn: inFn });
      },
      unregister: function (inName) {
        this.manager.unregister(inName);
      },
      compose: function (inOptions) {
        var composer = this.options.async ? nxPromiseCompose : nxCompose;
        var items = this.options.items.map(function (item) {
          return item.fn;
        });

        return composer.apply(null, items || [])(inOptions);
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxInterceptor;
  }
})();
