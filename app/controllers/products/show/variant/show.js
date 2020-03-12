import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject } from '@ember/service';

export default Controller.extend({
  ajax: inject(),

  queryParams: ['name_cont', 'category_eq'],

  //
  // uploadVariants: task(function * (file) {
  //   try {
  //     let response = upload(`/zulend-web/variants/${this.model.variant.id}/upload-images`, {
  //       method: 'POST',
  //       headers: get(this, 'ajax.headers'),
  //       data: {
  //         images: file
  //       }
  //     });
  //     // this.set('resources', response.body);
  //     // this.set('showErrors', false);
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
      if(confirm("Are you sure to save this Variant?")){
        return this.get('ajax').request(`/zulend-web/variants/${this.model.variant.id}`, {
          type: "PATCH",
          data: {
            name: this.model.variant.name,
            description: this.model.variant.description,
            rto_price: this.model.variant.rto_price,
            '3m_price': this.get('model.variant.3m_price'),
            '6m_price': this.get('model.variant.6m_price'),
            '1y_price': this.get('model.variant.1y_price'),
            '2y_price': this.get('model.variant.2y_price'),
            sku: this.model.variant.sku
          }
        }).then(data => {
          this.get('notification').clearAll(); this.get('notification').success('Variant successfully saved!');
          this.send('abc');
        }).catch(err => {
          this.get('notification').clearAll(); this.get('notification').error(err.message);
        })
      }
    },

    execStatusEvent(value) {
      if (confirm(`Are you sure to ${value} this Variant?`)) {
        return this.get('ajax').request(`/zulend-web/variants/${this.model.variant.id}`, {
          type: "PATCH",
          data: {
            status_event: value
          }
        }).then(data => {
          this.get('notification').clearAll(); this.get('notification').success(`This Variant is set to ${data.status}.`);
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

    // uploadVariants(file) {
    //   get(this, 'uploadVariants').perform(file);
    // },
    //
    uploadVariants(file) {
      return file.upload(`/zulend-web/variants/${this.model.variant.id}/upload-images`, {
        method: 'POST',
        headers: get(this, 'ajax.headers'),
        data: { images: file.blob }
      }).then((response) => {
        this.get('notification').clearAll(); this.get('notification').success('Images uploaded Successfully');
        this.send('abc');
      }).catch(err => {
        console.log(err);
      });
    },

    deleteVariant(imageId){
      if(confirm('Are you sure you want to delete this image?')){
        return this.get('ajax').request(`/zulend-web/variants/${this.model.variant.id}/destroy-images`, {
          type: "POST",
          data: {
            image_id: imageId
          }
        }).then(() => {
          this.get('notification').success('Successfully Deleted!');
          this.send('abc');
        }).catch(err => {
          this.get('notification').error(err.msg);
        });
      }
    }
  }

});
