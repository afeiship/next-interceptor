(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var NxPluginManager = nx.PluginManager || require('@jswork/next-plugin-manager');
  var nxPromiseCompose = nx.promiseComponse || require('@jswork/next-promise-compose');
  var nxCompose = nx.compose || require('@jswork/next-compose');
  var nxFilterMap = nx.filterMap || require('@jswork/next-filter-map');
  var DEFAULT_OPTIONS = {
    async: true,
    type: 'response',
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
        var self = this;
        var composer = this.options.async ? nxPromiseCompose : nxCompose;
        var items = nxFilterMap(
          self.options.items,
          function (item) {
            return item.type === self.options.type;
          },
          function (item) {
            return item.fn;
          }
        );

        return composer.apply(null, items || [])(inOptions);
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxInterceptor;
  }
})();
