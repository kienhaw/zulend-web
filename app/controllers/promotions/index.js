import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject } from '@ember/service';

export default Controller.extend({
  ajax: inject(),

  queryParams: ['title_cont', 'status_eq'],

  actions: {
    create() {
      if(confirm("Are you sure to create this promotion?")){
        let arr = [];
        this.get('selectedProducts').map(product => arr.push(product.id));
        var data = new FormData();
        data.append("title", this.get('title'));
        data.append("product_ids", arr.join(','));
        data.append("start_at", moment(this.get('startAt')).format('YYYYMMDD'));
        data.append("end_at", moment(this.get('endAt')).format('YYYYMMDD'));
        data.append("image", this.get('image'));

        return this.get('ajax').request('/zulend-web/promotions', {
          type: "POST",
          enctype: 'multipart/form-data',
          processData: false,  // Important!
          contentType: false,
          cache: false,
          timeout: 600000,
          data: data
        }).then(data => {
          $('#newPromotion').modal('hide');
          this.get('notification').clearAll(); this.get('notification').success('Promotion successfully created!');
          this.send('abc');
        }).catch(err => {
          this.get('notification').clearAll(); this.get('notification').error(err.message);
        })
      }
    },

    setValue(param, date, altFormat) {
      this.set(param, altFormat)
    },

    uploadImage(image) {
      this.set('image', image.blob);
    },
  }

});
