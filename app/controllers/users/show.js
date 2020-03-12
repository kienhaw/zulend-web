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

  actions: {
    save() {
      if(confirm("Are you sure to save this component?")){
        return this.get('ajax').request(`/zulend-web/users/${this.model.user.id}`, {
          type: "PATCH",
          data: {
            name: this.model.user.name,
            email: this.model.user.email,
            role: this.model.user.role,
            company_name: this.model.user.company_name,
            phone_no: this.model.user.phone_no,
            address: this.model.user.address,
            city: this.model.user.city,
            state: this.model.user.state,
            postcode: this.model.user.postcode,
            director_name: this.model.user.director_name,
            director_ic_no: this.model.user.director_ic_no
          }
        }).then(data => {
          if(data.code == 422){
            this.get('notification').clearAll(); this.get('notification').error(`Phone No ${data.data.phone_no[0]}`);
          }else if(data.code == 406){
            this.get('notification').clearAll(); this.get('notification').error(data.message);
          }else{
            this.get('notification').clearAll(); this.get('notification').success('User details successfully saved!');
            this.send('abc');
          }
        }).catch(err => {
          this.get('notification').clearAll(); this.get('notification').error(err.message);
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
    },

    verifyPhone(){
      return this.get('ajax').request(`/zulend-web/users/${this.model.user.id}`, {
        type: "PATCH",
        data: {
          name: this.model.user.name,
          email: this.model.user.email,
          role: this.model.user.role,
          company_name: this.model.user.company_name,
          phone_no: this.model.user.phone_no,
          address: this.model.user.address,
          city: this.model.user.city,
          state: this.model.user.state,
          postcode: this.model.user.postcode,
          phone_verified_at: moment().format('YYYY-MM-DD'),
        }
      }).then(data => {
        console.log(data);
        if(data.code == 422){
          this.get('notification').clearAll(); this.get('notification').error(`Phone No ${data.data.phone_no[0]}`);
        }else if(data.code == 406){
          this.get('notification').clearAll(); this.get('notification').error(data.message);
        }else{
          this.get('notification').clearAll(); this.get('notification').success('User details successfully saved!');
          this.send('abc');
        }
      }).catch(err => {
        this.get('notification').clearAll(); this.get('notification').error(err.message);
      })
    },

    uploadSSM(file) {
      return file.upload(`/zulend-web/users/${this.model.user.id}/upload-documents`, {
        method: 'POST',
        headers: get(this, 'ajax.headers'),
        data: { ssm_certificate: file.blob }
      }).then((response) => {
        this.get('notification').clearAll(); this.get('notification').success('Images uploaded Successfully');
        this.send('abc');
      }).catch(err => {
        console.log(err);
      });
    },

    uploadSection14(file) {
      return file.upload(`/zulend-web/users/${this.model.user.id}/upload-documents`, {
        method: 'POST',
        headers: get(this, 'ajax.headers'),
        data: { section_14: file.blob }
      }).then((response) => {
        this.get('notification').clearAll(); this.get('notification').success('Images uploaded Successfully');
        this.send('abc');
      }).catch(err => {
        console.log(err);
      });
    },

    uploadDirectorIc(file) {
      return file.upload(`/zulend-web/users/${this.model.user.id}/upload-documents`, {
        method: 'POST',
        headers: get(this, 'ajax.headers'),
        data: { director_ic: file.blob }
      }).then((response) => {
        this.get('notification').clearAll(); this.get('notification').success('Images uploaded Successfully');
        this.send('abc');
      }).catch(err => {
        console.log(err);
      });
    },

    uploadStatements(file) {
      return file.upload(`/zulend-web/users/${this.model.user.id}/upload-documents`, {
        method: 'POST',
        headers: get(this, 'ajax.headers'),
        data: { bank_statements: file.blob }
      }).then((response) => {
        this.get('notification').clearAll(); this.get('notification').success('Images uploaded Successfully');
        this.send('abc');
      }).catch(err => {
        console.log(err);
      });
    },

    deleteDocument(imageId, docType){
      // let data = {};
      // if(docType == "bank_statements"){
      //   data = {
      //     document_id: imageId,
      //     document_type: docType
      //   }
      // }else{
      //   data = {
      //     document_id: imageId,
      //   }
      // }
      if(confirm('Are you sure you want to delete this image?')){
        return this.get('ajax').request(`/zulend-web/users/${this.model.user.id}/destroy-documents`, {
          type: "POST",
          data: {
            document_id: imageId,
            document_type: docType
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
