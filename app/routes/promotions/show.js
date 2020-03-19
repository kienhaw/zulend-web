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
      promotion: this.get('ajax').request(`/zulend-web/promotions/${params.promotion_id}`, {
        type: "GET",
        data: {}
      }).then(data => {
        return data.data
      }),
      products: this.get('ajax').request('/zulend-web/products', {
        type: "GET",
        data: {
          paramMapping: { total_pages: 'total-pages', page: 'page', perPage: 'per'},
          q: {}
        }
      }).then(data => {
        return data.data;
      })
    })
  }
});
