import nx from '@jswork/next';

const nxPromiseCompose = nx.promiseComponse || require('@jswork/next-promise-compose');
const nxPipe = nx.pipe || require('@jswork/next-pipe');
const nxFilterMap = nx.filterMap || require('@jswork/next-filter-map');
const defaults = {
  async: false,
  items: []
};

const NxInterceptor = nx.declare('nx.Interceptor', {
  methods: {
    init: function (inOptions) {
      this.options = nx.mix(null, defaults, inOptions);
    },
    compose: function (inOptions, inType) {
      var composer = this.options.async ? nxPromiseCompose : nxPipe;
      var entities = this.options.items;
      var items = inType
        ? nxFilterMap(entities, (item) => [item.type === inType, item.fn])
        : entities.map((item) => item.fn);
      return composer.apply(null, items || [])(inOptions);
    }
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NxInterceptor;
}

export default NxInterceptor;
