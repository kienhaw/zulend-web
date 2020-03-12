import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject } from '@ember/service';

export default Controller.extend({
  ajax: inject(),

  queryParams: ['name_cont', 'category_eq'],
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
      if(confirm("Are you sure to create this category?")){
        return this.get('ajax').request('/zulend-web/categories', {
          type: "POST",
          data: {
            name: this.get('name')
          }
        }).then(data => {
          $('#newCategory').modal('hide');
          this.get('notification').clearAll(); this.get('notification').success('Category successfully created!');
          this.send('abc');
        }).catch(err => {
          this.get('notification').clearAll(); this.get('notification').error(err.message);
        })
      }
    },

    edit(){
      if (confirm('Are you sure to amend this Category?')) {
        var m = this.get('selectedCategory');
        return this.get('ajax').request(`/zulend-web/categories/${m.id}`, {
          type: "PATCH",
          data: {
            name: m.name
          }
        }).then(data => {
          $('#modal-category-edit').modal('hide');
          this.get('notification').clearAll(); this.get('notification').success(`Category successfully amended`);
          this.send('abc');
        }).catch(err => {
          $('#modal-category-edit').modal('hide');
          this.get('notification').clearAll(); this.get('notification').error(e);
        })
      }
    },

    setCategory(category){
      this.set("selectedCategory", category);
    },

    execStatusEvent(value) {
      if (confirm(`Are you sure to ${value} this Category?`)) {
        return this.get('ajax').request(`/zulend-web/categories/${this.get('selectedCategory').id}`, {
          type: "PATCH",
          data: {
            name: this.get('selectedCategory').name,
            status_event: value
          }
        }).then(data => {
          $('#modal-category-edit').modal('hide');
          this.get('notification').clearAll(); this.get('notification').success(`This category is set to ${this.get('selectedCategory').status}.`);
          this.send('abc');
        }).catch(err => {
          $('#modal-category-edit').modal('hide');
          this.get('notification').clearAll(); this.get('notification').error(e);
        })
      }
    },

    uploadFiles(file) {
      get(this, 'uploadFiles').perform(file);
    },
  }

});
