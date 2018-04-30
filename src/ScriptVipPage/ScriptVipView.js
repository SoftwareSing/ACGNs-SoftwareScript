import { View } from '../Global/View';
import { ScriptAd } from '../Global/ScriptAd';
import { alertDialog } from '../require';

/**
 * ScriptVip頁面的View
 */
export class ScriptVipView extends View {
  /**
   * 建構 ScriptVipView
   * @param {EventController} controller 控制View的Controller
   */
  constructor(controller) {
    super('ScriptVipView');

    this.controller = controller;
    this.scriptAd = new ScriptAd();

    const tmpVip = new Blaze.Template('Template.softwareScriptVip', () => {
      // eslint-disable-next-line new-cap
      const page = HTML.Raw(`
        <div class='card' name='vip'>
          <div class='card-block' name='Vip'>
            <div class='col-5'>
              <h1 class='card-title mb-1'>SoftwareScript</h1>
              <h1 class='card-title mb-1'>  VIP功能</h1>
            </div>
            <div class='col-5'>您是我的恩客嗎?</div>
            <div class='col-12'>
              <hr>
              <h2 name='becomeVip'>成為VIP</h2>
              <hr>
              <h2 name='scriptAd'>外掛廣告</h2>
              <hr>
              <h2 name='searchTables'>資料搜尋</h2>
              <hr>
              <p>如VIP功能發生問題，請至Discord股市群聯絡SoftwareSing</p>
            </div>
          </div>
        </div>
      `);

      return page;
    });
    Template.softwareScriptVip = tmpVip;
  }

  /**
   * 顯示外掛VIP資訊
   * @param {LoginUser} loginUser 登入中的使用者
   * @return {void}
   */
  displayScriptVipProducts(loginUser) {
    console.log(`start displayScriptVipProducts()`);

    const localScriptVipProductsUpdateTime = JSON.parse(window.localStorage.getItem('localScriptVipProductsUpdateTime')) || 'null';
    const userVIP = loginUser.vipLevel();
    const info = $(`
      <p>VIP條件更新時間: ${localScriptVipProductsUpdateTime}</p>
      <p>您目前的VIP狀態: 等級 ${userVIP}</p>
      <p>VIP權限: </P>
      <ul name='vipCanDo'>
        <li>關閉外掛廣告</li>
        <li>使用資料搜尋功能</li>
      </ul>
      <p>
        VIP點數達390即可使用VIP功能 <br />
        為獲得點數可以購買以下商品
      </p>
      <div name='scriptVipProducts' id='productList'>
      </div>
    `);
    info.insertAfter($(`h2[name='becomeVip']`)[0]);

    const productList = [];
    const localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
    let userProducts = localScriptVipProducts.find((x) => {
      return (x.userId === loginUser.userId);
    });
    if (userProducts === undefined) {
      userProducts = localScriptVipProducts.find((x) => {
        return (x.userId === 'default');
      });
    }
    for (const p of userProducts.products) {
      const description = `<a companyId='${p.companyId}' href='/company/detail/${p.companyId}'>${p.description}</a>`;
      const out = [description, p.point, p.amount];
      productList.push(out);
    }

    const tableObject = this.createTable({
      name: 'scriptVipProducts',
      tHead: ['產品', '點數/個', '持有量'],
      tBody: productList
    });
    tableObject.insertAfter($(`div[name='scriptVipProducts'][id='productList']`)[0]);

    console.log(`end displayScriptVipProducts()`);
  }

  /**
   * 顯示外掛AD資訊
   * @param {LoginUser} loginUser 登入中的使用者
   * @return {void}
   */
  displayScriptAdInfo(loginUser) {
    console.log(`start displayScriptAdInfo()`);

    const localScriptAdUpdateTime = JSON.parse(window.localStorage.getItem('localScriptAdUpdateTime')) || 'null';
    const msg = this.scriptAd.createAdMsg(true);
    const info = $(`
      <p>
        目前的廣告更新時間: ${localScriptAdUpdateTime} <br />
        目前的廣告內容: <br />
        ${msg}
      </p>
      <p>
        <button class='btn btn-info btn-sm' name='openAd'>開啟外掛廣告</button>
        <button class='btn btn-danger btn-sm' name='closeAd'>關閉外掛廣告</button>
      </p>
    `);
    info.insertAfter($(`h2[name='scriptAd']`)[0]);

    if (loginUser.vipLevel() < 1) {
      $(`button[name='closeAd']`)[0].disabled = true;
    }
    else {
      $(`button[name='closeAd']`)[0].addEventListener('click', () => {
        window.localStorage.setItem('localDisplayScriptAd', JSON.stringify(false));
        this.scriptAd.removeScriptAd();
      });
    }

    $(`button[name='openAd']`)[0].addEventListener('click', () => {
      window.localStorage.setItem('localDisplayScriptAd', JSON.stringify(true));
      if ($(`a[name='scriptAd'][demo='false']`).length < 1) {
        this.scriptAd.displayScriptAd();
      }
    });

    console.log(`end displayScriptAdInfo()`);
  }

