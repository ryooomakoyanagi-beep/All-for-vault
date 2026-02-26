// =============================================
// 棒高跳び技術知識ベース
// 出典: 最終ボウタカ.docx & ボウタカAI用語集.xlsx
// =============================================

// --- 局面データ（最終ボウタカ.docx準拠）---
const PHASE_DATA = [
  {
    phase_id: 1,
    phase_name: "助走（中間マーク）",
    term_ja: "中間マーク（Mid Mark）",
    term_en: "Mid Mark",
    definition_ja:
      "中間マーク通過でコーチが見るべきは「ポール保持（角度）×姿勢」。Boutaka記事でも、助走評価の要素として姿勢・ストライド・ピッチ・踏切角度などが語られる。",
    cue_check:
      "中間マーク通過時にポールが低すぎる（角度が倒れすぎる）とピッチ／ストライドが変わり、踏切がズレる。",
    common_error:
      "中間マークを固定したままグリップだけ上げ下げすると、助走後半のリズムが崩れ、踏切の質が落ちやすい。",
    fix_hint:
      "チャートを見て「グリップ変更分に応じて中間マークを更新」する。",
    drill:
      "練習と試合の中間マークの傾向を比べる。練習と試合で中間マーク位置の傾向が大きく違う＝試合で別の走り／別のポール保持になっている可能性。中間マークを使うことで\"ズレの原因箇所\"を特定しやすくなる。",
    additional_notes:
      "\"補正値\"が急に変わる＝助走後半の走りが変わっているサイン。例：あるグリップでは+15cm補正なのに、別グリップでは+40cm補正になる、など。どこかで姿勢・ポール保持・加速が変化している可能性が高い。",
    terminology_rules:
      '中間マーク＝Mid Mark（ミッドマーク）＝チェックマーク（この局面では同義として扱う）→正式表記は「中間マーク（Mid Mark）」に統一。中間マーク表＝Mid Mark Chart。助走後半＝「中間マーク（踏切6歩前）以降」。',
    source_title: "Boutaka 中間マーク／助走評価 記事群",
    source_url: "https://boutakachannel.amebaownd.com/pages/1528038/page_201712292339",
  },
  {
    phase_id: 2,
    phase_name: "助走後半〜突っ込み直前（ポールドロップ）",
    term_ja: "ポールドロップ（Pole Drop）",
    term_en: "Pole Drop",
    definition_ja:
      'ポールドロップは"助走の質"を上げるための技術。ポールを立てて保持し、助走の中で落としていくことで、姿勢が崩れにくくなり、結果として走り（加速）が良くなる。',
    cue_check:
      "「踏切6歩前」から落とし始めるのが基本目安。踏切6歩前まで可能な限り垂直保持し、そこから重力に任せて自然に落とすと、踏切2歩前でポールが平行になりやすい。",
    common_error:
      "ポールを操作して止めたり、途中で動きが詰まると助走リズムが崩れる。ポールの重さに引っ張られて走りが崩れ、ステップが乱れる。",
    fix_hint:
      '重要なのは"落とし方"より「止まらずに流れること」。「先端に引っ張られる」ではなく「先端を追い越す」感覚。',
    drill:
      "ドロップのチェックポイント（目安）：6歩で落とす、一気に落とす、先端が目線の高さ（踏切3歩前）で突っ込み開始。狭いグリップでのドロップ練習。段階ドリル：片手ドロップ（one arm）で\"重力に任せる感覚\"を作り、そこから両手で突っ込みへ接続。",
    additional_notes:
      "ポール保持は「下の手に重さを乗せない」。Active Pole Dropの考え方では、ポールの重さは主に上の手で感じ、下の手で\"支えない\"状態を目指す。最終的な狙いは、突っ込み〜踏切を\"ほぼ同時\"に強くすること。",
    terminology_rules:
      'ポールドロップ＝Pole Drop。Active Pole Drop→「アクティブ・ポールドロップ（Active Pole Drop）」で統一。突っ込み動作で統一。ポール平行で統一。踏切n歩前表記で統一。',
    source_title: "Boutaka Active Pole Drop 技術解説 記事群",
    source_url: "https://boutakachannel.amebaownd.com/pages/1528038/page_201712292339",
  },
  {
    phase_id: 3,
    phase_name: "助走前半〜中盤（ポール保持・姿勢）",
    term_ja: "ポールキャリー（Pole Carry）／姿勢保持",
    term_en: "Pole Carry / Running Posture",
    definition_ja:
      '助走前半〜中盤では「加速を妨げないポール保持」と「走りの姿勢」が最重要。ポールを持つことで上半身が硬くなったり、肩が上がるとストライドとピッチが崩れ、後半のポールドロップや突っ込みに悪影響が出る。',
    cue_check: "・肩がすくんでいないか\n・肘が不自然に張っていないか\n・視線が下がっていないか\n・腕振りが左右で不均等になっていないか",
    common_error: 'ポールを「持とう」と意識しすぎて上半身が固まり、加速が止まる。ポールの重さを下の手で支えすぎると、肩と体幹が固まり走りが小さくなる。',
    fix_hint: 'ポールは"持つ"のではなく"添える"。走りの主役はあくまで脚と体幹で、ポールは走りに乗せて運ぶ感覚。',
    drill: "・ポール無し助走 → 同じリズムでポールあり助走\n・短助走でのポール保持確認（上半身リラックス重視）\n・動画で肩の高さと腕振りの左右差をチェック",
    additional_notes: "助走前半で姿勢が崩れると、中間マーク以降の補正値が大きくなる傾向がある。結果として踏切位置が安定せず、ポールドロップや突っ込みのタイミングもズレる。",
    terminology_rules: "ポールキャリー＝Pole Carry→「助走中のポール保持動作」と定義し統一。姿勢保持→「上半身リラックス＋体幹安定」の意味で使用。助走前半＝スタート〜中間マークまで。",
    source_title: "Boutaka 助走姿勢・ポールキャリー 解説記事群",
    source_url: "https://boutakachannel.amebaownd.com/pages/1528038/page_201712292339",
  },
  {
    phase_id: 4,
    phase_name: "突っ込み〜踏切（ハローポジション）",
    term_ja: "ハローポジション（Hello Position）",
    term_en: "Hello Position",
    definition_ja: "ハローポジションとは、突っ込み動作で両手を高く上げ、全身が一直線に近い形で踏切を迎える姿勢。この姿勢により、踏切直後の全身進展（エラスティック）につながりやすくなる。",
    cue_check: "・踏切瞬間に両肘が伸びているか\n・肩がすぼんでいないか\n・体が前傾しすぎていないか\n・踏切足が真下から強く反発しているか",
    common_error: "突っ込みで肘が曲がり、肩が前に入ってしまうと全身進展が作れない。上体が潰れると踏切後すぐにスイングに入ってしまい、エラスティックが消える。",
    fix_hint: '「両手で頭の横を通るように上へ伸びる」意識。踏切は"飛び上がる"よりも"地面を強く押す"イメージ。',
    drill: "・低グリップでのハンドシフト練習\n・踏切だけを切り出した短助走ドリル\n・突っ込み〜踏切の静止姿勢確認ドリル",
    additional_notes: "ハローポジションが作れないと、その後のエラスティック→リアライン→スイングすべての連動が弱くなり、ポールスピードが失われやすい。踏切で上半身が崩れる選手ほど「踏切後すぐ振る」傾向が強くなる。",
    terminology_rules: "ハローポジション＝Hello Position→踏切直前の両手高位置・全身伸展姿勢を指す用語として統一。突っ込み動作→ポールドロップ後〜踏切直前までの腕の引き上げ動作。",
    source_title: "Boutaka ハローポジション／踏切姿勢 技術解説記事群",
    source_url: "https://boutakachannel.amebaownd.com/pages/1528038/page_201712292339",
  },
  {
    phase_id: 5,
    phase_name: "踏切直後の全身進展（エラスティック）",
    term_ja: "エラスティック（Elastic）",
    term_en: "Elastic Action",
    definition_ja: "エラスティックとは、踏切直後に全身が一瞬大きく伸びる進展動作。身体を反らせることで、ポールにエネルギーを伝え、その後のリアラインとスイングにつなげる役割を持つ。",
    cue_check: '・踏切直後に胸が開いているか\n・腰・膝・足首が連動して伸びているか\n・すぐに足を振り出していないか\n・空中で一瞬「止まる」感覚があるか',
    common_error: "踏切直後すぐにスイングしてしまい、進展の時間が作れない。体が固まり、反る動きが作れず、ポールに十分な圧をかけられない。",
    fix_hint: '踏切後すぐ振らない。「一瞬伸びてから振る」。ジャンプではなく"反発を作る動き"として意識する。',
    drill: "・低グリップでの踏切→進展確認ドリル\n・ポール無しジャンプでの反り確認\n・ハンドシフトでの進展タイミング練習",
    additional_notes: "エラスティックが弱いと、その後のリアラインが発生しにくく、ポールが立ち始めるタイミングが遅れ、全体のリズムが崩れる。エラスティックが長すぎてもリアラインが間に合わず、結果として「押し返し」ができない状態になる。",
    terminology_rules: "エラスティック＝Elastic→踏切直後の全身進展フェーズを指す用語として統一。進展→腰・胸・肩が同時に伸びる状態。",
    source_title: "Boutaka エラスティック動作 技術解説記事",
    source_url: "https://boutakachannel.amebaownd.com/pages/1528038/page_201712292339",
  },
  {
    phase_id: 6,
    phase_name: "跳躍に勢いを生む押し返し（リアライン）",
    term_ja: "リアライン（Realign）",
    term_en: "Realignment Action",
    definition_ja: "リアラインとは、エラスティック後に上半身と腕でポールを上方向へ押し返し、手の位置が一度下がってから再び上へ戻る動作。ポールスピードを維持し、跳躍を最後まで失速させないための重要動作。",
    cue_check: "・手の押し返し方向が上を向いているか\n・手が体の近くを通っていないか\n・押し返し後も上方向に押し続けているか\n・スイングと同時に起きているか",
    common_error: "押し返しが横方向になり、体が前に流れる。手を近くで動かしてしまい、十分な力がポールに伝わらない。押し返しが早すぎ、エラスティックが成立していない。",
    fix_hint: '頭の横を通して"遠くへ上へ"押すイメージ。押し返しは止めず、ポールが立つまで継続する。',
    drill: "・塩ビ管での押し返し軌道練習\n・メディシンボール投げ上げドリル\n・ハンドシフトでの両手押し返し確認\n・Popドリルでリアライン＋スイング連動確認",
    additional_notes: "リアラインが機能すると、ポールが曲がった状態でスイングが加速し、倒立前にポールが立ち始める理想的なタイミングが作られる。リアラインが弱いと、倒立完成時にはすでにポールが立ち、体を押し上げる力が残らない。",
    terminology_rules: "リアライン＝Realign→エラスティック後の上方向押し返し動作。押し返し→腕・肩・体幹を使った上方向への力発揮。",
    source_title: "Boutaka リアライン動作 技術解説記事",
    source_url: "https://boutakachannel.amebaownd.com/pages/1528038/page_201712292339",
  },
  {
    phase_id: 7,
    phase_name: "大きくて速いスイング動作",
    term_ja: "スイング（Swing）",
    term_en: "Swing Action",
    definition_ja: "スイングとは、踏切後に下半身を大きく・速く振り上げ、体を倒立方向へ導く主要な加速動作。リアラインと同時に起こることで、ポールの反発を最大化し、倒立までのスピードを作る役割を持つ。",
    cue_check: "・スイング軌道が大きいか\n・スイングスピードが十分に速いか\n・上半身の押し返しと同時に起きているか\n・足だけでなく全身が連動しているか",
    common_error: "スイングが小さく、途中で止まってしまう。足だけを振り、上半身が動いていない。エラスティック前にスイングを始めてしまう。",
    fix_hint: "「大きく、速く」を同時に満たすことを最優先。足だけでなく、上半身のリアラインとセットで行う意識を持つ。",
    drill: "・鉄棒スイング（順手で全身連動を意識）\n・ロープスイング（両手で圧をかけ続ける）\n・ハンドシフトでのスイング連動確認\n・Popドリルでスイングタイミング確認",
    additional_notes: "抱え込みスイングは、筋力不足や倒立が困難な段階では一時的に有効だが、最終的には大きな軌道のスイングが必要となる。意図的に体を巻き込むスイングを練習する必要はなく、大きな動きの中で自然に起きる範囲に留めるべき。",
    terminology_rules: "スイング＝Swing→下半身振り上げと体の倒立移行を含む一連動作。抱え込みスイング→腰から体を縮めて早期倒立を狙う補助的手法。",
    source_title: "Boutaka スイング動作 技術解説記事",
    source_url: "https://boutakachannel.amebaownd.com/pages/1528038/page_201712292339",
  },
  {
    phase_id: 8,
    phase_name: "真上の軌道を作る進展動作（エクステンション）",
    term_ja: "エクステンション（Extension）",
    term_en: "Extension Phase",
    definition_ja: "エクステンションとは、倒立後に体をさらに押し上げ、バーを真上方向にクリアするための最終進展動作。ポールスピードを維持したまま体を押し上げることで、横流れせずに垂直方向の跳躍を作る。",
    cue_check: "・足首が締まり、体が一直線になっているか\n・顎を引かず、視線が足先方向に向いているか\n・ポールを最後まで押し続けているか\n・体を自分で持ち上げに行っているか",
    common_error: "ポールが弾いてくれるのを待ってしまう。顎を引き、体が折れてしまう。進行方向のスピードが残っておらず、横に流れる。",
    fix_hint: '「待たずに押し続ける」。ポールに飛ばされるのではなく、自分で上がり続ける意識を持つ。',
    drill: "・Popドリルで進展感覚習得\n・ハイバータッチ練習（グリップ＋1.2〜1.5m）\n・十分立つポールでの垂直進展確認",
    additional_notes: "エクステンション成功の鍵はポールスピード。そのため、リアライン・スイング・エラスティックが成立していないと、正しい進展は起こらない。ポールが十分立つ条件で練習することが必須。",
    terminology_rules: "エクステンション＝Extension→倒立後の最終押し上げ局面。ポールスピード→突っ込みから立ち上がりまでの回転・反発速度。",
    source_title: "Boutaka エクステンション動作 技術解説記事",
    source_url: "https://boutakachannel.amebaownd.com/pages/1528038/page_201712292339",
  },
  {
    phase_id: 9,
    phase_name: "クリア動作（バーの越え方）",
    term_ja: "クリア動作",
    term_en: "Bar Clearance",
    definition_ja: "クリア動作とは、エクステンション後に体の各部位を順序よくバーの上へ運び、最小限の高さでバーを越えるための身体操作。進行方向へのスピードを残したまま、体の重心をできるだけ低く保ちつつ、体を回旋・屈曲させてバーをかわす技術局面である。",
    cue_check: "・腰が最初にバーを越えているか\n・上体が遅れてついてきていないか\n・脚が最後に自然に抜けているか\n・体が横流れしていないか",
    common_error: "体全体を一気に持ち上げようとして重心が高くなる。腰が上がらず、脚からバーに引っかかる。進行方向のスピードがなく、真下に落ちる形になる。",
    fix_hint: '「腰→肩→脚」の順で通過する意識を持つ。バーを飛び越えるのではなく、体を滑らせるイメージで越える。',
    drill: "・低バーでのクリア動作反復\n・マット上での空中姿勢確認ドリル\n・ハイバータッチ後の脚抜き練習",
    additional_notes: "クリア動作は単独で改善できる局面ではなく、エクステンション時のポールスピードと体の位置が大きく影響する。進展が弱い場合、クリア局面だけで修正しようとしても改善しにくい。",
    terminology_rules: "クリア動作＝Bar Clearance→バー上での体の抜き方・通過姿勢全体を指す。",
    source_title: "Boutaka クリア動作 技術解説記事",
    source_url: "https://boutakachannel.amebaownd.com/pages/1528038/page_201712292339",
  },
];

