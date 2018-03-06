/* eslint-disable */
//這只是寫來放一些我比較常用的測試function
//方便我自己要用的時候複製


FlowRouter.route('/testPage', {
  name: 'testPage',
  action() {
    DocHead.setTitle(Meteor.settings.public.websiteName + ' - testPage');
  }
});
var tmpTest = new Blaze.Template('Template.testPage', () => {
  // eslint-disable-next-line new-cap
  const page = Spacebars.makeRaw(`
    <div class='card' name='test'>
      <div class='card-block' name='test'>
        <div class='col-5'>
          <h1 class='card-title mb-1'>SoftwareScript</h1>
          <h1 class='card-title mb-1'>testPage</h1>
        </div>
        <div class='col-12'>
          <hr>
          <h2 name='test'>測試囉</h2>
          <div class="col-12 border-grid">
            ${Blaze.toHTMLWithData(Template.panelFolder, {name: 'test', title: 'test2', contentBlock: 'softwareScriptVip'})}
          </div>
          <hr>
        </div>
      </div>
    </div>
  `);

  return page;
});
Template.testPage = tmpTest;

a += 1;
var x = Blaze.renderWithData(Template.panelFolder, {name: `test${a}`, title: `test${a}`, contentBlock: $(`<h1>test</h1>`)}, g, h);




const softwareScriptRoute = FlowRouter.group({
  prefix: '/SoftwareScript',
  name: 'softwareScriptRoute'
});
softwareScriptRoute.route('/', {
  name: 'softwareScript',
  action() {
    DocHead.setTitle(Meteor.settings.public.websiteName + ' - SoftwareScript外掛');
  }
});
softwareScriptRoute.route('/scriptVIP', {
  name: 'softwareScriptVip',
  action() {
    DocHead.setTitle(Meteor.settings.public.websiteName + ' - SoftwareScript外掛 - VIP');
  }
});

function scriptPageTest() {
  console.log('scriptRoute Success');
}
templateListener(Template.softwareScript, 'Template.softwareScript', scriptPageTest);

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


function accountInfoTest() {
  console.log(Meteor.connection._mongo_livedata_collections.companies.find().fetch());
  console.log(Meteor.connection._mongo_livedata_collections.employees.find().fetch());
  console.log(Meteor.connection._mongo_livedata_collections.directors.find().fetch());
}
templateListener(Template.accountInfo, 'Template.accountInfo', accountInfoTest);


function companyDetailTest() {
  console.log(Meteor.connection._mongo_livedata_collections.companies.find().fetch());
  console.log(Meteor.connection._mongo_livedata_collections.employees.find().fetch());
  console.log('');
}
templateListener(Template.companyDetail, 'Template.companyDetail', companyDetailTest);


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
