import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model(params){
    return hash({
      product: this.modelFor('products.show').product,
      categories: this.modelFor('products.show').categories
    })
  }
});