// --- 用語集（ボウタカAI用語集.xlsx準拠）---
const GLOSSARY = [
  { phase: "助走", phase_order: 1, term_ja: "姿勢", term_en: "Posture", definition: "肩と臀部が垂直に揃った走行姿勢", checkpoint: "上体が立っている", common_error: "腰が落ちる", related_phase: "助走" },
  { phase: "助走", phase_order: 1, term_ja: "加速局面", term_en: "Acceleration", definition: "地面を強く押して速度を上げる区間", checkpoint: "前傾で地面を押せている", common_error: "力んでストライドが縮む", related_phase: "助走" },
  { phase: "助走", phase_order: 1, term_ja: "最大速度局面", term_en: "Max Speed", definition: "速度を維持しながらリズムを作る区間", checkpoint: "ピッチが安定", common_error: "減速してしまう", related_phase: "助走" },
  { phase: "助走", phase_order: 1, term_ja: "中間マーク", term_en: "Mid Mark", definition: "踏切6歩前の最終チェック位置", checkpoint: "毎回同位置通過", common_error: "踏切だけ合わせる", related_phase: "突っ込み" },
  { phase: "助走", phase_order: 1, term_ja: "ポールドロップ", term_en: "Pole Drop", definition: "助走中にポールを自然落下させる動作", checkpoint: "止まらず流れる", common_error: "途中で止める", related_phase: "突っ込み" },
  { phase: "突っ込み", phase_order: 2, term_ja: "メイクスペース", term_en: "Make Space", definition: "顔とポールの間に空間を作る動作", checkpoint: "顔が潰れない", common_error: "腕が早く曲がる", related_phase: "エラスティック" },
  { phase: "突っ込み", phase_order: 2, term_ja: "ハロー", term_en: "Hollow", definition: "肩で耳を押す完全伸展姿勢", checkpoint: "両腕がV字", common_error: "肩が上がらない", related_phase: "エラスティック" },
  { phase: "突っ込み", phase_order: 2, term_ja: "完全伸展", term_en: "Full Extension", definition: "踏切時に全身一直線になる姿勢", checkpoint: "肘膝腰が伸びる", common_error: "体が折れる", related_phase: "エラスティック" },
  { phase: "突っ込み", phase_order: 2, term_ja: "ブロック", term_en: "Blocking", definition: "肩腕を固めて止める突っ込み", checkpoint: "動きが止まる", common_error: "反りが出ない", related_phase: "エラスティック" },
  { phase: "エラスティック", phase_order: 3, term_ja: "進展", term_en: "Elastic", definition: "踏切直後の一瞬の全身伸展", checkpoint: "胸が開く", common_error: "固まる", related_phase: "リアライン" },
  { phase: "エラスティック", phase_order: 3, term_ja: "肘の高さ", term_en: "Elbow Height", definition: "下腕肘が目線より高い位置", checkpoint: "肘が上", common_error: "肘が落ちる", related_phase: "リアライン" },
  { phase: "エラスティック", phase_order: 3, term_ja: "目線", term_en: "Gaze", definition: "自然にやや上を見る視線", checkpoint: "腰が前へ進む", common_error: "下を見る", related_phase: "リアライン" },
  { phase: "リアライン", phase_order: 4, term_ja: "押し返し", term_en: "Push Back", definition: "上方向へ押し続ける動作", checkpoint: "手が上へ", common_error: "横へ逃げる", related_phase: "スイング" },
  { phase: "リアライン", phase_order: 4, term_ja: "遠い軌道", term_en: "Long Path", definition: "体から離れた位置で押す軌道", checkpoint: "頭上を通る", common_error: "体の近くで押す", related_phase: "スイング" },
  { phase: "リアライン", phase_order: 4, term_ja: "連動", term_en: "Linkage", definition: "スイングと同時に行う押し返し", checkpoint: "上下同時", common_error: "上だけ動く", related_phase: "スイング" },
  { phase: "スイング", phase_order: 5, term_ja: "大きくて速い", term_en: "Big and Fast", definition: "大軌道かつ高速の脚振り", checkpoint: "振り幅大＋速い", common_error: "小さい/遅い", related_phase: "進展" },
  { phase: "スイング", phase_order: 5, term_ja: "Lポジション", term_en: "L Position", definition: "上半身水平で脚が伸びる局面", checkpoint: "膝下が見える", common_error: "早巻き込み", related_phase: "進展" },
  { phase: "スイング", phase_order: 5, term_ja: "抱え込み", term_en: "Tuck", definition: "体を畳むスイング形", checkpoint: "結果的なら可", common_error: "意図的巻き込み", related_phase: "進展" },
  { phase: "進展", phase_order: 6, term_ja: "ポールスピード", term_en: "Pole Speed", definition: "ポールが立ち上がる勢い", checkpoint: "速度維持", common_error: "途中失速", related_phase: "クリア" },
  { phase: "進展", phase_order: 6, term_ja: "押し続ける", term_en: "Keep Pushing", definition: "クリア直前まで押し続ける動作", checkpoint: "腕が伸び続ける", common_error: "早く止める", related_phase: "クリア" },
  { phase: "進展", phase_order: 6, term_ja: "足首ロック", term_en: "Ankle Lock", definition: "足首を締めて分裂を防ぐ", checkpoint: "脚が揃う", common_error: "足先が抜ける", related_phase: "クリア" },
  { phase: "進展", phase_order: 6, term_ja: "待たない", term_en: "No Waiting", definition: "自分が動き続ける意識", checkpoint: "連続動作", common_error: "ポール待ち", related_phase: "クリア" },
];

