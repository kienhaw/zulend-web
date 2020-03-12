import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject } from '@ember/service';

export default Controller.extend({
  ajax: inject(),

  queryParams: ['name_cont', 'category_eq'],

  componentTypes: computed(function(){
    return ['specification', 'add-on', 'fixway services'];
  }),

  selectedVariants: computed('model.variants.[]', function(){
    let arr = [];
    if(this.model.variants){
       arr = this.model.variants.filter((item, index,self) => item.component_id == this.model.component.id);
    }
    return arr;
  }),

  currentVariant: computed('model.variants.[]', function(){
    let cv = null;
    if(this.model.variants){
       cv = this.model.variants.filter((item, index,self) => item.id == this.model.component.current_variant_id);
    }
    return cv[0];
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
    save() {
      let arr = [];
      this.get('selectedVariants').map(variant => arr.push(variant.id));
      if(confirm("Are you sure to save this component?")){
        return this.get('ajax').request(`/zulend-web/components/${this.model.component.id}`, {
          type: "PATCH",
          data: {
            name: this.model.component.name,
            description: this.model.component.description,
            component_type: this.model.component.component_type,
            current_variant_id: this.get('currentVariant').id,
            variant_ids: arr.join(","),
          }
        }).then(data => {
          this.get('notification').clearAll(); this.get('notification').success('Component successfully saved!');
          this.send('abc');
        }).catch(err => {
          this.get('notification').clearAll(); this.get('notification').error(err.message);
        })
      }
    },

    execStatusEvent(value) {
      if (confirm(`Are you sure to ${value} this Component?`)) {
        return this.get('ajax').request(`/zulend-web/components/${this.model.component.id}`, {
          type: "PATCH",
          data: {
            status_event: value
          }
        }).then(data => {
          this.get('notification').clearAll(); this.get('notification').success(`This Component is set to ${data.status}.`);
          this.send('abc');
        }).catch(err => {
          this.get('notification').clearAll(); this.get('notification').error(e.message);
        })
      }
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
