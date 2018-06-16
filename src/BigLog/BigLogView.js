import { View } from '../Global/View';
import { translation } from '../Language/language';
import { formatDateTimeText } from '../require';

/**
 * 大量紀錄 的View
 * 用於顯示 大量紀錄 資料夾, 以及顯示大量紀錄
 */
export class BigLogView extends View {
  /**
   * 建構 BigLogView
   * @param {String} name 資料夾的名稱
   */
  constructor(name) {
    super(`create BigLogView`);
    this.getDescriptionHtml = Template.displayLog.__helpers[' getDescriptionHtml'];
    this.name = String(name);
  }

  showBigLogFolder() {
    const intoObject = $(`div[class='row border-grid-body mt-2']`);
    if (intoObject.length > 0) {
      const tmpInto = $(`div[class='col-12 border-grid'][name=${this.name}]`);
      if (tmpInto.length < 1) {
        this.displayBigLogFolder();
      }
    }
    else {
      setTimeout(() => {
        this.showBigLogFolder();
      }, 10);
    }
  }
  displayBigLogFolder() {
    const intoObject = $(`div[class='row border-grid-body mt-2']`).first();
    const appendDiv = (`<div class='col-12 border-grid' name=${this.name}></div>`);
    intoObject.append(appendDiv);
    const tmpInto = $(`div[class='col-12 border-grid'][name=${this.name}]`)[0];
    Blaze.renderWithData(
      Template.panelFolder,
      {name: this.name, title: `${translation(['script', 'bigLog'])}`},
      tmpInto
    );
  }

  /**
   * 顯示大量紀錄
   * @param {Array} localLog 要顯示的紀錄列表
   * @return {void}
   */
  displayBigLog(localLog) {
    const intoObject = ($(`a[data-toggle-panel-folder=${this.name}]`)
      .closest(`div[class='col-12']`)
      .next(`div[class='col-12']`)
      .first());
    for (const log of localLog) {
      const displayObject = (`
        <div class='logData' style='word-break: break-all;'>
          <span class='text-info'>(${formatDateTimeText(log.createdAt)})</span>
          ${this.getDescriptionHtml(log)}
        </div>
      `);
      intoObject.append(displayObject);
    }
    this.displayLogDetailInfo(intoObject);
  }
  displayLogDetailInfo(intoObject) {
    // 由於試了幾次實在沒辦法直接從伺服器抓出來
    // 本段直接複製自股市Github
    // /client/utils/displayLog.js
    intoObject.find('[data-user-link]').each((_, elem) => {
      const $link = $(elem);
      const userId = $link.attr('data-user-link');

      // TODO write a helper
      if (userId === '!system') {
        $link.text('系統');
      }
      else if (userId === '!FSC') {
        $link.text('金管會');
      }
      else {
        $.ajax({
          url: '/userInfo',
          data: { id: userId },
          dataType: 'json',
          success: ({ name: userName, status }) => {
            if (status === 'registered') {
              const path = FlowRouter.path('accountInfo', { userId });
              $link.html(`<a href='${path}'>${userName}</a>`);
            }
            else {
              $link.text(userName);
            }
          }
        });
      }
    });

    intoObject.find('[data-company-link]').each((_, elem) => {
      const $link = $(elem);
      const companyId = $link.attr('data-company-link');
      $.ajax({
        url: '/companyInfo',
        data: { id: companyId },
        dataType: 'json',
        success: ({ name: companyName, status }) => {
          let path;
          // TODO write a helper
          switch (status) {
            case 'foundation': {
              path = FlowRouter.path('foundationDetail', { foundationId: companyId });
              break;
            }
            case 'market': {
              path = FlowRouter.path('companyDetail', { companyId });
              break;
            }
          }
          $link.html(`<a href='${path}'>${companyName}</a>`);
        }
      });
    });

    intoObject.find('[data-product-link]').each((_, elem) => {
      const $link = $(elem);
      const productId = $link.attr('data-product-link');
      $.ajax({
        url: '/productInfo',
        data: { id: productId },
        dataType: 'json',
        success: ({ url, productName }) => {
          $link.html(`<a href='${url}' target='_blank'>${productName}</a>`);
        }
      });
    });
  }
}