// --- フェーズグループ定義 (UI用 — 説明文は用語集 definition を15文字要約) ---
const PHASE_GROUPS = [
  {
    id: "runup",
    title: "助走グループ",
    titleEn: "Run-up",
    image: "/images/phase_group_runup.png",
    phases: [
      { label: "助走（中間マーク）", labelEn: "Run-up (Mid Mark)", shortDesc: "リズムと姿勢", shortDescEn: "Rhythm & posture", phaseIds: [1] },
      { label: "ポールドロップ", labelEn: "Pole Drop", shortDesc: "ポールを自然に下ろす", shortDescEn: "Natural pole lowering", phaseIds: [2] },
      { label: "ポールキャリー", labelEn: "Pole Carry", shortDesc: "正しいポールの保持", shortDescEn: "Proper pole holding", phaseIds: [3] },
    ],
  },
  {
    id: "takeoff",
    title: "踏切・進展グループ",
    titleEn: "Takeoff & Extension",
    image: "/images/phase_group_takeoff.png",
    phases: [
      { label: "ハローポジション", labelEn: "Hello Position", shortDesc: "理想的な踏切姿勢", shortDescEn: "Ideal takeoff posture", phaseIds: [4] },
      { label: "エラスティック", labelEn: "Elastic Action", shortDesc: "正しい突っ込み", shortDescEn: "Full-body extension", phaseIds: [5] },
    ],
  },
  {
    id: "swing",
    title: "スインググループ",
    titleEn: "Vertical Transition",
    image: "/images/phase_group_swing.png",
    phases: [
      { label: "リアライン", labelEn: "Realignment", shortDesc: "上方向への押し返し", shortDescEn: "Upward push-back", phaseIds: [6] },
      { label: "スイング", labelEn: "Swing", shortDesc: "大きくて速い脚の振り", shortDescEn: "Big & fast leg swing", phaseIds: [7] },
    ],
  },
  {
    id: "finish",
    title: "最終グループ",
    titleEn: "Clearance",
    image: "/images/phase_group_finish.png",
    phases: [
      { label: "エクステンション", labelEn: "Extension", shortDesc: "真上の進展", shortDescEn: "Vertical extension", phaseIds: [8] },
      { label: "クリア動作", labelEn: "Bar Clearance", shortDesc: "バーを越える身体操作", shortDescEn: "Body control over bar", phaseIds: [9] },
    ],
  },
];

