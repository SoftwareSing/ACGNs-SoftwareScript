import { View } from 'Global/View';

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
                <a href="https://github.com/SoftwareSing/ACGNs-SoftwareScript" target="_blank">GitHub</a>
              </p>
              <p>
                <a href="https://greasyfork.org/zh-TW/scripts/33542" target="_blank">GreasyFork</a>
              </p>
              <p></p>
              <h2>目前的功能</h2>
                <p>
                  目前的功能請參考 
                  <a href="https://github.com/SoftwareSing/ACGNs-SoftwareScript#%E7%9B%AE%E5%89%8D%E7%9A%84%E5%8A%9F%E8%83%BD" rel="nofollow" target="_blank">GitHub README</a>
                </p>
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
