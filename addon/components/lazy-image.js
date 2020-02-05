import { computed, get, set } from '@ember/object';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import ImageLoadMixin  from '../mixins/image-load';
import LazyImageMixin  from '../mixins/lazy-image';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, ImageLoadMixin, LazyImageMixin, {
  classNames: ['lazy-image-container'],

  concatenatedProperties: ['class'],

  class: ['lazy-image'],

  _classJoin: on('init', function() {
    const classArray = get(this, 'class');
    set(this, 'class', classArray.join(' '));
  }),

  _setupAttributes() {
    const img       = this.querySelector('img');
    const component = this;

    Object.keys(component).forEach((key) => {
      if (key.substr(0, 5) === 'data-' && !key.match(/Binding$/)) {
        img.setAttribute(key, component.get(key));
      }
    });
  },

  useDimensionsAttrs: computed('width', 'height', function() {
    return !this.get('width') || !this.get('height') ? false : true;
  })
});