// =============================================
// 局面習熟度調整表（局面習熟度調整表.xlsx 準拠）
// =============================================
const CONSTRUAL_MAP = {
  1: [
    { level: "初心者", strategy: "Broad Profiling（全体化）", guidance: "技術的な歩幅（ストライド）を意識させず、全体の「リズム」や「流れ」を強調する。" },
    { level: "中・上級者", strategy: "Specificity（具体化）", guidance: "「ポール保持の角度」と「姿勢」の連動に焦点を当て、誤差をミリ単位でプロファイルする。" },
  ],
  2: [
    { level: "初心者", strategy: "Subjective Perspective（受動性）", guidance: "ポールを「落とす（能動）」のではなく、重力に任せて「落ちていく」感覚を持たせる。" },
    { level: "中・上級者", strategy: "Narrowed Profiling（限定化）", guidance: "「踏切6歩前」から「2歩前」にかけてのポールの角度変化（平行）を厳密に管理する。" },
  ],
  3: [
    { level: "初心者", strategy: "Framing（枠付けの変更）", guidance: "ポールを「持つ」というフレームから、走りに「添える」というフレームへ書き換える。" },
    { level: "中・上級者", strategy: "Internal Focus（内部焦点）", guidance: "肩のすくみや腕振りの左右差を、自分の体幹感覚と同期させる。" },
  ],
  4: [
    { level: "初心者", strategy: "Linguistic Distancing（心理的距離）", guidance: "「ボックスに突っ込む（衝突）」という恐怖を避け、「空にハイタッチする」という上昇イメージへ変換する。" },
    { level: "中・上級者", strategy: "Narrowed Profiling（限定化）", guidance: "踏切の瞬間に「両肘が伸びているか」という、一点の関節の状態に注意を固定する。" },
  ],
  5: [
    { level: "初心者", strategy: "Chunking（情報の塊化）", guidance: "身体の各部位を個別に意識させず、「一本の大きなゴム」として全身の弾性を一括処理させる。" },
    { level: "中・上級者", strategy: "Timing / Focusing（前景化）", guidance: "「一瞬伸びてから振る」という、動作の間の「静止（Foregrounding）」を意識させる。" },
  ],
  6: [
    { level: "中級者", strategy: "Path Profiling（軌道の強調）", guidance: "手の位置が下がってから「上へ」戻る軌道をプロファイルし、横流れを防ぐ。" },
    { level: "上級者", strategy: "Subjective Perspective（内部視点）", guidance: "ポールが立ち始めるタイミングに合わせ、背中や腕で「圧」を感じながら押し続ける。" },
  ],
  7: [
    { level: "初心者", strategy: "Distraction Strategy（注意の転逸）", guidance: "「逆さまになる恐怖」から注意を逸らすため、「足先で空を蹴る」という能動的アクションを強調する。" },
    { level: "中・上級者", strategy: "Profiling（連動性の焦点）", guidance: "リアライン（押し返し）とスイング（振り上げ）を別物ではなく「同時」に起きる一つの事態として把握させる。" },
  ],
  8: [
    { level: "初心者", strategy: "Schematic（スキーマ）", guidance: "細かい理屈抜きに、ポールに「飛ばされる」感覚から「自分で上がる」感覚へ視点を移行させる。" },
    { level: "上級者", strategy: "Specificity（高解像度）", guidance: "足首を締め、視線を足先へ向けるといった、自動化された動作の「最終確認」に焦点を当てる。" },
  ],
  9: [
    { level: "初心者", strategy: "Metaphor（比喩）", guidance: "バーを「飛び越える」のではなく、体を「滑らせる」という非接触・滑走のイメージを付与する。" },
    { level: "中・上級者", strategy: "Sequential Profiling（順序化）", guidance: "「腰→肩→脚」という通過順序をスローモーションのように認識し、重心移動をプロファイルする。" },
  ],
};

// =============================================
// 動画URL（URL.xlsx 準拠）
// =============================================
const VIDEO_URLS = {
  1: "https://youtu.be/rwZZ5r7FuS4?si=5lr551ubZY3hptNF",
  2: "https://youtu.be/wQYvPyeHd94?si=0kUK-3x2CxtdB5Wg",
  3: "https://youtu.be/zFX5_O9YfFk?si=VOfUip5vRW9n6HOS",
  4: "https://youtu.be/3WPLTglj2E8?si=TnM3xhJhfxKLlvjO",
  5: "https://youtu.be/SxvF_XHtRO8?si=BMU8Thvv6oVVsDAi",
  6: "https://youtu.be/6YxHGvMLX40?si=u8mYJeswRyc2HZ44",
  7: "https://youtu.be/OOrnrY0HnaM?si=0Em2KCOpfoPIyjya",
  8: "https://youtu.be/3F5Syaw6sJU?si=pJYwkvZF30YRXvdB",
  9: "https://youtu.be/3F5Syaw6sJU?si=pJYwkvZF30YRXvdB",
};

/** 局面IDから動画URLと記事URLを取得 */
function getPhaseUrls(phaseId) {
  const phase = PHASE_DATA.find((p) => p.phase_id === phaseId);
  return {
    videoUrl: VIDEO_URLS[phaseId] || "",
    articleUrl: phase?.source_url || "",
  };
}

