import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject } from '@ember/service';

export default Controller.extend({
  ajax: inject(),

  queryParams: ['name_cont', 'category_eq'],

  categories: computed(function() {
    return this.get('ajax').request('/zulend-web/categories', {
      type: "GET",
      data: {}
    }).then(data => {
      return data.data;
    }).catch(err => {
      console.log(err);
    })
  }),

  paginat: computed('model.data.[]', function(){
    let arr = [];
    for(var i = 0; i < this.model.meta.total_pages; i++){
      arr.push(i+1);
    }
    return arr;
  }),

  tempImageArr: [],
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
      if(confirm("Are you sure to create this product?")){
        var data = new FormData();
        data.append("name", this.get('name'));
        data.append("description", this.get('description'));
        data.append("brand", this.get('brand'));
        data.append("rto_price", this.get('rtoPrice'));
        data.append("usage", this.get('usage'));
        data.append("3m_price", this.get('price3m'));
        data.append("6m_price", this.get('price6m'));
        data.append("1y_price", this.get('price1y'));
        data.append("2y_price", this.get('price2y'));
        data.append("keywords", this.get('keywords'));
        data.append("category_id", this.get('category').id);
        let arr = [];
        for(var i = 0; i < this.get('tempImageArr').length; i++){
          data.append(`images[${i}]`, this.get('tempImageArr')[i].blob);
        }

        return this.get('ajax').request('/zulend-web/products', {
          type: "POST",
          enctype: 'multipart/form-data',
          processData: false,  // Important!
          contentType: false,
          cache: false,
          timeout: 600000,
          data: data
        }).then(data => {
          $('#newProduct').modal('hide');
          this.get('notification').clearAll(); this.get('notification').success('Product successfully created!');
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

    uploadImage(image) {
      this.set('tempImageArr', image.queue.files);
    },
  }

});
