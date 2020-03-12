import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject } from '@ember/service';

export default Controller.extend({
  ajax: inject(),

  actions: {
    save() {
      if(confirm("Are you sure to save this product?")){
        return this.get('ajax').request(`/zulend-web/products/${this.model.product.id}`, {
          type: "PATCH",
          data: {
            name: this.model.product.name,
            description: this.model.product.description,
            brand: this.model.product.brand,
            rto_price: this.model.product.rto_price,
            '3m_price': this.get('model.product.3m_price'),
            '6m_price': this.get('model.product.6m_price'),
            '1y_price': this.get('model.product.1y_price'),
            '2y_price': this.get('model.product.2y_price'),
            keywords: this.model.product.keywords,
            category_id: this.model.product.category.id,
          }
        }).then(data => {
          this.get('notification').clearAll(); this.get('notification').success('Product successfully saved!');
          this.send('abc');
        }).catch(err => {
          this.get('notification').clearAll(); this.get('notification').error(err.message);
        })
      }
    },

    setValue(val){
      this.set('ppRequired', Math.ceil(this.get(val)));
    },

    cancel() {
      this.setProperties({
        name: null,
        kpiRequired: null,
        ppRequired: null,
        price: null,
        description: null,
        category: null,
        minimumBasicPoint: null,
        showErrors: false,
        showDuplicated: false,
        inventoryQty: null,
        resources: null
      });

      $("#kpirequired, #pprequired").keydown(function () {
        // Save old value.
        if (!$(this).val() || parseInt($(this).val()) < 0)
        $(this).data("old", "");
      });
      $("#kpirequired, #pprequired").keyup(function () {
        // Check correct, else revert back to old value.
        if ($(this).val() || parseInt($(this).val()) > 0)
          ;
        else
          $(this).val($(this).data("old"));
      });
    },

    uploadFiles(file) {
      get(this, 'uploadFiles').perform(file);
    },
  }

});
