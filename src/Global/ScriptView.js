import { View } from 'Global/View';
import { translation } from 'Language/language';
import { alertDialog } from 'require';

/**
 * 控制所有頁面都看的到的物件的View
 */
export class ScriptView extends View {
  /**
   * 建構 ScriptView
   * @param {MainController} controller controller
   */
  constructor(controller) {
    super('ScriptView');
    this.controller = controller;
  }

  displayDropDownMenu() {
    const displayObject = this.createDropDownMenu({
      name: 'softwareScriptMenu',
      text: (translation(['script', 'name']))
    });

    $(`div[name='softwareScriptMenu']`).remove();
    const afterObject = $(`div[class='note']`)[2];
    displayObject.insertAfter(afterObject);
  }
  /**
   * 在外掛的下拉選單顯示輸入的物件
   * @param {{name: String, text: String, href: String, target: String, customSetting: String}} options 顯示的物件
   * @param {$jquerySelect} beforeObject insertBefore的物件
   * @return {void}
   */
  displayDropDownMenuOption(options, beforeObject) {
    const name = options.name;
    const customSetting = options.customSetting;
    const text = options.text;
    const href = options.href;
    const target = options.target;
    const displayObject = this.createDropDownMenuOption({
      name: name,
      customSetting: customSetting,
      text: text,
      href: href,
      target: target
    });

    displayObject.insertBefore(beforeObject);
  }

  displayScriptMenu() {
    const beforeDiv = $(`div[id='beforeThis'][name='softwareScriptMenu']`)[0];
    this.displayDropDownMenuOption(
      {
        name: 'aboutPage',
        text: translation(['script', 'about']),
        href: '/SoftwareScript/about'
      },
      beforeDiv
    );

    let disconnectReminderSwitch = JSON.parse(window.localStorage.getItem('SoftwareScript.disconnectReminderSwitch'));
    this.displayDropDownMenuOption(
      {
        name: 'disconnectReminderSwitch',
        text: translation(['script', disconnectReminderSwitch ? 'trunOffDisconnectReminder' : 'trunOnDisconnectReminder']),
        href: '#'
      },
      beforeDiv
    );
    $(`a[name='disconnectReminderSwitch']`)[0].addEventListener('click', () => {
      this.controller.switchDisconnectReminder(! disconnectReminderSwitch);
      disconnectReminderSwitch = JSON.parse(window.localStorage.getItem('SoftwareScript.disconnectReminderSwitch'));
      $(`a[name='disconnectReminderSwitch']`)[0].text = translation(['script', disconnectReminderSwitch ? 'trunOffDisconnectReminder' : 'trunOnDisconnectReminder']);
    });

    this.displayDropDownMenuOption(
      {
        name: 'scriptVipPage',
        text: translation(['script', 'vip']),
        href: '/SoftwareScript/scriptVIP'
      },
      beforeDiv
    );

    const hr = $(`<hr name='mostStocksCompany' />`);
    hr.insertBefore(beforeDiv);
    this.displayDropDownMenuOption(
      {
        name: 'showMostStockholdingCompany',
        text: translation(['script', 'showMostStockholdingCompany']),
        href: '#',
        customSetting: `style='font-size: 13px;'`
      },
      beforeDiv
    );
    $(`a[name='showMostStockholdingCompany']`)[0].addEventListener('click', () => {
      this.controller.showMostStockholdingCompany();
    });
  }
  /**
   * 顯示最多持股公司列表
   * @param {Array} list 要顯示的列表
   * @return {void}
   */
  displayMostStockholdingCompany(list) {
    $(`li[class='nav-item'][name='mostStockholdingCompany']`).remove();

    const beforeDiv = $(`div[id='beforeThis'][name='softwareScriptMenu']`)[0];
    for (const company of list) {
      this.displayDropDownMenuOption(
        {
          name: 'mostStockholdingCompany',
          text: company.name,
          href: `/company/detail/${company.companyId}`
        },
        beforeDiv
      );
    }
  }

  displaySwitchDisconnectReminderInfo(disconnectReminderSwitch) {
    alertDialog.alert({
      title: translation(['script', 'name']),
      message: translation(['script', disconnectReminderSwitch ? 'trunOnDisconnectReminderInfo' : 'trunOffDisconnectReminderInfo'])
    });
  }
}
