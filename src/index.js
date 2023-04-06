import nx from '@jswork/next';
import '@jswork/next-promise-compose';
import '@jswork/next-pipe';
import '@jswork/next-filter-map';

const defaults = {
  async: false,
  items: []
};

const NxInterceptor = nx.declare('nx.Interceptor', {
  methods: {
    init: function (inOptions) {
      this.options = nx.mix(null, defaults, inOptions);
    },
    compose: function (inPayload, inType) {
      var composer = this.options.async ? nx.promiseCompose : nx.pipe;
      var entities = this.options.items;
      var items = inType
        ? nx.filterMap(entities, (item) => [item.type === inType, item.fn])
        : entities.map((item) => item.fn);
      return composer.apply(null, items || [])(inPayload);
    }
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NxInterceptor;
}

export default NxInterceptor;
