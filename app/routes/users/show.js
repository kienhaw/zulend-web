import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
// import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  ajax: service(),

  page: 1,
  perPage: 10,

  queryParams: {
    sort: {refreshModel: true},
    sortDir: {refreshModel: true}
  },

  model(params){
    return hash({
      user: this.get('ajax').request(`/zulend-web/users/${params.user_id}`, {
        type: "GET",
        data: {}
      }).then(data => {
        return data.data
      })
    })
  }
});
