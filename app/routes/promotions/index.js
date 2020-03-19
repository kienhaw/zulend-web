import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  ajax: service(),

  page: 1,
  perPage: 20,

  queryParams: {
    sort: {refreshModel: true},
    sortDir: {refreshModel: true},
  },

  model(params){
    return hash({
      promotions: this.get('ajax').request('/zulend-web/promotions', {
        type: "GET",
        data: {
          paramMapping: { total_pages: 'total-pages', page: 'page', perPage: 'per'},
          q: {
            title_cont: params.title_cont,
            status_eq: params.status_eq,
            s: params.sort ? `${params.sort} ${params.sortDir}` : ''
          }
        }
      }).then(data => {
        return data.data;
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
  },

  actions: {
    queryChanged() {
      this.refresh();
    }
  }
});
