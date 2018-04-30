
//監聽頁面，資料準備完成時執行event
//不應該直接呼叫，他應該被繼承
//使用例:
// class CompanyDetailController extends EventController {
//   constructor(user) {
//     super('CompanyDetailController', user);
//     this.templateListener(Template.companyDetailContentNormal, 'Template.companyDetailContentNormal', this.startEvent);
//     this.templateListener(Template.companyDetail, 'Template.companyDetail', this.startEvent2);
//   }
//   startEvent() {
//     console.log('companyDetailContentNormal success');
//     console.log(Meteor.connection._mongo_livedata_collections.employees.find().fetch());
//     console.log('');
//   }
//   startEvent2() {
//     console.log('companyDetail success');
//     console.log(Meteor.connection._mongo_livedata_collections.companies.find().fetch());
//     console.log('');
//   }
// }

/**
 * 頁面的Controller
 */
export class EventController {
  /**
   * 建構 EventController
   * @param {String} controllerName 名字
   * @param {LoginUser} loginUser 登入的使用者
   */
  constructor(controllerName, loginUser) {
    console.log(`create controller: ${controllerName}`);
    this.loginUser = loginUser;
  }

  /**
   * 監聽是否載入完成，完成後呼叫callback
   * @param {Template} template 監聽的Template
   * @param {String} templateName 監聽的Template的名字，用於console
   * @param {function} callback callbock
   * @return {void}
   */
  templateListener(template, templateName, callback) {
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

  /**
   * 資料夾監聽器，監聽到點擊後呼叫callback
   * @param {String} panelFolderName 資料夾的名稱
   * @param {Function} callback callback
   * @return {void}
   */
  panelFolderListener(panelFolderName, callback) {
    Template.panelFolder.events({
      'click [data-toggle-panel-folder]'(event, templateInstance) {
        const { name } = templateInstance.data;
        if (name === panelFolderName) {
          setTimeout(() => {
            callback();
          }, 0);
        }
      }
    });
  }
}