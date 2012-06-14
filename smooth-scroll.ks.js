// PLUGIN_INFO {{ =========================================================== //

var PLUGIN_INFO =
<KeySnailPlugin>
    <name>smooth scroll</name>
    <description lang="ja">スムーズなスクロールを提供します</description>
    <version>0.0.1</version>
    <updateURL></updateURL>
    <iconURL></iconURL>
    <author mail="take.t.public@gmail.com" homepage="http://nakamzio.com/">T.T</author>
    <license document="http://www.opensource.org/licenses/mit-license.php">The MIT License</license>
    <license lang="ja">MIT ライセンス</license>
    <include>main</include>
    <detail lang="ja"><![CDATA[
=== 使い方 ===
==== HoK 拡張ヒントモードの強化 ====

このプラグインは KeySnail 用 HaH プラグインの HoK と共に使用してください。

Caret hint プラグインは HoK の拡張モードへ「ヒントを使ってキャレットを移動する為のコマンド」を提供します。

F7 を押して入れるキャレットブラウズモードをよく使用する方に有用でしょう。

例えば HoK の拡張ヒントモードを ; へ割り当てている場合なら ;c と入力することによりヒントが表示され、選択された要素部分へとキャレットが移動します。

==== キャレットの交換 ====

このプラグインが提供する swap-caret を次のようにして適当なキーへと割り当てておくと、 F7 キーを押して入れるキャレットブラウズモードがもっと便利になります。

>|javascript|
key.setViewKey('m', function (ev, arg) {
    ext.exec("swap-caret", arg, ev);
}, 'キャレットを交換', true);
||<

C-SPC を押してマークを設定し C-f C-n などのキーを使って選択範囲を変更する際、このような設定をしておくと s キーを入力することで「選択範囲は変えず、キャレットの位置を交換する」といったことが可能となります。

言葉では説明しにくいので、ぜひ実際に試してみて下さい。

=== Change Log ===
2011/05/31 (0.0.1) テスト

=== 参考にしたもの ===
/lang/javascript/vimperator-plugins/trunk/_smooziee.js – CodeRepos::Share – Trac
http://coderepos.org/share/browser/lang/javascript/vimperator-plugins/trunk/_smooziee.js

Scrollet!
http://github.com/mooz/keysnail/raw/master/plugins/_scrollet.ks.js
]]></detail>
</KeySnailPlugin>;

// ext
plugins.withProvides(function(provide) {
  provide("smooth-scroll-up",
          function (ev, arg) {
            smoothScrollUp()
          },
          M({ja: "スムーズな上スクロール",
             en: "smooth scroll up"}));
  provide("smooth-scroll-down",
        function (ev, arg) {
            smoothScrollDown()
          },
        M({ja: "スムーズな下スクロール",
           en: "smooth scroll down"}));
  provide("smooth-scroll-left",
        smoothScrollLeft,
        M({ja: "スムーズな左スクロール",
           en: "smooth scroll left"}));
  provide("smooth-scroll-right",
        smoothScrollRight,
        M({ja: "スムーズな右スクロール",
           en: "smmooth scroll right"}));
  provide("smooth-scroll",
        smoothScrollNum,
        M({ja: "スムーズな数値スクロール",
           en: "smooth scroll num"}));
}, PLUGIN_INFO);

// Option
let pOptions = plugins.setupOptions("smooth-scroll", {
  'amount': {
    preset: 100,
    description: M({
      en: "amount(default:100)",
      ja: "スクロールする量(デフォルト:100)"
    })
  },
  'interval': {
    preset: 50,
    description: M({
      en: "interval(default:50[ms])",
      ja: "スクロールする間隔(デフォルト：50[ms])"
    })
  },
  'smooth': {
    preset: 4,
    description: M({
      en: "smoothing(default:4)",
      ja: "スムーズ度(デフォルト：4)"
    })
  }
}, PLUGIN_INFO);

// main

var scrollSum  = 0;
var flg_scroll = false;

function smoothScrollUp() {
  scrollSum -= pOptions['amount'];
  smoothScrollPre();
}
function smoothScrollDown() {
  scrollSum += pOptions['amount'];
  smoothScrollPre();
}
function smoothScrollLeft() {
  scrollSum += amount;
  smoothScrollPre();
}
function smoothScrollRight() {
  scrollSum += amount;
  smoothScrollPre();
}
function smoothScrollNum() {
  let amountTemp = parseInt(arguments[1]);
  if (isNaN(amountTemp)) {
    display.prettyPrint(M({'ja': '[smooth scroll] スクロール量の引数が不正です...' + argument[1],
                           'en': '[smooth scroll] error argument...' + argument[1]}));
  } else {
    scrollSum += amountTemp;
    smoothScrollPre();
  }
}
function smoothScrollPre() {
  if (!flg_scroll) {
    let stopRange = Math.ceil(pOptions['smooth']);
    let win = findScrollableWindow();
    flg_scroll = true;
    smoothScroll(win, stopRange);
  }
}

function smoothScroll(win, stopRange) {
  scrollSum -= Math.round(scrollSum / pOptions['smooth']);
  
  
  //display.prettyPrint(scrollSum);
  
  if (scrollSum > 0 && scrollSum <= stopRange) {
    scrollSum = 1;
  } else if (scrollSum < 0 && scrollSum >= -stopRange) {
    scrollSum = -1;
  }
  win.scrollBy(0, scrollSum);
  if (scrollSum > 1 || scrollSum < -1) {
    window.setTimeout(smoothScroll, pOptions['interval'], win, stopRange);
  } else {
    scrollSum = 0;
    flg_scroll = false;
  }
}

// _scrollet.ks.jsを参考 http://github.com/mooz/keysnail/raw/master/plugins/_scrollet.ks.j
function findScrollableWindow()
{
  let win;

  try
  {
      win = window.document.commandDispatcher.focusedWindow;
      if (win && (win.scrollMaxX > 0 || win.scrollMaxY > 0))
          return win;

      win = window.content;
      if (win.scrollMaxX > 0 || win.scrollMaxY > 0)
          return win;

      for (let frame in win.frames)
          if (frame.scrollMaxX > 0 || frame.scrollMaxY > 0)
              return frame;
  }
  catch (x)
  {
      win = window.content;
  }

  return win;
}