/** 局面IDと習熟度レベルから、習熟度調整表のエントリを取得 */
function getConstrualGuidance(phaseId, level) {
  const entries = CONSTRUAL_MAP[phaseId];
  if (!entries) return undefined;
  if (level === "beginner") return entries.find((e) => e.level === "初心者") || entries[0];
  if (level === "advanced") return entries.find((e) => e.level === "上級者") || entries.find((e) => e.level.includes("上級")) || entries[1];
  return entries.find((e) => e.level.includes("中")) || entries[1];
}

// --- 習熟度レベル定義 ---
const SKILL_LEVELS = [
  {
    level: "beginner",
    label: "初心者",
    labelEn: "Beginner",
    range: "〜300cm",
    strategy: "恐怖の抑制とチャンク化",
    strategyEn: "Fear suppression & chunking",
    construalAdjustment:
      '抽象度を上げ、比喩（Analogy）を多用する。衝突を想起させる「ボックス」を「通過点」や「空への窓」へリフレーミング。動作を大きなチャンク（塊）で捉え、細部ではなく全体の流れを伝える。恐怖心を軽減する肯定的な言い回しを使う。',
    construalAdjustmentEn:
      'Increase abstraction and use analogies/metaphors. Reframe fear-triggering terms like "box" to "passing point" or "window to the sky". Describe movements as large chunks rather than fine details. Use positive language to reduce fear.',
  },
  {
    level: "intermediate",
    label: "中級者",
    labelEn: "Intermediate",
    range: "301〜450cm",
    strategy: "技術の精緻化（Narrowed Profiling）",
    strategyEn: "Technical refinement (Narrowed Profiling)",
    construalAdjustment:
      "具体的な身体部位（肘、手首、膝）に注意の焦点を当てる。動作のタイミングや角度など数値的な指標も活用する。技術的な因果関係を明確にし、なぜその動きが必要かを論理的に説明する。",
    construalAdjustmentEn:
      "Focus attention on specific body parts (elbow, wrist, knee). Use numerical indicators for timing and angles. Clarify technical cause-and-effect relationships and explain why each movement matters logically.",
  },
  {
    level: "advanced",
    label: "上級者",
    labelEn: "Advanced",
    range: "451cm〜",
    strategy: "主観的感覚の同期",
    strategyEn: "Subjective sensation synchronization",
    construalAdjustment:
      '内部視点（Subjective Perspective）を用い、感覚的な言葉（例：壁を感じる、圧を乗せる）で微細な同期を行う。選手自身の内的体験に寄り添い、「感じる」「味わう」といった体性感覚の言語を用いる。',
    construalAdjustmentEn:
      'Use internal perspective (Subjective Perspective) with sensory language (e.g., "feel the wall", "load the pressure") for fine-grained synchronization. Align with the athlete\'s inner experience using proprioceptive language.',
  },
];

function getSkillLevel(bestRecord) {
  if (bestRecord <= 300) return SKILL_LEVELS[0];
  if (bestRecord <= 450) return SKILL_LEVELS[1];
  return SKILL_LEVELS[2];
}

