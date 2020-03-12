import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('products', function() {
    this.route('show', {path: ':product_id'}, function() {
      this.route('variant', function() {
        this.route('show', {path: ':variant_id'});
      });
      this.route('component', function() {
        this.route('show', {path: ':component_id'});
      });
    });
  });
  this.route('categories', function() {
    this.route('show', {path: ':category_id'});
  });
  this.route('product-components');
  this.route('users', function() {
    this.route('show', {path: ':user_id'});
  });
});

export default Router;