  /**
   * 顯示SearchTables資訊
   * @param {LoginUser} loginUser 登入中的使用者
   * @return {void}
   */
  displaySearchTables(loginUser) {
    console.log(`start displaySearchTables()`);

    const localCompaniesUpdateTime = JSON.parse(window.localStorage.getItem('localCompaniesUpdateTime')) || 'null';
    const info = $(`
      <p>
        VIP可以用此功能搜尋公司資料<br />
        公司資料為 從雲端同步 或 於瀏覽股市時自動更新，因此可能與最新資料有所落差<br />
        目前的雲端資料更新時間: ${localCompaniesUpdateTime}<br />
        &nbsp;(每次重新載入股市時，會確認雲端是否有更新資料)
      </p>
      <p>&nbsp;</p>
      <p>各項數值名稱對照表(不在表中的數值無法使用)：
        <table border='1' name='valueNameTable'>
          <tr name='companyID'> <td>公司ID</td> <td>ID</td> </tr>
          <tr name='name'> <td>公司名稱</td> <td>name</td> </tr>
          <tr name='chairman'> <td>董事長ID</td> <td>chairman</td> </tr>
          <tr name='manager'> <td>經理人ID</td> <td>manager</td> </tr>

          <tr name='grade'> <td>公司評級</td> <td>grade</td> </tr>
          <tr name='capital'> <td>資本額</td> <td>capital</td> </tr>
          <tr name='price'> <td>股價</td> <td>price</td> </tr>
          <tr name='release'> <td>總釋股量</td> <td>release</td> </tr>
          <tr name='profit'> <td>總營收</td> <td>profit</td> </tr>

          <tr name='vipBonusStocks'> <td>VIP加成股數</td> <td>vipBonusStocks</td> </tr>
          <tr name='managerBonusRatePercent'> <td>經理分紅比例</td> <td>managerBonusRatePercent</td> </tr>
          <tr name='capitalIncreaseRatePercent'> <td>資本額注入比例</td> <td>capitalIncreaseRatePercent</td> </tr>

          <tr name='salary'> <td>本季員工薪水</td> <td>salary</td> </tr>
          <tr name='nextSeasonSalary'> <td>下季員工薪水</td> <td>nextSeasonSalary</td> </tr>
          <tr name='employeeBonusRatePercent'> <td>員工分紅%數</td> <td>employeeBonusRatePercent</td> </tr>
          <tr name='employeesNumber'> <td>本季員工人數</td> <td>employeesNumber</td> </tr>
          <tr name='nextSeasonEmployeesNumber'> <td>下季員工人數</td> <td>nextSeasonEmployeesNumber</td> </tr>

          <tr name='tags'> <td>標籤 tag (陣列)</td> <td>tags</td> </tr>
          <tr name='createdAt'> <td>創立時間</td> <td>createdAt</td> </tr>
        </table>
      </p>
      <p>常用函式：
        <table border='1' name='valueNameTable'>
          <tr name='等於'>
            <td bgcolor='yellow'>等於 (請用2或3個等號)</td>
            <td bgcolor='yellow'>==</td>
          </tr>
          <tr name='OR'>
            <td>x OR(或) y</td>
            <td>(x || y)</td>
          </tr>
          <tr name='AND'>
            <td>x AND y</td>
            <td>(x && y)</td>
          </tr>
          <tr name='toFixed()'>
            <td>把x四捨五入至小數點y位</td>
            <td>x.toFixed(y)</td>
          </tr>
          <tr name='Math.ceil(price * 1.15)'>
            <td>計算漲停價格</td>
            <td>Math.ceil(price * 1.15)</td>
          </tr>
          <tr name='Math.ceil(price * 0.85)'>
            <td>計算跌停價格</td>
            <td>Math.ceil(price * 0.85)</td>
          </tr>
          <tr name='本益比'>
            <td>本益比</td>
            <td>(price * release) / profit</td>
          </tr>
          <tr name='益本比'>
            <td>益本比</td>
            <td>profit / (price * release)</td>
          </tr>
          <tr name='包含'>
            <td>名字中包含 艦これ 的公司</td>
            <td>(name.indexOf('艦これ') > -1)</td>
          </tr>
        </table>
      </p>
      <p>&nbsp;</p>
      <p> <a href='https://hackmd.io/s/SycGT5yIG' target='_blank'>資料搜尋用法教學</a> </p>
      <p>
        <select class='form-control' style='width: 300px;' name='dataSearchList'></select>
        <button class='btn btn-info btn-sm' name='createTable'>建立新的搜尋表</button>
        <button class='btn btn-danger btn-sm' name='deleteTable'>刪除這個搜尋表</button>
        <button class='btn btn-danger btn-sm' name='deleteAllTable'>刪除所有</button>
      </p>
      <p name='showTableName'> 表格名稱： <span class='text-info' name='tableName'></span></p>
      <p name='showTableFilter'>
        過濾公式：<input class='form-control'
          type='text' name='tableFilter'
          placeholder='請輸入過濾公式，如: (price>1000)'>
        <button class='btn btn-info btn-sm' name='addTableFilter'>儲存過濾公式</button>
        <button class='btn btn-danger btn-sm' name='deleteTableFilter'>刪除過濾公式</button>
      </p>
      <p name='showTableSort'>
        排序依據：<input class='form-control'
          type='text' name='tableSort'
          placeholder='請輸入排序公式，如: (price)，小到大請加負號: -(price)'>
        <button class='btn btn-info btn-sm' name='addTableSort'>儲存排序公式</button>
        <button class='btn btn-danger btn-sm' name='deleteTableSort'>刪除排序公式</button>
      </p>
      <p>&nbsp;</p>
      <p name'showTableColumn'>表格欄位<br />
        <button class='btn btn-info btn-sm' name='addTableColumn'>新增欄位</button>
        <table border='1' name'tableColumn'>
          <thead>
            <th>名稱</th>
            <th>公式</th>
            <th>操作</th>
          </thead>
          <tbody name='tableColumn'>
          </tbody>
        </table>
      </p>
      <p>&nbsp;</p>
      <p>
        <button class='btn btn-info' name='outputTable'>輸出結果</button>
        <button class='btn btn-warning' name='clearOutputTable'>清空輸出</button>
      </p>
      <p name='outputTable'></p>
      <p>&nbsp;</p>
    `);
    info.insertAfter($(`h2[name='searchTables']`)[0]);


    $(`button[name='deleteAllTable']`)[0].addEventListener('click', () => {
      alertDialog.confirm({
        title: '刪除所有搜尋表',
        message: `您確定要刪除所有的表格嗎? <br />
                (建議發生嚴重錯誤至無法操作時 再這麼做)`,
        callback: (result) => {
          if (result) {
            this.controller.deleteLocalSearchTables();
          }
        }
      });
    });

    $(`button[name='createTable']`)[0].addEventListener('click', () => {
      alertDialog.dialog({
        type: 'prompt',
        title: '新建搜尋表',
        message: `請輸入表格名稱(如有重複將直接覆蓋)`,
        inputType: 'text',
        customSetting: ``,
        callback: (result) => {
          if (result) {
            this.controller.createNewSearchTable(result);
          }
        }
      });
    });
    $(`button[name='deleteTable']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      alertDialog.confirm({
        title: '刪除搜尋表',
        message: `您確定要刪除表格 ${tableName} 嗎?`,
        callback: (result) => {
          if (result) {
            this.controller.deleteSearchTable(tableName);
          }
        }
      });
    });


    this.displaySearchTablesList();
    if ($(`select[name='dataSearchList']`)[0].value !== '') {
      this.displaySearchTableInfo();
    }


    $(`button[name='addTableFilter']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      const filter = $(`input[name='tableFilter']`)[0].value;
      this.controller.addSearchTableFilter(tableName, filter);
    });
    $(`button[name='deleteTableFilter']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      this.controller.deleteSearchTableFilter(tableName);
      $(`input[name='tableFilter']`)[0].value = '';
    });

    $(`button[name='addTableSort']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      const sort = $(`input[name='tableSort']`)[0].value;
      this.controller.addSearchTableSort(tableName, sort);
    });
    $(`button[name='deleteTableSort']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      this.controller.deleteSearchTableSort(tableName);
      $(`input[name='tableSort']`)[0].value = '';
    });

    $(`button[name='addTableColumn']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      alertDialog.dialog({
        type: 'prompt',
        title: '新增欄位',
        message: `請輸入新的欄位名稱`,
        inputType: 'text',
        customSetting: `placeholder='請輸入欄位名稱，如: 本益比'`,
        callback: (newName) => {
          if (newName) {
            alertDialog.dialog({
              type: 'prompt',
              title: '新增欄位',
              message: `請輸入新的公式`,
              inputType: 'text',
              customSetting: `placeholder='請輸入欄位公式，如: (profit / (price * stock))'`,
              callback: (newRule) => {
                if (newRule) {
                  this.controller.addSearchTableColumn(tableName, newName, newRule);
                  this.displaySearchTableColumns(tableName);
                }
              }
            });
          }
        }
      });
    });


    $(`button[name='outputTable']`)[0].addEventListener('click', () => {
      if (loginUser.vipLevel() > 0) {
        const tableName = $(`span[name='tableName']`)[0].innerText;
        if (tableName !== '') {
          const filter = $(`input[name='tableFilter']`)[0].value;
          this.controller.addSearchTableFilter(tableName, filter);
          const sort = $(`input[name='tableSort']`)[0].value;
          this.controller.addSearchTableSort(tableName, sort);

          this.displayOutputTable(tableName);
        }
      }
      else {
        alertDialog.alert('你不是VIP！(怒)');
      }
    });
    $(`button[name='clearOutputTable']`)[0].addEventListener('click', () => {
      $(`table[name=outputTable]`).remove();
    });

    console.log(`end displaySearchTables()`);
  }

  displaySearchTablesList() {
    console.log('---start displaySearchTablesList()');

    $(`option[name='dataSearchList']`).remove();
    const localSearchTables = JSON.parse(window.localStorage.getItem('localSearchTables')) || 'null';
    for (const t of localSearchTables) {
      const item = $(`<option name='dataSearchList' value='${t.tableName}'>${t.tableName}</option>`);
      $(`select[name='dataSearchList']`).append(item);
    }
    $(`select[name='dataSearchList']`)[0].addEventListener('change', () => {
      $(`table[name=outputTable]`).remove();
      this.displaySearchTableInfo();
    });

    console.log('---end displaySearchTablesList()');
  }


  displaySearchTableInfo() {
    console.log('---start displaySearchTableInfo()');

    const selectValue = $(`select[name='dataSearchList']`)[0].value;
    if (selectValue) {
      const localSearchTables = JSON.parse(window.localStorage.getItem('localSearchTables')) || 'null';
      const thisTable = localSearchTables.find((t) => {
        return t.tableName === selectValue;
      });
      $(`span[name='tableName']`)[0].innerText = thisTable.tableName;
      $(`input[name='tableFilter']`)[0].value = thisTable.filter;
      $(`input[name='tableSort']`)[0].value = thisTable.sort;

      this.displaySearchTableColumns(thisTable.tableName);
    }
    else {
      $(`span[name='tableName']`)[0].innerText = '';
      $(`input[name='tableFilter']`)[0].value = '';
      $(`input[name='tableSort']`)[0].value = '';
      $(`tr[name='tableColumn']`).remove();
    }

    console.log('---end displaySearchTableInfo()');
  }

  displaySearchTableColumns(tableName) {
    console.log('---start displaySearchTableColumns()');

    $(`tr[name='tableColumn']`).remove();
    const localSearchTables = JSON.parse(window.localStorage.getItem('localSearchTables')) || 'null';
    const thisTable = localSearchTables.find((t) => {
      return t.tableName === tableName;
    });

    const changeColumn = (c) => {
      alertDialog.dialog({
        type: 'prompt',
        title: '修改欄位',
        message: `請輸入新的欄位名稱`,
        inputType: 'text',
        defaultValue: c.columnName,
        customSetting: ``,
        callback: (newName) => {
          if (newName) {
            alertDialog.dialog({
              type: 'prompt',
              title: '修改欄位',
              message: `請輸入新的公式`,
              inputType: 'text',
              defaultValue: String(c.rule),
              customSetting: ``,
              callback: (newRule) => {
                if (newRule) {
                  this.controller.changeSearchTableColumn(tableName, {name: c.columnName, newName: newName}, newRule);
                  this.displaySearchTableColumns(tableName);
                }
              }
            });
          }
        }
      });
    };
    const deleteColumn = (c) => {
      alertDialog.confirm({
        title: `刪除 ${tableName} 的欄位`,
        message: `您確定要刪除欄位 ${c.columnName} 嗎?`,
        callback: (result) => {
          if (result) {
            this.controller.deleteSearchTableColumn(tableName, c.columnName);
            this.displaySearchTableColumns(tableName);
          }
        }
      });
    };

    for (const c of thisTable.column) {
      const t = (`
        <tr name='tableColumn'>
          <td>${c.columnName}</td>
          <td>${String(c.rule)}</td>
          <td>
            <button class='btn btn-warning btn-sm' name='changeTableColumn' id='${c.columnName}'>修改</button>
            <button class='btn btn-danger btn-sm' name='deleteTableColumn' id='${c.columnName}'>刪除</button>
          </td>
        </tr>
      `);
      $(`tbody[name='tableColumn']`).append(t);
      $(`button[name='changeTableColumn'][id='${c.columnName}']`)[0].addEventListener('click', () => {
        changeColumn(c);
      });
      $(`button[name='deleteTableColumn'][id='${c.columnName}']`)[0].addEventListener('click', () => {
        deleteColumn(c);
      });
    }

    console.log('---end displaySearchTableColumns()');
  }


  displayOutputTable(tableName) {
    $(`table[name=outputTable]`).remove();

    // 需要重整，顯示不應該由SearchTables做
    this.controller.searchTables.outputTable(tableName);
  }
}
