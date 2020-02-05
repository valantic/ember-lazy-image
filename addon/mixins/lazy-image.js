import { on } from '@ember/object/evented';
import { computed, set, get, Mixin, setProperties } from '@ember/object';
import { dasherize } from '@ember/string';
import Cache from '../lib/cache';

export default Mixin.create({
  didInsertElement() {
    setProperties(this, {
      viewportScrollSensitivity: 20,
      viewportListeners: [
        { context: window, event: 'scroll.scrollable' },
        { context: window, event: 'resize.resizable' },
        { context: document, event: 'touchmove.scrollable' }
      ]
    });

    this._super(...arguments);
  },

  _cache: Cache.create(),

  lazyUrl: null,

  handleDidRender: on('didRender', function() {
    this._setupAttributes();
  }),

  handleImageUrl: on('didInitAttrs', function() {
    this._setImageUrl();
  }),

  _setImageUrl: on('didEnterViewport', function() {
    const url             = get(this, 'url');
    const cache           = get(this, '_cache');
    const lazyUrl         = get(this, 'lazyUrl');
    const cacheKey        = get(this, '_cacheKey');
    const viewportEntered = get(this, 'viewportEntered');

    if (cacheKey && get(cache, cacheKey)) {
      set(this, 'lazyUrl', url);
    }

    if (viewportEntered && lazyUrl === null) {
      set(this, 'lazyUrl', url);

      if (cacheKey) {
        set(cache, cacheKey, true);
      }
    }
  }),

  _cacheKey: computed('url', function() {
    var url = this.get('url');
    var key;

    if (url) {
      key = dasherize(url.replace(/^http[s]?\:\/\/|\.|\//g, ''));
    }

    if (key) {
      return key;
    }
  })
});
