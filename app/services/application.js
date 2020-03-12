import Service, { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import ENV from '../config/environment';

export default Service.extend({
  session: service(),
  store: service(),
  ajax: service(),

  loadUser() {
    if (this.get('session.isAuthenticated')) {
      this.get('ajax').request('/zulend-web/profile', {
        method: 'GET',
        data: {}
      }).then(data => {
        this.set('currentUser', data.data);
      }).catch(err =>{
        console.log(err);
      });
    } else {
      return RSVP.resolve();
    }
  }

});
