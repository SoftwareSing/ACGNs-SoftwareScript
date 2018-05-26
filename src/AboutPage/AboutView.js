import { View } from '../Global/View';

export class AboutView extends View {
  constructor() {
    super('AboutView');

    const tmpVip = new Blaze.Template('Template.softwareScriptAbout', () => {
      /* eslint-disable max-len */
      // eslint-disable-next-line new-cap
      const page = HTML.Raw(`
      <div class='card' name='about'>
      <div class='card-block' name='about'>
    
        <div id="readme" class="readme blob instapaper_body">
          <article class="markdown-body entry-content" itemprop="text">
            <h1>ACGN-stock營利統計外掛 / SoftwareScript</h1>
            <p>A script helps you play
              <a href="https://acgn-stock.com" rel="nofollow">acgn-stock.com</a>.</p>
            <p>一個幫助你在
              <a href="https://acgn-stock.com" rel="nofollow">acgn-stock.com</a> 獲得更豐富訊息的外掛</p>
            <p>
              <del>純粹因為中文太長，所以英文重新取名而不是照翻</del>
            </p>
            <h2>發布頁面</h2>
            <p>
              <a href="https://github.com/SoftwareSing/ACGNs-SoftwareScript" rel="nofollow" target="_blank">GitHub</a>
              <del>( 內含沒什麼用的圖文版功能說明 )</del>
            </p>
            <p>
              <a href="https://greasyfork.org/zh-TW/scripts/33542" rel="nofollow" target="_blank">GreasyFork</a>
            </p>
            <p></p>
            <h2>目前的功能</h2>
    
            <h3>更豐富的卡面訊息</h3>
            <ul>
              <li>持有總值</li>
              <li>營收</li>
              <li>帳面本益比 (未計算VIP加權股份時的本益比)</li>
              <li>排他本益比 (計算VIP加權股份後 真實的本益比)</li>
              <li>我的本益比 (依照使用者的VIP等級加權股份後得出的本益比)</li>
            </ul>
    
            <h3>帳號的更詳細資訊</h3>
            <p>在翻閱過帳號的持有股份、經理資訊、VIP資訊後，可以在頁面上得到詳細的統計資訊</p>
            <p>(登入中的使用者在進入過 股市總覽 後便可得到詳細的持股資訊)</p>
            <ul>
              <li>持有公司總數</li>
              <li>股票總值 (未計算賣單中的股票)</li>
              <li>賣單股票總值 (僅當前登入中的帳號可查看)</li>
              <li>買單現金總值 (僅當前登入中的帳號可查看)</li>
              <li>預估股票分紅 (已計算VIP加權股份)</li>
              <li>預估經理分紅</li>
              <li>預估員工分紅 (員工獎金 目前最高5%)</li>
              <li>預估推薦票獎勵 (包含系統獎金 與 員工1%獎勵)</li>
              <li>預估稅金 (以上方所有財產、預估獲益來預估下季稅金)</li>
            </ul>
    
            <h3>持股資訊總表</h3>
            <p>在翻閱過帳號的相關訊息後，可以在底下查閱該帳號的持股總表</p>
            <p>(欲更新資訊請重新打開該資料夾)</p>
            <ul>
              <li>股價</li>
              <li>營收</li>
              <li>持有股數 (賣單中的股份一併列出，以下同)</li>
              <li>持有比例</li>
              <li>股票總值</li>
              <li>預估分紅 (已計算VIP加權股份)</li>
              <li>VIP等級</li>
            </ul>
    
            <h3>一次查看更大量的紀錄</h3>
            <p>在公司或帳號底下的 所以紀錄 翻閱過後，可以點選 大量紀錄 來一次顯示所有剛剛翻閱到的紀錄</p>
            <p>(頁面重新整理後紀錄不會留存)</p>
    
            <h3>持有比例最多的公司</h3>
            <p>在進入 股市總覽 過後，在外掛選單中點選 [列出最多持股公司] 依照持股比例由高到低列出所持股的公司</p>
            <p>(重新整理列表請再點一次)</p>
    
            <h3>資料搜尋</h3>
            <p>透過指定的條件來搜尋存在外掛中股市資料</p>
            <p>(功能要求有外掛VIP資格才可使用)</p>
    
            <h3>廣告</h3>
            <p>置底有廣告</p>
          </article>
        </div>
      </div>
    </div>    
      `);
      /* eslint-enable max-len */

      return page;
    });
    Template.softwareScriptAbout = tmpVip;
  }
}