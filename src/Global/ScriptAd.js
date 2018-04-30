/**
 * 外掛廣告
 */
export class ScriptAd {
  constructor() {
    console.log('create: ScriptAd');
  }

  /**
   * 回傳廣告顯示的文字
   * @param {Boolean} demo 是否用於demo
   * @return {String} HTML代碼
   */
  createAdMsg(demo) {
    const demoType = demo ? `demo='true'` : `demo='false'`;
    const localScriptAd = JSON.parse(window.localStorage.getItem('localScriptAd')) || {};
    let msg = `<a class='float-left' name='scriptAd' id='0'>&nbsp;&nbsp;</a>`;
    let linkNumber = 0;

    if (localScriptAd.adFormat) {
      for (let i = 0; i < localScriptAd.adFormat.length; i += 1) {
        if (localScriptAd.adFormat[i] === 'a') {
          msg += `<a class='float-left' name='scriptAd' id='${i + 1}' ${demoType}>${localScriptAd.adData[i]}</a>`;
        }
        else if (localScriptAd.adFormat[i] === 'aLink') {
          const linkType = localScriptAd.adLinkType[linkNumber];
          let type = '';
          if ((linkType === '_blank') || (linkType === '_parent') || (linkType === '_top')) {
            type = `target='${linkType}'`;
          }
          const href = `href='${localScriptAd.adLink[linkNumber]}'`;
          msg += `<a class='float-left' name='scriptAd' id='${i + 1}' ${demoType} ${type} ${href}>${localScriptAd.adData[i]}</a>`;

          linkNumber += 1;
        }
      }
    }

    return msg;
  }

  displayScriptAd() {
    const msg = this.createAdMsg(false);
    const afterObject = $(`a[class='text-danger float-left'][href='https://github.com/mrbigmouth/acgn-stock/issues']`)[0];
    $(msg).insertAfter(afterObject);
  }

  removeScriptAd() {
    $(`a[name='scriptAd'][demo='false']`).remove();
  }
}
