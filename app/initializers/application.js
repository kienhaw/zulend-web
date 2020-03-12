export function initialize(application) {
  // application.inject('route', 'foo', 'service:foo');
  application.inject('controller', 'application', 'service:application');
  application.inject('route', 'application', 'service:application');
  application.inject('controller', 'notification', 'service:notifications');
  application.inject('route', 'notification', 'service:notifications');
  // application.inject('ability', 'application', 'service:application');
}

export default {
  initialize
};
