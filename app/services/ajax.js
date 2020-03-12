import AjaxService from 'ember-ajax/services/ajax';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';

export default AjaxService.extend({
  session: service(),

  headers: computed('session.data.authenticated', {
    get() {
      let headers = {};
      let { access_token } = this.get('session.data.authenticated');
      if (isPresent(access_token)) {
        headers['authorization'] = `Bearer ${access_token}`;
      }
      return headers;
    }
  })
});
