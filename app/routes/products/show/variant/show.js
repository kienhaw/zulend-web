import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
// import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  ajax: service(),

  model(params) {
    return hash({
      product: this.modelFor('products.show').product,
      variant: this.get('ajax').request(`/zulend-web/variants/${params.variant_id}`, {
        type: "GET",
        data: {}
      }).then(data => {
        return data.data;
      }),
    })
  },

  actions: {
    queryChanged() {
      this.refresh();
    }
  }
});
