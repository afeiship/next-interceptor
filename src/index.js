import nx from '@jswork/next';
import pipe from '@jswork/pipe';
import '@jswork/next-filter-map';

const defaults = {
  async: false,
  items: []
};

const NxInterceptor = nx.declare('nx.Interceptor', {
  methods: {
    init: function (inOptions) {
      this.options = nx.mix(null, defaults, inOptions);
      this.activeItems = [];
    },
    applyItems: function (inWhen) {
      var entities = this.options.items;
      var filterType =
        typeof inWhen === 'function'
          ? inWhen
          : (item) => {
              if (!inWhen) return item;
              return item.type === inWhen;
            };
      var filterDisabled = (item) => !item.disabled;
      this.activeItems = nx.filterMap(entities, (item) => [
        filterDisabled(item) && filterType(item),
        item.fn
      ]);
    },
    compose: function (inPayload, inWhen) {
      var composer = this.options.async ? pipe.async : pipe.sync;
      this.applyItems(inWhen);
      return composer.apply(null, this.activeItems)(inPayload);
    }
  }
});

if (typeof module !== 'undefined' && module.exports && typeof wx === 'undefined') {
  module.exports = NxInterceptor;
}

export default NxInterceptor;
