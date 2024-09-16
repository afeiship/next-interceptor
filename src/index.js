import nx from '@jswork/next';
import pipe from '@jswork/pipe';
import '@jswork/next-filter-map';

const defaults = {
  async: false,
  items: [],
  priority: 1000
};

const NxInterceptor = nx.declare('nx.Interceptor', {
  methods: {
    init: function (inOptions) {
      this.options = nx.mix(null, defaults, inOptions);
      this.activeItems = [];
    },
    processItems: function () {
      const { items, priority } = this.options;
      return items
        .map((item) => {
          item.priority = item.priority || priority;
          return item;
        })
        .sort((a, b) => a.priority - b.priority);
    },
    applyItems: function (inWhen) {
      const entities = this.processItems();
      const filterType =
        typeof inWhen === 'function'
          ? inWhen
          : (item) => {
              if (!inWhen) return item;
              return item.type === inWhen;
            };
      const filterDisabled = (item) => !item.disabled;
      this.activeItems = nx.filterMap(entities, (item) => [
        filterDisabled(item) && filterType(item),
        item.fn
      ]);
    },
    compose: function (inPayload, inWhen) {
      const composer = this.options.async ? pipe.async : pipe.sync;
      this.applyItems(inWhen);
      return composer.apply(null, this.activeItems)(inPayload);
    }
  }
});

if (typeof module !== 'undefined' && module.exports && typeof wx === 'undefined') {
  module.exports = NxInterceptor;
}

export default NxInterceptor;
