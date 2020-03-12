import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  actions: {
    authenticate() {
      this.set('processing', true);
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:oauth2', identification, password).then(() => {
        this.set('processing', false);
      }).catch((reason) => {
        this.set('processing', false);
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});