// --- インテリジェント・プロンプター（誘導質問ボタン）---
/** 局面 × 習熟度 で3つの誘導質問を返す */
function getSuggestedPrompts(phaseId, level) {
  const map = {
    "1-beginner": [
      { label: "中間マークって何？", labelEn: "What's a mid mark?", prompt: "中間マークとは何か、初心者にもわかるように教えてください。" },
      { label: "走りが怖いときは？", labelEn: "Running with pole feels scary?", prompt: "ポールを持って走るのが怖いときの克服法を教えてください。" },
      { label: "最初の練習方法は？", labelEn: "First drills?", prompt: "助走の基本練習で最初にやるべきことを教えてください。" },
    ],
    "1-intermediate": [
      { label: "グリップと中間マークの関係", labelEn: "Grip vs mid mark?", prompt: "グリップを変えたときの中間マーク補正の考え方を教えてください。" },
      { label: "練習と試合のズレを直したい", labelEn: "Practice vs competition gap?", prompt: "練習と試合で中間マーク位置がズレる原因と対策を教えてください。" },
      { label: "ストライドの安定化", labelEn: "Stabilize stride?", prompt: "助走後半のストライドとピッチを安定させるコツを教えてください。" },
    ],
    "1-advanced": [
      { label: "加速感覚の同期", labelEn: "Syncing acceleration feel?", prompt: "助走後半で加速が噛み合う感覚を言語化してください。" },
      { label: "微妙なリズムのズレ", labelEn: "Subtle rhythm shifts?", prompt: "自分では気づきにくい助走リズムの微細なズレをどう感知すべきか教えてください。" },
      { label: "補正値から読む体の状態", labelEn: "Reading body state from offsets?", prompt: "中間マーク補正値の変動から自分の身体状態を読み取る方法を教えてください。" },
    ],
    "2-beginner": [
      { label: "ポールが重く感じる", labelEn: "Pole feels heavy?", prompt: "ポールが重く感じるときのドロップのコツを比喩的に教えてください。" },
      { label: "恐怖心を消すには？", labelEn: "Overcome drop fear?", prompt: "ポールを落とすタイミングが怖いとき、どう考えれば良いですか？" },
      { label: "簡単なドリルは？", labelEn: "Easy drill?", prompt: "ポールドロップの感覚を掴む最も簡単な練習法を教えてください。" },
    ],
    "2-intermediate": [
      { label: "6歩の落としタイミング", labelEn: "6-step drop timing?", prompt: "踏切6歩前からのドロップタイミングを具体的に教えてください。" },
      { label: "上の手と下の手の役割", labelEn: "Top hand vs bottom hand?", prompt: "ポールドロップ時の上の手と下の手の使い分けを詳しく教えてください。" },
      { label: "ドロップが詰まる原因", labelEn: "Drop gets stuck?", prompt: "ドロップ途中で動きが詰まってしまう原因と修正方法を教えてください。" },
    ],
    "2-advanced": [
      { label: "自然落下の感覚を同期", labelEn: "Syncing gravity feel?", prompt: "重力に任せるポールドロップの感覚を内部視点で言語化してください。" },
      { label: "ドロップ〜突っ込みの圧", labelEn: "Pressure from drop to plant?", prompt: "ドロップから突っ込みへの切り替えで感じるべき圧の質感を教えてください。" },
      { label: "Active Drop の体感", labelEn: "Active drop sensation?", prompt: "アクティブ・ポールドロップが成功している時の身体感覚を教えてください。" },
    ],
    "3-beginner": [
      { label: "ポールを楽に持つには？", labelEn: "Hold pole with ease?", prompt: "ポールを楽に持って走る感覚を日常の動きで例えてください。" },
      { label: "肩が力むときは？", labelEn: "Shoulder tension?", prompt: "ポールを持つと肩に力が入ってしまうとき、どうすれば良いですか？" },
      { label: "最初にやるべきドリル", labelEn: "First carry drill?", prompt: "ポールキャリーの感覚を掴む初心者向けドリルを教えてください。" },
    ],
    "3-intermediate": [
      { label: "腕振りの左右差を直す", labelEn: "Fix arm swing asymmetry?", prompt: "ポール保持時の腕振りの左右差を確認・修正する方法を教えてください。" },
      { label: "上半身リラックスの指標", labelEn: "Upper body relaxation check?", prompt: "走行中に上半身がリラックスできているかのチェック指標を教えてください。" },
      { label: "姿勢崩れの連鎖", labelEn: "Posture breakdown chain?", prompt: "助走前半の姿勢崩れが後半にどう影響するか因果関係を教えてください。" },
    ],
    "3-advanced": [
      { label: "ポールが体の一部になる感覚", labelEn: "Pole as body extension?", prompt: "ポールが自分の体の延長になっている感覚を言語化してください。" },
      { label: "視線と重心の微調整", labelEn: "Gaze & center of gravity?", prompt: "助走中盤の視線と重心の微細な調整感覚を教えてください。" },
      { label: "リズムの「間」の質感", labelEn: "Quality of rhythm pause?", prompt: "理想的な助走リズムの「間」の質感をどう感じるべきか教えてください。" },
    ],
    "4-beginner": [
      { label: "バンザイのイメージ？", labelEn: "Like a banzai pose?", prompt: "ハローポジションを「バンザイ」のような簡単な比喩で教えてください。" },
      { label: "踏切が怖いときは？", labelEn: "Scared of takeoff?", prompt: "踏切の瞬間が怖いとき、恐怖を和らげる考え方を教えてください。" },
      { label: "まず何を意識する？", labelEn: "First thing to focus on?", prompt: "ハローポジションで最初に意識すべきこと1つだけ教えてください。" },
    ],
    "4-intermediate": [
      { label: "肘の角度と肩の位置", labelEn: "Elbow angle & shoulder?", prompt: "踏切時の肘の角度と肩の位置関係の最適解を教えてください。" },
      { label: "地面反発の使い方", labelEn: "Using ground reaction?", prompt: "踏切で地面反発を最大化する足の接地方法を具体的に教えてください。" },
      { label: "ハロー→エラスティック接続", labelEn: "Hello → Elastic transition?", prompt: "ハローポジションからエラスティックへの連続動作のコツを教えてください。" },
    ],
    "4-advanced": [
      { label: "全身一直線の感覚", labelEn: "Full-body alignment feel?", prompt: "踏切瞬間の全身一直線が成功しているときの内的感覚を教えてください。" },
      { label: "地面を押す「圧」の質", labelEn: "Quality of ground push?", prompt: "踏切で地面を押す圧の方向性と質感を言語化してください。" },
      { label: "熟達者の感覚は？", labelEn: "What experts feel?", prompt: "ハローポジションが完璧に決まった瞬間、熟達者は何を感じていますか？" },
    ],
    "5-beginner": [
      { label: "大きなゴムになる感覚？", labelEn: "Like a big rubber band?", prompt: "エラスティックを「大きなゴムになる感覚」で分かりやすく教えてください。" },
      { label: "空中が怖いときは？", labelEn: "Scared in the air?", prompt: "空中で体が反るのが怖いとき、安心できる考え方を教えてください。" },
      { label: "最初の練習法は？", labelEn: "First practice?", prompt: "エラスティックの感覚を安全に掴む最初の練習を教えてください。" },
    ],
    "5-intermediate": [
      { label: "胸の開きと腰の連動", labelEn: "Chest opening & hip link?", prompt: "エラスティックでの胸の開きと腰の連動のメカニクスを教えてください。" },
      { label: "振り出しタイミング", labelEn: "Swing start timing?", prompt: "エラスティック後のスイング開始タイミングの見極め方を教えてください。" },
      { label: "進展が短い/長い問題", labelEn: "Extension too short/long?", prompt: "エラスティックが短すぎる・長すぎる時の判断と修正法を教えてください。" },
    ],
    "5-advanced": [
      { label: "ポールに圧を乗せる感覚", labelEn: "Loading pressure on pole?", prompt: "エラスティックでポールに圧を乗せている時の内的感覚を言語化してください。" },
      { label: "一瞬の「止まり」の質", labelEn: "Quality of the pause?", prompt: "エラスティック時の空中で一瞬止まる感覚の質感を教えてください。" },
      { label: "反発と進展の同期", labelEn: "Rebound & extension sync?", prompt: "地面反発からエラスティック進展への力の流れを体内感覚で教えてください。" },
    ],
    "6-beginner": [
      { label: "押し返しって何？", labelEn: "What is push-back?", prompt: "リアラインの「押し返し」を日常の動きに例えて教えてください。" },
      { label: "手が下がるのが怖い", labelEn: "Scared hands drop?", prompt: "手の位置が下がってから上がるのが怖いとき、どう考えれば良いですか？" },
      { label: "簡単な練習方法", labelEn: "Simple practice?", prompt: "リアラインの感覚を掴む最も簡単な練習を教えてください。" },
    ],
    "6-intermediate": [
      { label: "押す方向と軌道", labelEn: "Push direction & path?", prompt: "リアラインの押し返し方向と最適な手の軌道を具体的に教えてください。" },
      { label: "スイングとの同時性", labelEn: "Sync with swing?", prompt: "リアラインとスイングの同時性をどう確認・練習すべきか教えてください。" },
      { label: "横方向に流れる問題", labelEn: "Lateral drift issue?", prompt: "押し返しが横方向に流れてしまう原因と修正法を教えてください。" },
    ],
    "6-advanced": [
      { label: "背中に圧を乗せる", labelEn: "Loading back pressure?", prompt: "リアラインで「背中に圧を乗せる」感覚を具体的に言語化してください。" },
      { label: "ポール立ちの予感", labelEn: "Sensing pole rise?", prompt: "リアライン中にポールが立ち始める予感をどう感じているか教えてください。" },
      { label: "理想的な間の質感", labelEn: "Ideal timing quality?", prompt: "リアラインの理想的な「間」の質感を内部視点で教えてください。" },
    ],
    "7-beginner": [
      { label: "ブランコのイメージ？", labelEn: "Like a swing set?", prompt: "スイングを「ブランコ」のような身近な動きで説明してください。" },
      { label: "脚を振るのが怖い", labelEn: "Scared to swing legs?", prompt: "空中で脚を大きく振るのが怖いとき、どうすれば良いですか？" },
      { label: "最初の練習法は？", labelEn: "First swing drill?", prompt: "スイングの感覚を安全に掴む初心者向け練習を教えてください。" },
    ],
    "7-intermediate": [
      { label: "大きさとスピードの両立", labelEn: "Size & speed together?", prompt: "スイングの大きさとスピードを同時に高める具体的方法を教えてください。" },
      { label: "全身連動の確認", labelEn: "Full-body coordination?", prompt: "スイングで足だけでなく全身が連動しているかの確認方法を教えてください。" },
      { label: "抱え込みからの脱却", labelEn: "Beyond tuck swing?", prompt: "抱え込みスイングから大きなスイングへ移行する段階的方法を教えてください。" },
    ],
    "7-advanced": [
      { label: "加速が噛み合う瞬間", labelEn: "Acceleration click?", prompt: "スイングとリアラインの加速が完璧に噛み合う瞬間の感覚を教えてください。" },
      { label: "倒立移行の体感", labelEn: "Inversion transition feel?", prompt: "スイングから倒立へ移行する際の重心変化の体感を言語化してください。" },
      { label: "ポール反発との同期", labelEn: "Pole recoil sync?", prompt: "スイング中のポール反発と体の動きの同期感覚を教えてください。" },
    ],
    "8-beginner": [
      { label: "上に伸びるイメージ？", labelEn: "Reaching up image?", prompt: "エクステンションを「真上にスーッと伸びる」ような比喩で教えてください。" },
      { label: "待ってしまうのはなぜ？", labelEn: "Why do I wait?", prompt: "ポールが弾くのを待ってしまう心理とその対策を教えてください。" },
      { label: "簡単なドリルは？", labelEn: "Simple drill?", prompt: "エクステンションの感覚を掴む最も簡単なドリルを教えてください。" },
    ],
    "8-intermediate": [
      { label: "足首と体の一直線", labelEn: "Ankle lock & alignment?", prompt: "エクステンション時の足首ロックと体の一直線の作り方を教えてください。" },
      { label: "ポールスピードとの関係", labelEn: "Pole speed requirements?", prompt: "エクステンション成功のためのポールスピード条件を具体的に教えてください。" },
      { label: "横流れの防止", labelEn: "Prevent lateral drift?", prompt: "エクステンションで横に流れてしまう原因と修正法を教えてください。" },
    ],
    "8-advanced": [
      { label: "自分で上がり続ける感覚", labelEn: "Self-propelled rise feel?", prompt: "エクステンションで自分で上がり続けている時の内的感覚を教えてください。" },
      { label: "ポールとの一体感", labelEn: "Oneness with pole?", prompt: "エクステンション時のポールとの一体感をどう感じているか教えてください。" },
      { label: "垂直方向の圧の質", labelEn: "Vertical pressure quality?", prompt: "垂直方向への進展で感じるべき圧の質と方向性を言語化してください。" },
    ],
    "9-beginner": [
      { label: "バーの越え方のコツ", labelEn: "Tips for bar clearance?", prompt: "バーの越え方を「体をくぐらせる」ような分かりやすいイメージで教えてください。" },
      { label: "引っかかるのが怖い", labelEn: "Scared of hitting bar?", prompt: "バーに引っかかるのが怖いとき、恐怖を和らげる考え方を教えてください。" },
      { label: "低バーでの練習法", labelEn: "Low bar practice?", prompt: "低いバーでクリア動作を練習する方法を教えてください。" },
    ],
    "9-intermediate": [
      { label: "腰→肩→脚の順序", labelEn: "Hip → shoulder → leg order?", prompt: "クリア動作の「腰→肩→脚」通過順序の具体的な意識方法を教えてください。" },
      { label: "重心コントロール", labelEn: "Center of gravity control?", prompt: "クリア時の重心を低く保つコントロール方法を教えてください。" },
      { label: "進展との連動", labelEn: "Link with extension?", prompt: "エクステンションからクリアへの連続的な動きのつなげ方を教えてください。" },
    ],
    "9-advanced": [
      { label: "体を滑らせる感覚", labelEn: "Gliding body feel?", prompt: "クリア動作で「体を滑らせる」感覚を内部視点で言語化してください。" },
      { label: "回旋の質感", labelEn: "Rotation quality?", prompt: "バー上での体の回旋の質感と微細な調整感覚を教えてください。" },
      { label: "脚抜きの最適タイミング", labelEn: "Optimal leg clearance timing?", prompt: "脚抜きの最適タイミングをどう感知しているか教えてください。" },
    ],
  };

  const key = `${phaseId}-${level}`;
  return map[key] || [
    { label: "この局面のポイントは？", labelEn: "Key points of this phase?", prompt: "この局面で最も重要なポイントを教えてください。" },
    { label: "よくある失敗は？", labelEn: "Common mistakes?", prompt: "この局面でよくある失敗パターンとその修正方法を教えてください。" },
    { label: "おすすめドリルは？", labelEn: "Recommended drills?", prompt: "この局面の改善に最も効果的なドリルを教えてください。" },
  ];
}

