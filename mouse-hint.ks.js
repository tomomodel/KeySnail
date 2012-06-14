// PLUGIN_INFO {{ =========================================================== //

var PLUGIN_INFO =
<KeySnailPlugin>
    <name>mouse hint</name>
    <description>mouse simulation with Hok</description>
    <description lang="ja">ヒントモードでマウス操作</description>
    <version>0.0.1</version>
    <updateURL></updateURL>
    <iconURL></iconURL>
    <author mail="take.t.public@gmail.com" homepage="http://nakamzio.com/">T.T</author>
    <license document="http://www.opensource.org/licenses/mit-license.php">The MIT License</license>
    <license lang="ja">MIT ライセンス</license>
    <include>main</include>
    <detail lang="ja"><![CDATA[
=== 説明 ===

Hokでマウス操作を可能にします。

=== Change Log ===
2011/06/15 (0.0.1) テスト

]]></detail>
</KeySnailPlugin>;

// Option

let pOptions = plugins.setupOptions("mouse-hint", {
  'hok_mouseover': {
    preset: 'm',
    description: M({
      en: "Key bound to `Mouseover` in the HoK extended hint mode (Default: m)",
      ja: "HoK 拡張ヒントモードにおいて `Mouseover` へ割り当てるキー (デフォルト: m)"
    })
  },
  'hok_mouseclick': {
    preset: 'M',
    description: M({
      en: "Key bound to `Mouseover` in the HoK extended hint mode (Default: m)",
      ja: "HoK 拡張ヒントモードにおいて `Mouseclick` へ割り当てるキー (デフォルト: M)"
    })
  }
}, PLUGIN_INFO);

// Extend HoK

hook.addToHook('PluginLoaded', function () {
  if (!plugins.hok)
    return;

  let actions = [
    [
      pOptions['hok_mouseover'],
      M({ja: 'マウスオーバー', en: 'Mouseover'}),
      function (e) {
        simulateMouseover(e);
      },
      false, false,
      "*"
    ],
    [
      pOptions['hok_mouseclick'],
      M({ja: 'マウスクリック', en: 'Mouseclick'}),
      function (e) {
        simulateMouseclick(e);
      },
      false, false,
      "*"
    ]
  ];

  plugins.hok.addActions(actions);
});

function simulateMouseover(elem) {
  let evt = elem.ownerDocument.createEvent('MouseEvents');
  evt.initMouseEvent(
    'mouseover',
    true, true,
    elem.ownerDocument.defaultView,
    0, 0, 0, 0, 0,
    false, false, false, false, 0, null
  );
  elem.dispatchEvent(evt);
}
function simulateMouseclick(elem) {
  let evt = elem.ownerDocument.createEvent('MouseEvents');
  evt.initMouseEvent(
    'click',
    true, true,
    elem.ownerDocument.defaultView,
    0, 0, 0, 0, 0,
    false, false, false, false, 0, null
  );
  elem.dispatchEvent(evt);
}