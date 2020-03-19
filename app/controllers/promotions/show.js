import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject } from '@ember/service';

export default Controller.extend({
  ajax: inject(),

  queryParams: ['name_cont', 'category_eq'],

  roles: computed(function(){
    return ['administrator', 'customer']
  }),

  selectedProducts: computed('model.products.[]', function(){
    let arr = [];
    if(this.model.products){
      this.model.promotion.products.forEach(prod => {
        arr.push(this.model.products.filter((item, index,self) => item.id == prod.id).firstObject);
      })
    }
    return arr;
  }),

  actions: {
    save() {
      if(confirm("Are you sure to save this promotion?")){
        let arr = [];
        this.get('selectedProducts').map(product => arr.push(product.id));
        return this.get('ajax').request(`/zulend-web/promotions/${this.model.promotion.id}`, {
          type: "PATCH",
          data: {
            title: this.model.promotion.title,
            start_at: moment(this.model.promotion.start_at).format('YYYYMMDD'),
            end_at: moment(this.model.promotion.end_at).format('YYYYMMDD'),
            product_ids: arr.join(','),
          }
        }).then(data => {
          if(data.code == 406){
            this.get('notification').clearAll(); this.get('notification').error(data.message);
          }else{
            this.get('notification').clearAll(); this.get('notification').success('Promotion details successfully saved!');
            this.send('abc');
          }
        }).catch(err => {
          this.get('notification').clearAll(); this.get('notification').error(err.message);
        })
      }
    },

    setValue(param, date, altFormat) {
      this.set(param, altFormat);
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
    },

    execStatusEvent(value) {
      if (confirm(`Are you sure to ${value} this Promotion?`)) {
        return this.get('ajax').request(`/zulend-web/promotions/${this.model.promotion.id}`, {
          type: "PATCH",
          data: {
            status_event: value
          }
        }).then(data => {
          this.get('notification').clearAll(); this.get('notification').success(`This promotion is set to ${this.model.promotion.status}.`);
          this.send('abc');
        }).catch(err => {
          this.get('notification').clearAll(); this.get('notification').error(e);
        })
      }
    },

    uploadImage(file) {
      return file.upload(`/zulend-web/promotions/${this.model.promotion.id}/upload-image`, {
        method: 'POST',
        headers: get(this, 'ajax.headers'),
        data: { image: file.blob }
      }).then((response) => {
        this.get('notification').clearAll(); this.get('notification').success('Image uploaded Successfully');
        this.send('abc');
      }).catch(err => {
        console.log(err);
      });
    },


    deleteImage(imageId){
      if(confirm('Are you sure you want to delete this image?')){
        return this.get('ajax').request(`/zulend-web/promotions/${this.model.promotion.id}/destroy-image`, {
          type: "DELETE",
          data: {
            image_id: imageId,
          }
        }).then((res) => {
          this.get('notification').success(`${docType} Successfully Deleted!`);
          this.send('abc');
        }).catch(err => {
          this.get('notification').error(err.msg);
        });
      }
    }
  }

});