// --- システムプロンプト生成 ---
function buildSystemPrompt(selectedPhaseIds, bestRecord, locale = "ja") {
  const isEn = locale === "en";
  const skillLevel = getSkillLevel(bestRecord);
  const selectedPhases = PHASE_DATA.filter((p) =>
    selectedPhaseIds.includes(p.phase_id)
  );

  const phaseNames = selectedPhases.map((p) => p.phase_name);
  const relatedGlossary = GLOSSARY.filter(
    (g) =>
      phaseNames.some((name) => name.includes(g.phase)) ||
      phaseNames.some((name) => name.includes(g.related_phase))
  );

  const construalGuidances = selectedPhases.map((p) => {
    const entry = getConstrualGuidance(p.phase_id, skillLevel.level);
    return entry
      ? `${p.phase_name} (${p.term_en}) → Strategy: ${entry.strategy} / Guidance: ${entry.guidance}`
      : "";
  }).filter(Boolean).join("\n");

  const videoUrls = selectedPhases.map((p) => {
    const urls = getPhaseUrls(p.phase_id);
    return `${p.phase_name} (${p.term_en}) → Video: ${urls.videoUrl} / Article: ${urls.articleUrl}`;
  }).join("\n");

  const phaseContext = selectedPhases
    .map(
      (p) => `
【${p.phase_name}】(${p.term_en})
${isEn ? "Definition" : "定義"}: ${p.definition_ja}
${isEn ? "Checkpoints" : "チェックポイント"}: ${p.cue_check}
${isEn ? "Common Errors" : "よくあるエラー"}: ${p.common_error}
${isEn ? "Fix Hints" : "修正ヒント"}: ${p.fix_hint}
${isEn ? "Drills" : "ドリル"}: ${p.drill}
${isEn ? "Notes" : "補足"}: ${p.additional_notes}
`
    )
    .join("\n");

  const glossaryContext = relatedGlossary
    .map(
      (g) =>
        `- ${g.term_ja} (${g.term_en}): ${g.definition} [${isEn ? "Check" : "チェック"}: ${g.checkpoint}] [${isEn ? "Error" : "エラー"}: ${g.common_error}]`
    )
    .join("\n");

  const langInstruction = isEn
    ? "You MUST respond entirely in English."
    : "回答は日本語で行う";

  const roleBlock = isEn
    ? `You are the "AI Construal Tuner (ACT)".
You integrate Cognitive Linguistics (Construal theory), neuroscience, and pole vault technical theory
to dynamically adjust the "cognitive frame" of coaching based on the athlete's skill level.

## Your Role
- Answer pole vault technical questions using a cognitive frame optimized for the athlete's skill level
- Unify terminology according to the glossary below
- ${langInstruction}`
    : `あなたは「AI事態把握調整器（ACT: AI Construal Tuner）」です。
認知言語学の「事態把握（Construal）」理論と脳科学、棒高跳び技術論を統合し、
選手の習熟度に応じて技術指導の「認知的フレーム」を動的に調整するAIコーチングアシスタントです。

## あなたの役割
- 棒高跳びの技術的な質問に対し、選手の習熟度に最適化された認知フレームで回答する
- 専門用語は下記の用語集に従い統一する
- ${langInstruction}`;

  const profileBlock = isEn
    ? `## Athlete Profile
- Personal Best: ${bestRecord}cm (${Math.floor(bestRecord / 100)}m${String(bestRecord % 100).padStart(2, "0")})
- Skill Level: ${skillLevel.labelEn} (${skillLevel.range})
- Cognitive Strategy: ${skillLevel.strategyEn}`
    : `## 現在の選手プロファイル
- ベスト記録: ${bestRecord}cm（${Math.floor(bestRecord / 100)}m${String(bestRecord % 100).padStart(2, "0")}）
- 習熟度レベル: ${skillLevel.label}（${skillLevel.range}）
- 認知戦略: ${skillLevel.strategy}`;

  const construalPriorityBlock = isEn
    ? `## [TOP PRIORITY] Cognitive Strategy from Phase–Skill Matrix
Apply the following strategies and guidance with the highest priority. NEVER use expressions that contradict them:
${construalGuidances}`
    : `## 【最優先】局面習熟度調整表に基づく認知戦略
以下の戦略・指導方針を最優先で適用し、この指針に反する表現は絶対に使わないこと：
${construalGuidances}`;

  const construalRulesBlock = isEn
    ? `## General Construal Rules\n${skillLevel.construalAdjustmentEn}`
    : `## 事態把握（Construal）全般ルール\n${skillLevel.construalAdjustment}`;

  let levelRules = "";
  if (skillLevel.level === "beginner") {
    levelRules = isEn ? `
### Beginner Special Rules (STRICT)
- NEVER use fear-inducing words like "box", "crash", "collision"
- Instead use positive reframing: "gateway", "window to the sky", "high-five"
- Explain movements in large chunks; limit information to 3 points at a time
- Actively use metaphors referencing everyday actions (e.g. "opening an umbrella", "reaching for the sky", "becoming a big rubber band")
- Emphasize safety and progress; be sensitive to fear
` : `
### 初心者向け特別ルール（厳守）
- 「ボックス」「突っ込む」「衝突」など恐怖を想起させる語は絶対に使わない
- 代わりに「通過点」「空への窓」「ハイタッチ」などポジティブな表現を使う
- 動作を大きなチャンク（塊）で説明し、一度に伝える情報を3つ以内にする
- 比喩を積極的に使い、日常的な動作に例える（例：「傘を差す動き」「バンザイする感覚」「大きなゴムになる」）
- 恐怖心に配慮し、安全と進歩を強調する
`;
  } else if (skillLevel.level === "intermediate") {
    levelRules = isEn ? `
### Intermediate Special Rules
- Use specific body part names (elbow, wrist, shoulder blade, knee, ankle)
- Indicate timing with concrete markers (e.g. "2 steps before takeoff")
- Clarify technical cause-and-effect (if A then B; without B, C happens)
- Organize checkpoints in bullet lists for easy self-diagnosis
` : `
### 中級者向け特別ルール
- 具体的な身体部位名（肘、手首、肩甲骨、膝、足首など）を明確に使用する
- 動作のタイミングを「踏切n歩前」などの具体的指標で示す
- 技術的な因果関係（AだからB、BができないとCが起きない）を明示する
- チェックポイントを箇条書きで整理し、自己診断しやすくする
`;
  } else if (skillLevel.level === "advanced") {
    levelRules = isEn ? `
### Advanced Special Rules
- Use first-person sensory descriptions ("feel the…", "sense the…")
- Focus on fine-grained body-sensation synchronization (pressure direction, center-of-gravity timing, muscle tension changes)
- Verbalize the "texture" and "timing" of movements
- Include questions so the athlete can cross-reference their own sensations
` : `
### 上級者向け特別ルール
- 内部視点（一人称）での感覚記述を多用する（「〜を感じる」「〜が走る」）
- 微細な身体感覚の同期（圧の方向、重心移動のタイミング、筋張力の変化）に焦点を当てる
- 動作の「質感」や「間」を言語化する
- 選手が自分の感覚と照合できるような問いかけを含める
`;
  }

  const dataBlock = isEn
    ? `## Technical Data for Selected Phases\n${phaseContext}\n\n## Related Glossary\n${glossaryContext}\n\n## Reference URLs\n${videoUrls}`
    : `## 選択された局面の技術データ（最終ボウタカ.docx準拠）\n${phaseContext}\n\n## 関連用語集（ボウタカAI用語集準拠）\n${glossaryContext}\n\n## 参考資料URL\n${videoUrls}`;

  const formatBlock = isEn
    ? `## Response Format (MUST use these 5 blocks)
Respond with exactly these 5 labeled sections:

**【Image】**
Metaphorical / cognitive advice based on the Phase–Skill Matrix. Guide the athlete's construal to match their skill level.

**【Technical Points】**
Specific body-mechanics points based on the technical data. Include checkpoints and error corrections.

**【Recommended Drills】**
Practice menus for improvement. Give 1–2 concrete drills the athlete can try right away.

**【References】**
Display article and video URLs as clickable links.

**【Summary】**
Summarize today's key points in 3 lines or fewer.

Keep answers concise and practical. Adjust information density to the athlete's skill level.`
    : `## 回答フォーマット（必ず以下の5ブロック構成で回答すること）
回答は必ず以下の見出し付き5ブロックで構成してください：

**【イメージ】**
局面習熟度調整表に基づく比喩的・認知的なアドバイス。選手の習熟度に合わせた事態把握の誘導。

**【技術ポイント】**
最終ボウタカ.docxに基づく具体的な身体操作のポイント。チェック項目やエラー修正を含む。

**【推奨ドリル】**
上達のための練習メニュー。すぐに試せる具体的なドリルを1〜2つ。

**【参考資料】**
該当する記事URLと動画URLをリンクとして表示。

**【まとめ】**
3行以内で今日のポイントをまとめる。

回答は簡潔かつ実践的に。一度に伝える情報量は選手の習熟度に合わせて調整すること。`;

  return `${roleBlock}

${profileBlock}

${construalPriorityBlock}

${construalRulesBlock}
${levelRules}

${dataBlock}

${formatBlock}`;
}

