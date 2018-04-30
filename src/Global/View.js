/**
 * View
 */
export class View {
  /**
   * 建構 View
   * @param {String} name View的name
   */
  constructor(name) {
    console.log(`create View: ${name}`);
  }

  /**
   * 創建內部用H2元素的資訊列
   * @param {{name: String, leftText: String, rightText: String, customSetting: {left, right}, textOnly: Boolean}} options 設定
   * @return {jquery.$div} HTML元素
   */
  createH2Info(options) {
    const name = options.name || 'defaultName';
    options.customSetting = (options.customSetting) || {};
    const customSetting = {
      left: options.customSetting.left || '',
      right: options.customSetting.right || ''
    };
    const leftText = options.leftText || '';
    const rightText = options.rightText || '';
    const textOnly = options.textOnly || false;

    let r = (`
      <div class='media border-grid-body' name='${name}'>
        <div class='col-6 text-right border-grid' name='${name}' id='h2Left'>
          <h2 name='${name}' id='h2Left' ${customSetting.left}>${leftText}</h2>
        </div>
        <div class='col-6 text-right border-grid' name='${name}' id='h2Right'>
          <h2 name='${name}' id='h2Right' ${customSetting.right}>${rightText}</h2>
        </div>
      </div>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建table元素
   * @param {{name: String, tHead: Array, tBody: Array, customSetting: {table: String, tHead: String, tBody: String}, textOnly: Boolean}} options 設定
   * @return {jquery.$table} table元素
   */
  createTable(options) {
    const name = options.name || 'defaultName';
    options.customSetting = (options.customSetting) || {};
    const customSetting = {
      table: options.customSetting.table || '',
      tHead: options.customSetting.tHead || '',
      tBody: options.customSetting.tBody || ''
    };
    const tHead = options.tHead || [];
    const tBody = options.tBody || [];
    const textOnly = options.textOnly || false;

    let head = '';
    head += `<tr>`;
    for (const h of tHead) {
      head += `<th name=${name} ${customSetting.tHead}>${h}</th>`;
    }
    head += `</tr>`;

    let body = '';
    for (const row of tBody) {
      body += `<tr>`;
      for (const column of row) {
        body += `<td name=${name} ${customSetting.tBody}>${column}</td>`;
      }
      body += `</tr>`;
    }

    let r = (`
      <table border='1' name=${name} ${customSetting.table}>
        <thead name=${name}>
          ${head}
        </thead>
        <tbody name=${name}>
          ${body}
        </tbody>
      </table>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建button元素.
   * size預設為'btn-sm', color預設為'btn-info'
   * @param {{name: String, size: String, color: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$button} button元素
   */
  createButton(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const size = options.size || 'btn-sm';
    const color = options.color || 'btn-info';
    const text = options.text || 'default';
    const textOnly = options.textOnly || false;

    let r = (`
      <button class='btn ${color} ${size}' name='${name}' ${customSetting}>${text}</button>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建select元素.
   * @param {{name: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$select} select元素
   */
  createSelect(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const textOnly = options.textOnly || false;

    let r = (`
      <select class='form-control' name='${name}' ${customSetting}>
      </select>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建option元素.
   * text同時用於 顯示文字 與 指定的value
   * @param {{name: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$option} select元素
   */
  createSelectOption(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const text = options.text || 'defaultText';
    const textOnly = options.textOnly || false;

    let r = (`
      <option name='${name}' value='${text}' ${customSetting}>${text}</option>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建input元素.
   * @param {{name: String, defaultText: String, placeholder: String, type: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$input} input元素
   */
  createInput(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const defaultValue = options.defaultValue || '';
    const placeholder = options.placeholder || '';
    const type = options.type || 'text';
    const textOnly = options.textOnly || false;

    let r = (`
      <input class='form-control'
        name='${name}'
        type='${type}'
        placeholder='${placeholder}'
        value='${defaultValue}'
        ${customSetting}
      />
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建a元素.
   * 如不需要超連結 僅純顯示文字 請不要設定href,
   * 如不需要新開頁面 則不用設定target
   * @param {{name: String, href: String, target: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$a} a元素
   */
  createA(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const href = options.href ? `href='${options.href}'` : '';
    const target = options.target ? `target='${options.target}'` : '';
    const text = options.text || '';
    const textOnly = options.textOnly || false;

    let r = (`
      <a class='float-left'
        name='${name}'
        ${href}
        ${target}
        ${customSetting}
      >${text}</a>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建DropDownMenu
   * @param {{name: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$div} DropDownMenu
   */
  createDropDownMenu(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const text = options.text || '';
    const textOnly = options.textOnly || false;

    let r = (`
      <div class='note' name='${name}'>
        <li class='nav-item dropdown text-nowrap' name='${name}'>
          <a class='nav-link dropdown-toggle' href='#' data-toggle='dropdown' name='${name}' ${customSetting}>${text}</a>
          <div class='dropdown-menu px-3 nav-dropdown-menu'
            aria-labelledby='navbarDropdownMenuLink'
            name='${name}'>
            <div name='${name}' id='afterThis'>
            <div name='${name}' id='beforeThis'>
            </div>
          </div>
        </li>
      </div>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建DropDownMenu的option
   * @param {{name: String, text: String, href: String, target: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$li} DropDownMenu的option
   */
  createDropDownMenuOption(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const text = options.text || '';
    const href = options.href ? `href='${options.href}'` : '';
    const target = options.target ? `target='${options.target}'` : '';
    const textOnly = options.textOnly || false;

    let r = (`
      <li class='nav-item' name='${name}'>
        <a class='nav-link text-truncate'
          name='${name}'
          ${href}
          ${target}
          ${customSetting}
        >${text}</a>
      </li>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }
}
