import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
// import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
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
    return this.get('ajax').request('/zulend-web/products', {
      type: "GET",
      data: {
        // page: this.get('page'),
        // perPage: this.get('per'),
        // total_pages: this.get('total-pages'),
        paramMapping: { total_pages: 'total-pages', page: 'page', perPage: 'per'},
        q: {
          name_cont: params.name_cont,
          category_eq: params.category_eq,
          s: params.sort ? `${params.sort} ${params.sortDir}` : ''
        }
      }
    }).then(data => {
      return data;
    }).catch(err => {
      console.log(err);
    })
  },

  actions: {
    queryChanged() {
      this.refresh();
    }
  }
});
