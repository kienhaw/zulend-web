import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject } from '@ember/service';

export default Controller.extend({
  ajax: inject(),

  queryParams: ['name_cont', 'category_eq'],

  paginat: computed('model.data.[]', function(){
    let arr = [];
    for(var i = 0; i < this.model.meta.total_pages; i++){
      arr.push(i+1);
    }
    return arr;
  }),

  componentTypes: computed(function(){
    return ['specification', 'add-on', 'fixway services'];
  }),
  //
  // uploadFiles: task(function * (file) {
  //   try {
  //     let response = yield file.upload(`/hrsm-dashboard/files/upload-blob`, { method: 'POST', headers: get(this, 'ajax.headers') });
  //     this.set('resources', response.body);
  //     this.set('showErrors', false);
  //     this.get('notification').clearAll(); this.get('notification').success('Attachments uploaded Successfully');
  //   } catch (e) {
  //     this.get('notification').clearAll(); this.get('notification').error(e);
  //   }
  // }).maxConcurrency(3).enqueue(),

  // setIsInventorized:undefined,
  // watchSetIsInventorized: function(){
  //   this.set('isInventorized', $('#isInventorized:checked').length > 0);
  //   if(!this.get('isInventorized')){
  //     this.set('showQtyErrors', false);
  //   }
  // }.observes('setIsInventorized'),

  actions: {
    create() {
      let arr = [];
      this.get('selectedVariants').map(variant => arr.push(variant.id));
      if(confirm("Are you sure to create this component?")){
        return this.get('ajax').request(`/zulend-web/products/${this.model.product.id}/components`, {
          type: "POST",
          data: {
            name: this.get('name'),
            description: this.get('description'),
            component_type: this.get('componentType'),
            current_variant_id: this.get('currentVariant').id,
            variant_ids: arr.join(","),
            product_id: this.model.product.id,
          }
        }).then(data => {
          $('#newComponent').modal('hide');
          this.get('notification').clearAll(); this.get('notification').success('Component successfully created!');
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
