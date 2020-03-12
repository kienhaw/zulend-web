import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  name: DS.attr(),
  email: DS.attr(),
  role: DS.attr(),
  level: DS.attr(),
  companyName: DS.attr(),
  phoneNo: DS.attr(),
  unit: DS.attr(),
  address: DS.attr(),
  suburb: DS.attr(),
  city: DS.attr(),
  state: DS.attr(),
  postcode: DS.attr(),
  fullAddress: DS.attr(),
  companyRegistrationNo: DS.attr(),
  profileCompleteStatus: DS.attr(),
  address: DS.attr(),
  section14: DS.attr(),
  ssmCertificate: DS.attr(),
  bankStatements: DS.attr(),
  directorIc: DS.attr()
});