// --- 自動アドバイス生成用の初期プロンプト ---
function buildAutoAdvicePrompt(phaseLabel, phaseIds, locale = "ja") {
  const phases = PHASE_DATA.filter((p) => phaseIds.includes(p.phase_id));
  const phaseName = phases.map((p) => p.phase_name).join("・");
  if (locale === "en") {
    const phaseNameEn = phases.map((p) => p.term_en).join(" / ");
    return `The athlete selected the "${phaseLabel}" phase (${phaseNameEn}).
Generate advice for this phase using the 5-block format (【Image】【Technical Points】【Recommended Drills】【References】【Summary】).
Strictly follow the cognitive frame appropriate for the athlete's skill level and the Phase–Skill Matrix guidelines.`;
  }
  return `選手が「${phaseLabel}」局面（${phaseName}）を選択しました。
この局面について、5ブロック構成（【イメージ】【技術ポイント】【推奨ドリル】【参考資料】【まとめ】）でアドバイスを生成してください。
選手の習熟度に応じた認知フレームと局面習熟度調整表の指針を厳守してください。`;
}

module.exports = {
  PHASE_DATA,
  GLOSSARY,
  PHASE_GROUPS,
  CONSTRUAL_MAP,
  SKILL_LEVELS,
  VIDEO_URLS,
  getSkillLevel,
  getPhaseUrls,
  getConstrualGuidance,
  getSuggestedPrompts,
  buildSystemPrompt,
  buildAutoAdvicePrompt,
};
