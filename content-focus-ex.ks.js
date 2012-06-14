// PLUGIN_INFO {{ =========================================================== //

var PLUGIN_INFO =
<KeySnailPlugin>
    <name>content focus ex</name>
    <description>content focus ex</description>
    <description lang="ja">コンテンツへのフォーカスを改良</description>
    <version>0.0.1</version>
    <updateURL></updateURL>
    <iconURL>data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAASdAAAEnQB3mYfeAAAAE1JREFUSEvtlUEKACAIBP3%2Fp7eOQcRAIXSYPeuujIiVZlWzfwxAwiL6ElGdhfPuBbDkmXVhurYYgABFJCIPLf5kPAMRiY
    gJYMXrT8eAAbZnteVaBFyNAAAAAElFTkSuQmCC</iconURL>
    <author mail="take.t.public@gmail.com" homepage="http://nakamzio.com/">T.T</author>
    <license document="http://www.opensource.org/licenses/mit-license.php">The MIT License</license>
    <license lang="ja">MIT ライセンス</license>
    <include>main</include>
    <detail lang="ja"><![CDATA[
=== 説明 ===

ページをロードしたときや、タブを切り替えたときにコンテンツにフォーカスします。

プロンプトが開かれているときはコンテンツにフォーカスしません。

事前にwhite_listにURLをリストで記述しておくと、そのページではこのプラグインは動きません。

=== 設定例 ===

>||
plugins.options["content-focus-ex.white_list"] = [
  'about:home',
  '^http://www.google'
];

plugins.options["content-focus-ex.delay"] = 200;
||<

=== Change Log ===
2011/06/18 (0.0.1) テスト

]]></detail>
</KeySnailPlugin>;

// Option

let pOptions = plugins.setupOptions("content-focus-ex", {
  'white_list': {
    preset: [],
    description: M({
      en: "URL white list",
      ja: "content focus しないURLリスト"
    })
  },
  'delay': {
    preset: 100,
    description: M({
      en: "delay(default:100[ms])",
      ja: "実行するまでのディレイ(デフォルト：100[ms])"
    })
  }
}, PLUGIN_INFO);

// Extend HoK

hook.addToHook('LocationChange', function (aNsURI) {
  //display.prettyPrint(document.getElementById("keysnail-prompt").hidden);
  if (document.getElementById("keysnail-prompt").hidden) { // prompt が出てるときは content focus しない
    var whiteList = pOptions['white_list'];
    var url       = aNsURI.spec;
    for (let i=0; i<whiteList.length; i++) {
      if (url.match(whiteList[i])) {
        return;
      }
    }
    var doc = content.document;
    var delay = Math.round(pOptions['delay']);
    if (doc) {
      if (doc.readyState === "complete") { // すでに読み込まれている
        //display.prettyPrint(M({ja: "すでにBody完成[content focus ex]"}), { timeout:10000, fade:100 });
        //display.prettyPrint(doc.readyState, { timeout:10000, fade:100 });
        contentFocus();
      } else { // 今から読み込む
        //display.prettyPrint(doc.readyState, { timeout:10000, fade:100 });
        doc.addEventListener("DOMContentLoaded", function (e) {
          doc.removeEventListener("DOMContentLoaded", arguments.callee, true);
          var st = content.setTimeout(function () {
            content.clearTimeout(st);
            //display.prettyPrint(M({ja: "読み込み完了後[content focus ex]"}), { timeout:10000, fade:100 });
            contentFocus();
          },
          delay);
        }, true);
      }
    }
  }
  
});

function contentFocus() {
  // 一応直前にPromptが見えているかをチェック
  if (document.getElementById("keysnail-prompt").hidden) {
    //display.prettyPrint(M({ja: "[content focus ex] pronpt hidden"}), { timeout:10000, fade:100 });
    let(elem = document.commandDispatcher.focusedElement) elem && elem.blur();
    gBrowser.focus();
    content.focus();
  } else {
    //display.prettyPrint(M({ja: "[content focus ex] pronpt visible"}), { timeout:10000, fade:100 });
  }
}