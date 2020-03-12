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
      product: this.get('ajax').request(`/zulend-web/products/${params.product_id}`, {
        type: "GET",
        data: {}
      }).then(data => {
        return data.data
      }),
      categories: this.get('ajax').request(`/zulend-web/categories`, {
        type: "GET",
        data: {}
      }).then(data => {
        return data.data
      }),
      variants: this.get('ajax').request(`/zulend-web/products/${params.product_id}/variants`, {
        type: "GET",
        data: {}
      }).then(data =>{
        return data.data
      }),
      components: this.get('ajax').request(`/zulend-web/products/${params.product_id}/components`, {
        type: "GET",
        data: {}
      }).then(data =>{
        return data.data
      }),
    })
  }
});
