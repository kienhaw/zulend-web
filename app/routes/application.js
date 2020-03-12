import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {
  session: service(),

  beforeModel(){
    return this._loadUser();
  },

  _loadUser() {
    return this.get('application').loadUser();
  },

  sessionAuthenticated() {
    this._super();
    this._loadUser();
  },

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },

    abc() {
      this.refresh();
    },
    
    error(error) {
      if ([404, 500, 401].includes(error.status)) {
        this.replaceWith('error', { queryParams: { errorCode: error.status } });
      } else {
        return this.replaceWith('index');
      }
    }
  }
});
