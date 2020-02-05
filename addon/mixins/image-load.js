import { on } from '@ember/object/evented';
import { computed, set, Mixin, getWithDefault } from '@ember/object';
import { run } from '@ember/runloop';

export default Mixin.create({
  loaded:      false,
  errorThrown: false,

  classNameBindings: ['loaded', 'errorThrown'],

  defaultErrorText: computed('errorText', function() {
    return getWithDefault(this, 'errorText', 'Image failed to load');
  }),

  _resolveImage: on('didRender', function() {
    const component = this;
    const image     = component.querySelector('img');
    const isCached  = image[0].complete;

    /**
     * Removes event bindings and schedules an attribute change.
     *
     * @param type
     */
    function schedule(type) {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);

      run.schedule('afterRender', component, () => set(component, type, true));
    }

    /**
     * Handles error events during image load
     */
    function onError() {
      schedule('errorThrown');
    }

    /**
     * Handles the load event of the image.
     */
    function onLoad() {
      schedule('loaded');
    }

    if (!isCached) {
      image.addEventListener('load', onLoad);
      image.addEventListener('error', onError);
    } else {
      run.schedule('afterRender', component, () => set(component, 'loaded', true));
    }
  })
});
