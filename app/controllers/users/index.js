import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject } from '@ember/service';

export default Controller.extend({
  ajax: inject(),

  queryParams: ['name_cont', 'role_eq'],

  roles: computed(function(){
    return ['administrator', 'customer']
  }),

  actions: {
    create() {
      if(confirm("Are you sure to create this User?")){
        return this.get('ajax').request('/zulend-web/users/register', {
          type: "POST",
          data: {
            name: this.get('name'),
            email: this.get('email'),
            role: this.get('role'),
            company_name: this.get('companyName'),
            password: this.get('password'),
            phone_no: this.get('phoneNo'),
            address: this.get('address'),
            city: this.get('city'),
            state: this.get('state'),
            postcode: this.get('postcode')
          }
        }).then(data => {
          if(data.code == 422){
            this.get('notification').clearAll(); this.get('notification').error(`Password ${data.data.password[0]}`);
          }else if(data.code != 200){
            this.get('notification').clearAll(); this.get('notification').error(data.message);
          }else if(data.code == 200){
            $('#newUser').modal('hide');
            this.get('notification').clearAll(); this.get('notification').success('User successfully created!');
            this.send('abc');
          }
        }).catch(err => {
          this.get('notification').clearAll(); this.get('notification').error(err.message);
        })
      }
    },

    cancel(){
      this.setProperties({
        name: undefined,
        email: undefined,
        role: undefined,
        company_name: undefined,
        password: undefined,
        phone_no: undefined,
        address: undefined,
        city: undefined,
        state: undefined,
        postcode: undefined
      })
    },

    clear(){
      this.setProperties({
        name_cont: undefined
      });
      this.send('queryChanged');
    }
  }

});
