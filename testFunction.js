//這只是寫來放一些我比較常用的測試function
//方便我自己要用的時候複製

function templateListener(template, templateName, callback) {
  template.onCreated(function() {
    const rIsDataReady = new ReactiveVar(false);
    this.autorun(() => {
      rIsDataReady.set(this.subscriptionsReady());
    });
    this.autorun(() => {
      if (rIsDataReady.get()) {
        console.log(`${templateName} loaded`);
        callback();
      }
      else {
        console.log(`${templateName} is loading`);
      }
    });
  });
}


function companyDetailTest() {
  console.log(Meteor.connection._mongo_livedata_collections.companies.find().fetch());
  console.log(Meteor.connection._mongo_livedata_collections.employees.find().fetch());
  console.log('');
}
templateListener(Template.companyDetail, 'Template.companyDetail', companyDetailTest);


function accountInfoTest() {
  console.log(Meteor.connection._mongo_livedata_collections.companies.find().fetch());
  console.log(Meteor.connection._mongo_livedata_collections.employees.find().fetch());
  console.log(Meteor.connection._mongo_livedata_collections.directors.find().fetch());
}


function companyListTest() {
  // setTimeout(() => {
  //   console.log(Meteor.connection._mongo_livedata_collections.companies.find().fetch());
  //   console.log(Meteor.connection._mongo_livedata_collections.directors.find().fetch());
  //   console.log(Meteor.connection._mongo_livedata_collections.orders.find().fetch());
  // }, 0);
  console.log(Meteor.connection._mongo_livedata_collections.companies.find().fetch());
  console.log(Meteor.connection._mongo_livedata_collections.directors.find().fetch());
  console.log(Meteor.connection._mongo_livedata_collections.orders.find().fetch());
}

templateListener(Template.companyList, 'companyList', companyListTest);
