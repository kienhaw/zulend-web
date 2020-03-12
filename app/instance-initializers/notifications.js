export function initialize(applicationInstance) {
  var notificationsService = applicationInstance.lookup('service:notifications');
  notificationsService.setDefaultAutoClear(true);
  notificationsService.setDefaultClearDuration(1500);
}

export default {
  name: 'initializer-notifications',
  initialize
};
