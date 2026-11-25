(() => {
  "use strict";
  const kit = globalThis.courseKit;
  if (!kit) throw new Error("courseKit is required before part6-algorithms.js");
  const { makeChapter, flowDiagram, btreeFigure, callout, experiment } = kit;
  const metadata = { partTitle: "第6部 データ構造とアルゴリズム", total: 9 };
  const diagram = (title, items, caption) => `<figure class="diagram"><p class="diagram-title">${title}</p><div class="memory-map">${items.map(([a,b]) => "<div class=\"memory-row\"><span>"+a+"</span><span>"+b+"</span></div>").join("")}</div><figcaption>${caption}</figcaption></figure>`;
  const flow = (title, items, caption) => `<figure class="diagram"><p class="diagram-title">${title}</p><div class="flow-diagram">${items.map(([a,b]) => "<div class=\"flow-node\"><strong>"+a+"</strong><small>"+b+"</small></div>").join("")}</div><figcaption>${caption}</figcaption></figure>`;
  const ch = (id, no, shortTitle, title, deck, content) => makeChapter({ id, no, ...metadata, shortTitle, title, deck }, content);
  const binaryTreeFigure = (id, title, intro, root, caption, path = []) => {
    const node = ([value, ...children]) => `<li role="listitem">
      <strong class="binary-tree-node${path.includes(value) ? " is-search-path" : ""}">${value}</strong>
      ${children.length ? `<ul role="list">${children.map(node).join("")}</ul>` : ""}
    </li>`;
    return `<figure class="concept-figure" aria-labelledby="${id}">
      <h3 class="visual-title" id="${id}">${title}</h3>
      <p>${intro}</p>
      <ul class="binary-tree" role="list" aria-label="親子関係">${node(root)}</ul>
      <figcaption class="visual-caption">${caption}</figcaption>
    </figure>`;
  };

  const arrayList = ch("array-linked-list", 1, "Array / Linked List", "Array / Linked List：データの並べ方", "データをどこに置くかで、読み出しや追加の速さが変わります。ArrayとLinked Listを、Webの一覧やメモリの見え方から比べます。", {
    goals:["Arrayが連続した場所に並ぶこと","Linked Listが値と次の場所へのリンクを持つこと","読み出し・追加・削除の得意不得意","JavaとJavaScriptの配列の特徴"],
    why:`<p>商品一覧や検索結果を扱うとき、データをただの箱と考えると、件数が増えたときの遅さを説明できません。データをメモリ上のどこへ置くかで、探す手間と移動する量が変わります。</p><p>この構造がない場合、順番や関係を毎回自分で管理することになります。Webの一覧やQueueも基本構造の組み合わせです。</p>`,
    example:`<p>生徒名を<code>["A","B","C","D"]</code>として保存します。Arrayなら要素が連続した場所へ置かれ、3番目をすぐ計算できます。Linked Listでは各Nodeが値と次のNodeの場所を持つため、先頭のAからリンクを2回たどってCに着きます。</p><p>途中にXを入れる場合、Arrayは後ろをずらします。Linked Listはリンクを付け替えますが、位置までたどる時間は必要です。</p>
    <h3>挿入の前に場所を探す時間も数える</h3>
    <p>A・B・C・DのBの直後へXを入れます。</p>
    <ul><li><strong>Array</strong>ではBの位置を番号で指定でき、空きを作るために後ろのCとDを移します。</li>
      <li><strong>Linked List</strong>でBのNodeをすでに持っていれば、BとCの間のリンクを変更してXを入れられます。</li>
      <li><strong>Linked Listで番号だけを知っている場合</strong>は、先頭からBを探す時間もかかります。</li></ul>
    <p>「どこに入れるかは分かっているか」をそろえて比べると、どちらがその操作に向くかが分かります。</p>`,
    internal:`${diagram("Arrayの連続配置",[["index 0","A | address 1000"],["index 1","B | address 1004"],["index 2","C | address 1008"],["index 3","D | address 1012"]],"先頭アドレスと添字から場所を計算できます。")}${flow("Linked Listのリンク",[["Node A","value A → next 0x20"],["Node B","value B → next 0x90"],["Node C","value C → next null"],["追跡","Aから順に読む"]],"Nodeは離れた場所にあってもnextリンクで順番を表せます。")}<h3>添字アクセス</h3><p>Arrayの<code>a[i]</code>は、先頭の場所に要素の大きさ×iを足して読み出す、と考えられます。これはO(1)と表します。</p><h3>リンク追跡</h3><p>Linked Listの<code>next</code>は次のNodeを指す値です。先頭への追加はリンクを一つ付け替えるだけです。</p>${callout("note","実装の現実","JavaのArrayListやJavaScriptのArrayは、容量拡張や最適化も持つ便利な実装です。")}`,
    web:`<p>検索結果の一覧は、添字で表示しやすいArray系が向きます。途中へ頻繁に追加する処理ではLinked Listの考え方が役立つことがあります。ただし連続して置かれるArrayのほうが、CPU cacheのため走査が速い場合もあります。</p><p>Javaでは<code>ArrayList</code>と<code>LinkedList</code>、JavaScriptでは<code>push</code>や<code>splice</code>の性質を確認します。</p>`,
    lab:`${experiment("macOS / Java","cat > ListBench.java <<'EOF'\nimport java.util.*;\nclass ListBench { public static void main(String[] x) { List<Integer> a=new ArrayList<>(), l=new LinkedList<>(); for(int i=0;i<200000;i++){a.add(i);l.add(i);} System.out.println(a.get(199999)); System.out.println(l.get(199999)); }}\nEOF\njavac ListBench.java && java ListBench","ArrayListとLinkedListの末尾読み出しを比べます。","同じList APIでも読み出しの得意さが違う点に注目します。","構造が操作時間の傾向を変えると分かります。")}${experiment("Linux / JavaScript","node -e \"const a=Array.from({length:200000},(_,i)=>i); console.log(a[199999]); let p=null; for(let i=199999;i>=0;i--)p={value:i,next:p}; console.log(p.value)\"","配列の添字とリンク追跡を動かします。","Nodeをたどる回数に注目します。","二つは同じ一覧でも違う仕事をすることが分かります。")}`,
    misunderstandings:[["Linked ListはいつでもArrayより速いです。","途中への追加は得意ですが、添字アクセスや連続走査ではArrayが有利なことがあります。"],["JavaScriptのArrayは常に固定長です。","伸び縮みするオブジェクトで、実行エンジンが形に応じて最適化します。"]],
    questions:[["Arrayのa[3]が速い理由は何ですか。","先頭の場所と要素サイズ、添字から場所を計算できるためです。","先頭からNodeを3個たどる必要があるためです。","全要素を比較して3番目を見つけるためです。","Arrayは要素を連続して置くので、添字から目的位置を直接計算できます。Node追跡や全件比較はLinked Listや線形探索の説明です。"],["Linked ListのNodeが持つ情報は何ですか。","値と次のNodeへのリンクです。","値と全Nodeの配列番号です。","値と必ず前後両方のリンクです。","単方向Linked Listでは次のNodeへのリンクを使って進みます。配列番号の一覧はArrayの考え方で、前リンクまで必須なのは双方向Listです。"],["Linked Listの先頭追加が得意なのはなぜですか。","新Nodeのnextと先頭の参照を付け替えるだけだからです。","後ろの全要素を一つずつ移動するからです。","先頭まで必ず全Nodeを検索して並べ直すからです。","先頭が分かっていればリンク2か所の変更で済みます。要素移動や全件検索は連続Arrayの途中操作に近い仕事です。"],["一覧構造が遅いとき、最初に何を確認しますか。","読み出し・追加・削除・検索のどれを多く行うかと実測値です。","Nodeの色だけを変えて構造は測定しません。","要素数に関係なく常にArrayへ置き換えます。","操作の割合と件数で得意な構造が変わるため、処理時間を測って判断します。色や一律の置換では原因を特定できません。"],["途中への追加でLinked ListがいつでもArrayより速い、と言えますか。","位置までの移動時間や実装のキャッシュ効率もあるため、操作条件で変わります。","必ずLinked ListがO(1)で位置探索も不要です。","必ずArrayが全操作でO(1)です。","既知のNodeの前ならリンク変更が有利ですが、位置を探す時間は残ります。Arrayも添字読出しは速い一方、途中挿入では移動が必要です。"]],
    checks:["Arrayの連続配置と添字","Linked ListのNodeとnext","操作ごとの得意不得意","ライブラリと基本構造"], search:"Array 配列 Linked List Node ArrayList LinkedList 添字 push splice memory cache"
  });

  const stackQueue = ch("stack-queue", 2, "Stack / Queue", "Stack / Queue：順番を制御する箱", "最後に入れたものを先に出すStackと、先に入れたものを先に出すQueue。Undo、関数呼び出し、リクエスト処理を順序のルールで見ます。", {
    goals:["StackのLIFOとQueueのFIFO","push/popとenqueue/dequeue","関数呼び出しとStack Frame","Webの仕事待ち行列とBackpressure"],
    why:`<p>ブラウザで戻る操作をしたとき、最後に開いたページから戻るのはStackの順番です。サーバーが届いた仕事を到着順に処理するのはQueueです。</p><p>順番のルールがない場合、Undoや次のリクエストが毎回ばらばらになります。</p>`,
    example:`<p>StackへA、B、Cの順に積むと、取り出しはC、B、Aです。QueueへA、B、Cの順に入れると、取り出しはA、B、Cです。</p><p>関数が別の関数を呼ぶと、呼ばれた関数のStack Frameが上に積まれ、終わると取り除かれます。戻り先やローカル変数がFrameに記録されます。</p>
    <h3>同じ三件を用途によって並べ直す</h3>
    <p>A、B、Cの順に編集し、「元に戻す」を2回押すならC、Bの順で取り消します。最新の操作を先に扱うのでStackが合います。同じ三件が印刷の依頼で、受付順を守るならA、Bから処理します。この順番がQueueです。</p>
    <p>新しいDが途中で入った場合も考えましょう。Stackでは次の取り出しがDになり、QueueではDは先に入った項目の後ろに並びます。</p>`,
    internal:`${diagram("StackのLIFO",[["top","C ← pop()"],["","B"],["bottom","A ← push()"]],"一番上だけを操作するため後から入れた値が先に出ます。")}${diagram("QueueのFIFO",[["head","A → dequeue()"],["","B"],["tail","C ← enqueue()"]],"末尾から入り、先頭から出ます。")}<h3>Stack Frame</h3><p>関数の戻り先、引数、ローカル変数などをまとめたFrameがStackに置かれます。再帰が深すぎるとStack Overflowになります。</p><h3>Queueの実装</h3><p>Arrayの先頭削除を繰り返すと残りをずらします。head番号を進めれば、要素をずらさずに済みます。</p>${callout("important","順番の接続","QueueはPacket処理やMessage Queue、Stackは関数実行や履歴へつながります。")}`,
    web:`<p>WebサーバーのThread PoolやJob Queueは、待っている仕事をQueueへ入れます。Queueが長いと待ち時間が増えるため、長さと待ち時間を監視します。</p><p>Javaの<code>Deque</code>や<code>ArrayDeque</code>、JavaScriptの<code>push/pop</code>はStackに使えます。Queueではhead indexや専用ライブラリを検討します。</p>`,
    lab:`${experiment("macOS / Java","cat > StackQueue.java <<'EOF'\nimport java.util.*;\nclass StackQueue { public static void main(String[] x){Deque<String>s=new ArrayDeque<>();s.push(\"A\");s.push(\"B\");System.out.println(s.pop());Queue<String>q=new ArrayDeque<>();q.add(\"A\");q.add(\"B\");System.out.println(q.remove());}}\nEOF\njavac StackQueue.java && java StackQueue","JavaのStackとQueueの取り出し順を確認します。","stackはB、queueはAになる点に注目します。","LIFOとFIFOが違う規則だと分かります。")}${experiment("Linux / JavaScript","node -e \"const s=[];s.push('A','B');console.log(s.pop());const q=['A','B'];let h=0;console.log(q[h++])\"","push/popとhead indexのQueueを動かします。","shift()で全要素をずらさない実装に注目します。","Queueの先頭を参照で進められると分かります。")}`,
    misunderstandings:[["StackとQueueは別の形のデータ型です。","本質は入れ出しの順序で、配列やリンクでどちらも実装できます。"],["Queueが長くても応答速度に影響しません。","待ち時間、メモリ、再試行の負担が増えることがあります。"]],
    questions:[["Stackの取り出し順は何ですか。","最後に入れたものが先に出るLIFOです。","最初に入れたものが先に出るFIFOです。","優先度の数値が小さいものから出る順です。","Stackはtopだけを出し入れするため、後入れ先出しになります。FIFOはQueue、優先度順はPriority Queueの規則です。"],["関数呼び出しでStackに置かれるものは何ですか。","戻り先・引数・ローカル変数などのStack Frameです。","全Threadが共有するDBのRow一覧です。","ブラウザのCSSOMと画像Layerです。","呼び出しごとのFrameが戻り先や局所的な値を保持します。DB RowやCSSOMは別の保存・描画データです。"],["A、B、Cを順にStackへpushした場合、最初に何が出ますか。","Cです。","Aです。","Bです。","最後にpushしたCがtopにあるため、popはCから始まります。Aから出るのはQueueのFIFOです。"],["Job Queueが長いとき、どの指標を確認しますか。","Queue長、最古Messageの年齢、処理速度、失敗数です。","Stackの一番上の値だけです。","CSSの継承順だけです。","Queueの長さだけでなく、どれだけ待つかとWorkerの処理能力・失敗を合わせて見ます。StackやCSSの値では待ち行列の詰まりを測れません。"],["Queueを配列の先頭削除で実装し続ける問題は何ですか。","要素をずらす仕事が増えるため、head番号などで進める方法を検討します。","FIFOの順序が必ずLIFOへ変わります。","Queueが自動的にPriority Queueになります。","先頭削除で残りを移動する実装では負担が増えます。順序や優先度が自動で変わるわけではありません。"]],
    checks:["LIFOとFIFO","Stack Frame","Queueのhead/tail","Job Queueと待ち時間"], search:"Stack Queue LIFO FIFO push pop enqueue dequeue Stack Frame recursion overflow ArrayDeque head tail Job Queue backpressure"
  });

  const hash = ch("hash-table", 3, "Hash Table", "Hash Table：キーから値へ近道", "Hash Tableは、キーを小さな番号へ変換して値の場所をすぐ探します。HashMapが高速になりやすい理由、衝突、Resizeを見ます。", {
    goals:["Hash FunctionとBucket","Collisionの解決","HashMapの平均O(1)","負荷率とResize"],
    why:`<p>ユーザーIDから情報を探すたび、1件目から順に比べると人数に比例して時間が増えます。Hash TableはIDを計算し、候補の場所へ近づきます。</p><p>この仕組みがないとCacheやSessionで毎回全件走査が必要です。衝突を解決する方法も必要です。</p>`,
    example:`<p>キー<code>"alice"</code>をHash Functionへ渡すと、例えば4812が返り、Bucket数8なら<code>4812 % 8 = 4</code>でBucket 4へ進みます。</p><p><code>"bob"</code>も4になればCollisionです。同じBucket内で候補を探すか、別の空きBucketを探します。</p>
    <h3>同じBucketに入ったキーを区別する</h3>
    <p><code>alice</code>と<code>bob</code>がどちらもBucket 4に入る例で、<code>bob</code>の値を更新します。Bucket内に候補を並べる実装なら、まずBucket 4を選び、次に候補のキーが<code>bob</code>と一致するかを調べます。一致した項目だけを更新します。</p>
    <p>Hashは候補を狭める手掛かりです。同じ場所に集まるキーが増えれば、その中で比較する回数も増えます。要素数と、Bucketごとの偏りの両方が処理時間に効きます。</p>`,
    internal:`${diagram("HashMapのBucket",[["key alice","hash 4812 → 4"],["Bucket 4","alice → user object"],["key bob","同じ4ならCollision"],["Bucket 4","alice → bob → ..."]],"キーをBucket番号へ変換し、衝突時は候補を調べます。")}${flow("Resize",[["小さいTable","8 buckets"],["負荷率上昇","衝突増加"],["再Hash","16 buckets"],["検索","平均を保つ"]],"要素が増えるとBucket数を増やし、再配置することがあります。")}<h3>Hash Function</h3><p>同じキーなら同じ値を返し、違うキーは広く散らばる関数が望まれます。HashMap用と暗号用のHashは目的が違います。</p><h3>平均と最悪</h3><p>衝突が少なければ平均O(1)ですが、すべて同じBucketならO(n)になります。</p>${callout("note","キーの注意","JavaScriptのMapやJavaのHashMapは、キー比較やResizeを内部で行います。")}`,
    web:`<p>Web APIではSession IDからユーザーを引くCache、重複リクエストを判定するSet、IDから設定を引くMapに使います。平均が速くても巨大なMapはメモリを消費します。</p><p>DBのIndexは等価検索だけでなく範囲検索も必要なため、次章のTreeが登場します。</p>`,
    lab:`${experiment("macOS / Java","cat > MapBench.java <<'EOF'\nimport java.util.*;\nclass MapBench { public static void main(String[] x){Map<String,Integer>m=new HashMap<>();for(int i=0;i<100000;i++)m.put(\"id\"+i,i);System.out.println(m.get(\"id99999\"));}}\nEOF\njavac MapBench.java && java MapBench","Java HashMapの登録とキー検索を確認します。","同じキーを登録すると値が置き換わる点も試します。","キーから値を引くAPIを観察できます。")}${experiment("Linux / JavaScript","node -e \"const m=new Map();for(let i=0;i<100000;i++)m.set('id'+i,i);console.log(m.get('id99999'),m.has('id50000'))\"","JavaScript Mapで検索と存在確認を行います。","getとhas、キーの型に注目します。","一覧を順に探さずキーを使う道具だと分かります。")}`,
    misunderstandings:[["HashMapは必ずO(1)です。","平均ではO(1)ですが、衝突が極端だとO(n)になります。"],["Hash値が違えばBucketも必ず違います。","Bucket数で割るため、違うHash値でも同じBucketになります。"]],
    questions:[["Hash Functionの仕事は何ですか。","キーを数値へ変換しBucketを選びやすくすることです。","キーを大小順に並べてTreeを作ることです。","キーを必ず暗号化して誰にも読めなくすることです。","Hash Functionは候補位置を計算する関数です。順序付けはTree、暗号化や秘密保持は暗号処理の役割ではありません。"],["Collisionとは何ですか。","異なるキーが同じBucketへ割り当てられることです。","同じキーが二つの異なるMapへ保存されることです。","Bucketが空なのにLookupが成功することです。","Bucket数へ割った結果、別キーでも同じ位置になることがあります。空Bucketの成功やMap間の保存はCollisionの定義ではありません。"],["HashMapが平均O(1)になりやすい理由は何ですか。","キーから候補Bucketへ近づき、調べる候補を少なくするためです。","常に全要素を小さい順に並べ替えるためです。","どのキーでも必ず同じBucketだけを読むためです。","分散が良ければ見る候補が少なく平均的に一定時間へ近づきます。全件Sortや一つのBucket集中ではありません。"],["HashMapの検索が急に遅くなったとき何を調べますか。","負荷率・Collisionの偏り・Resizeが起きているかを調べます。","値の文字色だけを変えて再起動します。","範囲検索なので必ずHash Functionを削除します。","要素が増えたり偏ったHashで衝突が増えると候補が増えます。負荷率やResizeを確認するのが原因に近く、色や無条件削除ではありません。"],["Hash値が違えばBucketも必ず違う、と言えますか。","Bucket数で割るため、違うHash値でも同じBucketになることがあります。","Hash値が違えば必ず別Tableへ移ります。","Hash値は保存時に全て同じ数へ丸められます。","Bucket番号はHash値をBucket数で割るなどして求めるため、異なる値の衝突が起こります。Table分離や全て同値化が仕組みではありません。"]],
    checks:["Hash FunctionとBucket","Collision","平均O(1)と最悪O(n)","負荷率・ResizeとCache"], search:"Hash Table HashMap hash function bucket collision resize load factor average O(1) worst O(n) cache session"
  });

  const bst = ch("tree-bst", 4, "Tree / Binary Search Tree", "Tree / Binary Search Tree：階層で探す構造", "Treeは親子関係を持つデータ構造です。Binary Search Treeでは小さい値を左、大きい値を右へ置き、候補を絞ります。", {
    goals:["TreeのNode・親子・Leaf","BSTの探索規則","高さと検索時間","偏りとBalance"],
    why:`<p>フォルダ、商品カテゴリ、HTMLのDOMは階層を持ちます。平らな配列だけでは親子関係を扱いにくくなります。</p><p>BSTなら順序付きデータの候補を絞れますが、入力順で片側へ偏る点に注意します。</p>`,
    example:`<p>値<code>8,3,10,1,6</code>を入れます。8をRootにし、3は左、10は右、1は3の左、6は3の右です。6を探すと、8→左→3→右→6と進みます。</p><p>昇順に入れると右だけへ伸び、Linked Listのようになります。</p>
    <h3>存在しない値を探すとどこで止まるか</h3>
    <p>例の木で値5を探すとします。</p>
    <ol><li><strong>8から左へ</strong>進みます。5は8より小さいためです。</li>
      <li><strong>3から右へ</strong>進みます。5は3より大きいためです。</li>
      <li><strong>6から左へ</strong>進もうとします。そこに子がなければ、5は入っていないと分かります。</li></ol>
    <p>各分岐で大小関係が成り立つので、反対側の枝を探し直す必要がありません。検索の回数は、実際に通った高さに応じて増えます。</p>`,
    internal:`${binaryTreeFigure("bst-search-title", "二分探索木で6を探す",
      "箱は値を持つノード、線は親と子のつながりです。いちばん上の8から始めます。",
      [8, [3, [1], [6]], [10]],
      "6は8より小さいので左の3へ、3より大きいので右の6へ進みます。太い枠がこの探索で訪れたノードです。",
      [8, 3, 6])}
    <figure class="concept-figure" aria-labelledby="bst-height-title">
      <h3 class="visual-title" id="bst-height-title">同じ7件でも、木の形で探索回数が変わる</h3>
      <div class="visual-compare">
        <div><strong>左右に分かれた木</strong><p>根が4で、右の子が6、その右が7なら、<code>4 → 6 → 7</code> の3回で見つかります。</p></div>
        <div><strong>右にだけ伸びた木</strong><p>1から7まで右へ一つずつつながっていると、7に着くまでに7回比べます。</p></div>
      </div>
      <figcaption class="visual-caption">1〜7から同じ値7を探しています。比較回数は、出発点から目的の値までに通るノードの数で決まります。</figcaption>
    </figure><h3>探索と挿入</h3><p>値を比較し、小さければ左、大きければ右へ進みます。空き場所へ挿入すると順序を保てます。</p><h3>Traversals</h3><p>Preorderは親→左→右、Inorderは左→親→右、Postorderは左→右→親です。BSTのInorderは小さい順になります。</p>${callout("warning","偏り","AVL TreeやRed-Black Treeは回転で高さを抑えます。DBでは次章のB-Tree系がページをまとめます。")}`,
    web:`<p>カテゴリや組織階層、DOM、JSONの入れ子はTreeで表現できます。親から子を再帰的に訪れる処理に役立ちます。経路PrefixもTreeとして見ると、条件が長い順に絞られる様子が分かります。</p>`,
    lab:`${experiment("macOS / Java","cat > BST.java <<'EOF'\nclass BST {static class N{int v;N l,r;N(int v){this.v=v;}}static N a(N n,int v){if(n==null)return new N(v);if(v<n.v)n.l=a(n.l,v);else n.r=a(n.r,v);return n;}static void in(N n){if(n==null)return;in(n.l);System.out.print(n.v+\" \");in(n.r);}public static void main(String[]x){N n=null;for(int v:new int[]{8,3,10,1,6})n=a(n,v);in(n);}}\nEOF\njavac BST.java && java BST","BSTを作りInorderで昇順に出します。","再帰の左・自分・右に注目します。","Nodeと再帰の構造を確認できます。")}${experiment("Linux / JavaScript","node -e \"class N{constructor(v){this.v=v;this.l=null;this.r=null}};function a(n,v){if(!n)return new N(v);if(v<n.v)n.l=a(n.l,v);else n.r=a(n.r,v);return n};console.log('BST node',new N(8))\"","JavaScriptでNodeを作りBSTの入口を確認します。","nullが葉の先を表す点に注目します。","JavaとJavaScriptでNodeの考え方が共通だと分かります。")}`,
    misunderstandings:[["BSTは必ず半分ずつに分かれます。","入力順で偏り、探索がO(n)になることがあります。"],["Treeの葉は必ず同じ深さです。","通常のTreeでは深さが違って構いません。"]],
    questions:[["TreeのLeafとは何ですか。","子Nodeを持たない末端のNodeです。","必ずRootから最も遠い全Nodeの集合です。","親を二つ持つ分岐専用のNodeです。","Leafは子がないNodeを指します。深さの最遠条件や親の数はTree全体の形によって変わり、定義ではありません。"],["BSTで現在の値より小さい値を探すとき、どちらへ進みますか。","左側の部分木へ進みます。","右側の部分木へ進みます。","全てのLeafを順番に調べます。","BSTは小さい値を左、大きい値を右へ置く規則を使います。全Leaf走査は比較で枝を絞るBSTの利点を使いません。"],["BSTのInorder走査が返しやすい順番は何ですか。","値の小さい順です。","Root、左、右のPreorder順です。","左、右、RootのPostorder順です。","Inorderは左→自分→右なのでBSTでは昇順になります。Root先行はPreorder、Root後置はPostorderです。"],["BSTの探索が遅くなったとき、何を確認しますか。","木の高さと入力順による偏りを確認します。","Leafの色だけを確認して高さは測りません。","Node数が少ないことだけで必ず高速と判断します。","偏ったBSTは高さが大きくなり比較回数が増えます。Node数だけでなく高さを測る必要があります。"],["BSTは入力順に関係なく必ずO(log n)ですか。","偏ると高さが大きくなりO(n)に近づくことがあります。","どんな入力でも一回の比較で終わります。","偏るほど必ずO(1)になります。","均衡に近い場合の目安がO(log n)で、昇順入力などではLinked Listのように偏ります。比較回数は一回にも一定時間にもなりません。"]],
    checks:["NodeとLeaf","BSTの比較探索","高さと検索時間","偏りとBalance","TreeのWeb表現"], search:"Tree Node parent child leaf Binary Search Tree BST root height balanced skewed inorder DOM category"
  });

  const btree = ch("btree-bplus", 5, "B-Tree / B+Tree", "B-Tree / B+Tree：DB Indexのページ構造", "DBのIndexは、巨大なデータをディスクやSSDから少ない読み出しで探します。B-TreeとB+Treeをページ単位で見ます。", {
    goals:["一つのNodeに複数キーを持つ理由","B+TreeのLeafと横リンク","ページ読み出しと高さ","Indexの書き込みコスト"],
    why:`<p>DBのデータは大きく、すべてをメモリへ置けません。SSDやディスクから読むページには時間がかかります。</p><p>B-Treeは一ページに複数のキーと子の場所を置き、読み出し回数を抑えます。これがないと何百万行も順にページを読みます。</p>`,
    example:`<p>Rootページに<code>50,100</code>があれば、50未満は子0、50以上100未満は子1、100以上は子2です。77を探すと子1へ進みます。</p><p>B+Treeでは行への参照をLeafに集め、Leaf同士を横につなぐことが多いです。70以上90以下なら横リンクを順に進みます。</p>
    <h3>最初の葉を探し、次は横へ読む</h3>
    <p>図のキーを使い、70〜85を検索します。</p>
    <ol><li><strong>Root</strong>では70が50以上100未満なので中央へ進みます。</li>
      <li><strong>中央の内部ページ</strong>では70が境界キー80より小さいので、Leaf Bへ進みます。</li>
      <li><strong>Leaf</strong>では70と77を読み、横のLeaf Cで80と85を読みます。</li></ol>
    <p>最初の位置を見つけるために木を下り、範囲の後続は葉のつながりを使って読みます。検索範囲の終わりを超えるキーが出たら、そこで読み進めるのを止められます。</p>`,
    internal:`${btreeFigure("B+Treeは枝分かれする木", "枠が太いページは77を探す経路です。範囲検索では、見つけたLeafから右へリンクをたどります。")}${flowDiagram("Indexで77を探す", [
      ["Root", "50以上100未満の枝", "process", "77は50以上100未満なので、まん中のInternal Bへ進みます。"],
      ["Internal B", "70以上85未満の枝", "process", "77は70以上85未満なので、該当するLeaf Bへ進みます。"],
      ["Leaf B", "77を見つける", "store", "Leaf Bのキーを確認し、77に対応するデータを見つけます。"]
    ], "範囲検索なら、見つけた場所から次のLeafも横にたどれます。", { animate: true })}<h3>ページと高さ</h3><p>DBはデータをPage単位で読み書きします。一つのPageへ複数のキーを入れると、一度に多くの枝から次を選べます。そのため、データが多くても木を低く保ちやすくなります。</p><h3>Indexの代償</h3><p>IndexはSELECTを速くしやすい一方、INSERTやUPDATEのたびに木も更新します。容量と書き込み時間が増えるため、検索に使わないIndexを増やしすぎないようにします。</p>${callout("important","B+TreeとHash","Hashは同じ値を探す処理、B+Treeは大小順と範囲検索に向きます。")}`,
    web:`<p><code>WHERE created_at BETWEEN ...</code>や<code>ORDER BY id LIMIT 20</code>では、B+TreeのLeafを順に読む設計が活躍します。条件や選択性によってIndexが使われない場合もあります。</p><p>第8部のRDBでは、Index ScanとFull Table Scanを実行計画で比べます。</p>`,
    lab:`${experiment("macOS / Java","cat > PageIndex.java <<'EOF'\nimport java.util.*;\nclass PageIndex{public static void main(String[]x){TreeMap<Integer,String>m=new TreeMap<>();for(int i=0;i<20;i++)m.put(i*10,\"row\"+i);System.out.println(m.subMap(70,true,120,true));}}\nEOF\njavac PageIndex.java && java PageIndex","TreeMapの順序付き範囲検索を確認します。","subMapが指定範囲だけを取り出す点に注目します。","HashMapと違い、大小順を使える構造だと分かります。")}${experiment("Linux / JavaScript","node -e \"const rows=Array.from({length:20},(_,i)=>({id:i*10}));console.log(rows.filter(r=>r.id>=70&&r.id<=120))\"","JavaScriptでIndexなしの全件走査を比較します。","filterが全行を見る点に注目します。","DBのB+Treeは全件走査を避ける道だと分かります。")}`,
    misunderstandings:[["Indexを追加すれば全SQLが速くなります。","条件や並びがIndexに合わない場合は使われません。"],["B+TreeのLeafには必ず行データそのものが入ります。","製品やIndex種類によって、行への参照を持つ構成もあります。"]],
    questions:[["DBのPageとは何ですか。","DBがまとめて読み書きする単位です。","SQLのWHERE条件を一つだけ保存する変数です。","Browserが一画面を描画するPixelの単位です。","DBはDiskやBufferとのI/OをPage単位で扱います。WHEREの変数や画面Pixelとは異なるデータ管理の単位です。"],["B+Treeで77を探す大まかな順番はどれですか。","RootからInternal、Leafへ枝を選んで進みます。","全Leafを左から読み、最後にRootを確認します。","まずHash Bucketを探し、見つからなければRootへ戻ります。","各Pageの境界キーを比較して枝を絞り、Leafでキーを確認します。Hash検索やLeaf全走査が基本順序ではありません。"],["B+TreeのLeaf同士の横リンクが役立つ検索は何ですか。","見つけた位置から連続して読む範囲検索や順序走査です。","全く関係ない暗号文を復号する検索です。","Rootだけを一度読む単一キー検索だけです。","Leafの順序リンクは次の値へ進めるため、範囲やORDER BYに向きます。暗号復号やRootだけの検索を速くする仕組みではありません。"],["Indexを追加したのに書込みが遅くなったとき、何を確認しますか。","INSERT・UPDATE時のIndex更新、Index容量、実行計画を確認します。","IndexがあるのでDBの書込み処理は必ずゼロになると判断します。","全Indexを削除して読み取り計画を見ないままにします。","Indexは読出しを助ける一方、変更時に木の更新と容量を要します。読み書き双方の計画を見て必要なIndexだけ残します。"],["B+TreeのIndexを追加すれば、全てのSQLが速くなりますか。","条件や並びがIndexに合わず、Full Table Scanが選ばれる場合もあります。","どんな列の検索でも必ずLeaf一つで終わります。","IndexがあればDBのBuffer Poolは不要になります。","Optimizerは条件・選択性・統計を見て計画を選びます。Indexがあっても全走査やBuffer利用が起こり得ます。"]],
    checks:["ページと複数キー","B+TreeのLeaf","Index Scan","範囲検索とHash","読み取りと書き込みの代償"], search:"B-Tree B+Tree database index page leaf range scan ORDER BY TreeMap Full Table Scan RDB"
  });

  const heapGraph = ch("heap-graph", 6, "Heap / Graph", "Heap / Graph：優先順位とつながり", "Heapは一番小さい・大きいものを取り出す木構造です。GraphはNodeとEdgeで関係を表し、依存関係やRoutingを探索します。", {
    goals:["Heapの親子と最小・最大の保証","Priority Queue","GraphのVertexとEdge","BFS・DFSと依存関係・Routing"],
    why:`<p>緊急度順に仕事を処理したいとき、先着順Queueだけでは足りません。HeapのPriority Queueなら優先度の高い項目を取り出せます。</p><p>サービス同士や地点同士の関係はTreeとは限りません。複数のつながりや循環を表すにはGraphを使います。</p>`,
    example:`<p>「障害=1、通常=5、低=9」を入れると、1から取り出します。Heapは全体を並べず、Rootが最小（最大）になる規則を保ちます。</p><p>サービスAがDB BとCache Cへつながるなら、A・B・CがVertex、接続がEdgeです。Edgeに遅延や費用を付けられます。</p>
    <h3>Heapで次を選び、Graphで行き先を表す</h3>
    <p>配達先の近さを優先したい場面を想像してください。配送地点と道路のつながりはGraphで表し、次に処理する候補を距離の小さい順に選びたいならHeapを使えます。Heapの先頭にあるのは、その時点で登録された候補のうち優先度が最も高いものです。</p>
    <p>道路を一本追加するとGraphのつながりが変わります。候補を追加するとHeapで次に選ばれる項目が変わることがあります。二つのデータ構造に、それぞれ何を保存するかを言い分けてみましょう。</p>`,
    internal:`${binaryTreeFigure("min-heap-title", "Min Heapでは根がいちばん小さい",
      "線でつながった親子を比べてください。Min Heapの規則は、下にある子の値が親以上であることです。",
      [1, [3, [7], [8]], [5, [9], [6]]],
      "根の1からどの枝へ下りても、値は小さくならないので、1が全体の最小値です。最下段の7と6のように、別の枝の値どうしは大小順に並ぶ必要がありません。")}${flow("Graphの関係",[["Service A","→ DB B（weight 4）"],["Service A","→ Cache C（weight 1）"],["Cache C","→ Service D（weight 2）"],["経路","A→C→D 合計3"]],"Edgeは向きや重みを持てます。")}<h3>Heapの操作</h3><p>末尾へ置いて親と比べ上へ動かすup-heap、Rootを置き換え下へ動かすdown-heapを行います。高さがlog nなので追加・削除はO(log n)です。</p><h3>Graphの探索</h3><p>BFSはQueueで近い層から、DFSはStackや再帰で深く進みます。<a class="inline-link" href="#graph-traversal">次章の探索図</a>で、同じグラフをたどる順番を比べられます。非負の重み付き最短経路にはDijkstra法などを選びます。</p>${callout("note","Treeとの違い","Treeは親が基本一つですが、Graphは複数のつながりや循環を持てます。")}`,
    web:`<p>Job Queueの優先度付け、タイムアウトが近いTaskの選択、ロードバランサー候補にPriority Queueが使えます。Graphはサービス依存関係、Webリンク、CDNやネットワーク経路を表します。</p><p>第3部のRoutingは重み付きGraphの経路選択として見られます。</p>`,
    lab:`${experiment("macOS / Java","cat > HeapGraph.java <<'EOF'\nimport java.util.*;\nclass HeapGraph{public static void main(String[]x){PriorityQueue<Integer>q=new PriorityQueue<>();q.add(5);q.add(1);q.add(3);System.out.println(q.poll());}}\nEOF\njavac HeapGraph.java && java HeapGraph","PriorityQueueを確認します。","pollが最小値1を返す点に注目します。","Heapが優先度順の取り出しに使えると分かります。")}${experiment("Linux / JavaScript","node -e \"const q=[5,1,3];q.sort((a,b)=>a-b);console.log(q.shift());const g={A:['B','C'],B:['D']};console.log(g)\"","簡易Priority QueueとGraphを動かします。","sort方式は毎回並べ直す点に注目します。","同じ結果でも構造で操作コストが変わります。")}`,
    misunderstandings:[["Heapは全要素が小さい順です。","Rootが最小（最大）という規則で、兄弟同士まで完全には並びません。"],["Graphの最短経路はいつもDFSです。","重みなしならBFS、重み付きならDijkstraなどが向きます。"]],
    questions:[["Min HeapのRootには何が置かれますか。","全要素の中で最小の値です。","全要素を昇順に並べた配列の先頭以外です。","挿入された時刻が最も古い要素です。","Min Heapは親が子以下になる規則なのでRootが最小です。全体の完全ソートや時刻順は別の条件です。"],["Priority Queueはどんな仕事に向きますか。","優先度の高い仕事や最小距離の候補を先に取り出します。","登録順を必ず守る通知配信だけです。","常に全要素をアルファベット順に並べるだけです。","Priority Queueは優先度で次の一件を選びます。登録順はFIFO、文字列順は比較Sortの主な規則です。"],["GraphのVertexとEdgeは何ですか。","Vertexは点、Edgeは点同士のつながりです。","Vertexは重み、Edgeは点の名前です。","VertexはQueue、EdgeはStackです。","駅をVertex、駅間の線をEdgeと考えると関係を表せます。重みやQueue/Stackは別の役割です。"],["BFSで未訪問の隣接Vertexを順に調べるとき、何を使いますか。","Queueを使い、近い層から取り出します。","Stackを使い、常に最深の道へ進みます。","Heapを使い、最小値だけを距離なしで選びます。","BFSは先に見つけた層を先に処理するFIFOです。最深優先はDFS、重み付き最短距離は通常Dijkstraなど別の選択です。"],["経路探索が遅いとき、辺の重みがあるかを確認する理由は何ですか。","重み付き最短経路ならDijkstraなど、単なる層探索とは別の方法が必要だからです。","重みがあってもBFSは必ず同じ最短距離を返すからです。","Graphなら必ずHeapを使えば正解になるからです。","BFSが最短を保証しやすいのは辺のコストが同じ場合です。重みがあればアルゴリズムと優先Queueの選択を見直します。"]],
    checks:["Heapのup/down-heap","Priority Queue","GraphのVertex/Edge","BFSとDFS","Routing・依存関係"], search:"Heap min heap max heap Priority Queue up-heap down-heap Graph Vertex Edge BFS DFS Dijkstra routing dependency"
  });

  const graphSearch = ch("graph-traversal", 7, "グラフ探索（DFS・BFS）", "グラフ探索：DFSとBFS", "同じ地図でも、近いところから調べるか、一つの枝を奥までたどるかで訪問順が変わります。図を一歩ずつ進めて、キューと再帰スタックの違いを確かめます。", {
    goals: ["隣接リストで頂点と辺を表す", "キューで幅優先探索、再帰で深さ優先探索を行う", "訪問済みの記録で循環を処理する", "辺の本数が最少の経路をBFSで復元する"],
    why: `<p>あるページから数回のリンクでたどり着ける範囲を知りたいときと、あるモジュールが間接的に依存する項目をすべて調べたいときとでは、探索の順序を変えると考えやすくなります。<a class="inline-link" href="#stack-queue">Stack / Queue</a>で学んだ取り出し順の違いが、そのままDFS・BFSの違いに現れます。</p>`,
    example: graphTraversal.figure + `
    <h3>探索の途中で次の一手を予想する</h3>
    <p>上の図をAから進めるとき、訪問済みの印と、まだ訪ねていない候補を別々に見ましょう。</p>
    <ul><li><strong>BFS</strong>では先に候補へ入れた頂点を先に取り出します。Aの近くから広がる順序を追えます。</li>
      <li><strong>DFS</strong>では枝を先へ進み、進めなくなったら分岐へ戻ります。後から記録した候補を先に扱うStackで実装できます。</li></ul>
    <p>矢印がすでに訪れたAへ戻る場面では、訪問済みの情報が再訪を防ぎます。同じ行き先が続けて現れたときに、どの時点で候補へ追加したかを見比べてください。</p>`,
    internal: `<h3>隣接リストと訪問済みの記録</h3>
      <p><code>A: ["B", "C"]</code>は、AからBとCへの辺を表します。DからAへ戻る辺があるため、訪問済みの記録が探索の終了に役立ちます。Aから始めた場合に調べられるのは、Aから到達できる頂点です。</p>
      <h3>BFSは同じ距離の頂点を順に調べる</h3>
      <p>キューの先頭から1件を取り出し、新しく見つけた頂点を末尾へ追加します。追加する時点で発見済みとして記録すると、CとDの両方からEに着いても、Eは一度だけキューに入ります。Aから辺1本で届くBとCを調べてから、辺2本で届くDとEへ進みます。</p>
      <p>発見時に直前の頂点も記録すると、Eから <code>E → C → A</code> と逆にたどれます。逆順に並べると、辺2本で届く <code>A → C → E</code> が得られます。</p>
      <h3>DFSは行き止まりから分岐点へ戻る</h3>
      <p>頂点に入ったら訪問済みにし、隣接先の一つに再帰で入ります。EまでたどったらD、B、Aへ順に戻り、Aに残っていたCを調べます。再帰呼び出しは、どの頂点の続きに戻るかをスタックに保持します。深いグラフでは明示的なスタックも選べます。</p>
      <p>隣接リストで到達できる頂点と辺を一度ずつ調べると、時間は <code>O(V + E)</code>、追加メモリは <code>O(V)</code> が上限です。ここで <code>V</code> は頂点数、<code>E</code> は辺の数です。<a class="inline-link" href="#big-o">Big O</a>の章で入力が増えたときの見積もりを扱います。</p>`,
    web: `<p>モジュールの依存関係をたどるときは、DFSで到達可能な範囲を調べられます。ページ間のリンクのように、辺ごとのコストが同じなら、BFSで最少のリンク数を調べられます。辺に異なる非負のコストが付く場合は、合計コストを最小にする方法としてDijkstra法が使えます。</p>`,
    lab: `${experiment("JavaScript / Node.js", graphTraversal.lab,
      "コードを graph-search.js に保存して node graph-search.js を実行し、図と同じ順番になるか確かめます。",
      "BFSでは配列の先頭位置を進めます。DFSでは再帰呼び出しとseenを使います。",
      "元のグラフではBFSはA → B → C → D → E、DFSはA → B → D → E → Cと表示されます。")}
      <p>AからEに直接向かう辺を、Aの隣接リストの末尾に追加してみましょう。実行前に、両方の訪問順と辺の本数が最少の経路を予想します。</p>
      <details class="lesson-details"><summary>演習の答えを表示</summary><p>Aの隣接リストの末尾にEを追加すると、BFSの訪問順は <code>A → B → C → E → D</code>、DFSの訪問順は <code>A → B → D → E → C</code> です。最短経路はAからEへの1本です。</p></details>`,
    misunderstandings: [
      ["DFSで最初にEへ着いた経路が、辺の本数が最少の経路です。", "この図のDFSはA → B → D → Eを先に見つけます。辺2本で着くA → C → Eは、BFSで求められます。"],
      ["BFSの訪問順をそのまま並べれば、目的地までの経路になります。", "訪問順は調べた順番です。この図でBからCへの辺はありません。経路を求めるには、目的地から発見元の頂点へ順にたどります。"]
    ],
    questions: [
      ["図のBFSでBの次に調べる頂点はどれですか。", "C", "D", "E", "CはBを調べる前からキューに入っています。Bで見つけたDはその後ろに並びます。"],
      ["DFSがAからBへ進んだ直後、次に入る頂点はどれですか。", "D", "C", "E", "DFSは今いるBの枝を奥へたどります。Bの隣接先はDです。"],
      ["重みのない図で、AからEへ辺の本数が最少の経路はどれですか。", "A → C → E", "A → B → D → E", "A → B → C → E", "A → C → Eは辺2本で届きます。BFSでEの発見元から逆にたどると復元できます。"],
      ["BFSでキューへの二重登録を防ぐには、いつ発見済みにしますか。", "キューへ追加するとき", "キューから取り出すとき", "すべての辺を調べ終えたとき", "追加時に記録すると、別の頂点から同じ行き先を見つけたときに追加を省けます。"]
    ],
    checks: ["キューと再帰スタックで訪問順が変わる理由", "循環があるグラフでの訪問済み管理", "辺の本数が最少の経路をBFSで求める方法"],
    search: "グラフ探索 深さ優先探索 幅優先探索 DFS BFS graph traversal 隣接リスト visited shortest path Dijkstra"
  });

  const searchSort = ch("search-sort", 8, "Search / Sort", "Search / Sort：見つけて並べる手順", "データが並んでいるか、比較回数がどれだけ増えるかで検索と整列の方法が変わります。", {
    goals:["線形探索と二分探索","二分探索とSorted","比較Sortの基本","Stable SortとORDER BY"],
    why:`<p>一覧からIDを探すとき、先頭から見る線形探索は分かりやすい一方、件数に比例します。並んでいれば中央と比べて半分を捨てる二分探索が使えます。</p><p>Sortがないと、順位や価格順を毎回自分で組み立てます。探索と整列の性質を知ると、どこで並べるかを設計できます。</p>`,
    example:`<p><code>[10,20,30,40,50,60,70]</code>から60を探します。線形探索は10から比べ、二分探索は40を見て右半分へ進みます。</p><p>Sortには隣接交換、分割と結合などがあります。件数が大きいほど比較回数の差が大きくなります。</p>
    <h3>候補を半分にしてよい根拠を確かめる</h3>
    <p>並んだ数から60を探す例では、中央の40を見て、40以下の側を候補から外せます。60より小さいことが順序によって保証されるからです。値をばらばらに並べた配列で中央が40でも、左側に60がある可能性は残ります。</p>
    <p>並んでいないデータを一回だけ探すなら、先頭から探す方が簡単です。同じデータを何度も探すなら、最初に並べる手間と、それぞれの検索で減る手間を比べられます。</p>`,
    internal:`${flow("Binary Search",[["範囲","10 20 30 40 50 60 70"],["中央","40と比較"],["右半分","50 60 70"],["中央","60を発見"]],"毎回候補を半分にします。")}${flow("Merge Sort",[["分割","半分に分ける"],["整列","小さい列"],["Merge","2列を比較"],["完成","一つの順序"]],"分割段数log nと各段のn件処理からO(n log n)になります。")}<h3>線形と二分</h3><p>線形探索は並び順を必要としません。二分探索はSortedな配列だけで使えます。</p><h3>Sortの安定性</h3><p>同じキーの元の順番を保つSortをStable Sortと呼びます。価格が同じ注文を受付順で保ちたい場合に役立ちます。</p>${callout("important","Sortの場所","DBのORDER BYで必要な順に取り出せるなら、全件をアプリへ送ってからSortする必要はありません。")}`,
    web:`<p>検索フォームの候補が少なければ線形探索でも十分ですが、大きな一覧をクライアントへ送る設計は避けます。サーバーやDBで条件を絞り、必要なページだけ返します。</p><p>JavaScriptの<code>sort</code>は数値比較関数を渡します。Javaの<code>Collections.sort</code>も比較処理のコストを考えます。</p>`,
    lab:`${experiment("macOS / Java","cat > SearchSort.java <<'EOF'\nimport java.util.*;\nclass SearchSort{public static void main(String[]x){int[]a={10,20,30,40,50,60,70};System.out.println(Arrays.binarySearch(a,60));List<Integer>b=new ArrayList<>(List.of(4,1,3,2));Collections.sort(b);System.out.println(b);}}\nEOF\njavac SearchSort.java && java SearchSort","Javaの二分探索とSortを動かします。","binarySearchの戻り値が添字である点を確認します。","並び順があると探索を短くできると分かります。")}${experiment("Linux / JavaScript","node -e \"const a=[10,20,30,40,50,60,70];console.log(a.indexOf(60));console.log([4,1,3,2].sort((x,y)=>x-y))\"","JavaScriptで探索と数値Sortを動かします。","比較関数がないと文字列順になる点に注目します。","データ型に合う比較規則が必要だと分かります。")}`,
    misunderstandings:[["二分探索はどんな配列でも使えます。","大小を判断するため、正しくSortedである必要があります。"],["Sortの比較回数だけで時間が分かります。","比較関数、コピー、メモリ、I/Oも影響します。"]],
    questions:[["線形探索は何をしますか。","先頭から条件に合う要素まで順に調べます。","中央だけを見て候補を半分へ絞ります。","Hash値から常に一回で位置を出します。","線形探索は並び順を前提にせず順番に比較します。中央分割は二分探索、Hash値利用はHashMapの考えです。"],["二分探索を使う前に必要な条件は何ですか。","対象が大小順に並んでいることです。","対象が毎回ランダムな順序で変わることです。","各要素が同じ値であることです。","中央との大小比較で左か右を捨てるため、全体がSortedである必要があります。ランダム順や同値だけではこの絞り込みになりません。"],["二分探索で候補は一回ごとにどうなりますか。","おおむね半分になります。","常に一要素だけ減ります。","全要素を複製して二倍になります。","中央を比べて片側を捨てるため候補数が半分ずつ減ります。常に一つだけ、または複製する処理ではありません。"],["同じキーの順番を保ちたいSortを何と呼びますか。","Stable Sortです。","Unstable Sortです。","Binary Searchです。","Stable Sortは同じ比較キーの元の順番を保ちます。Unstableは保証せず、Binary Searchは探索方法なのでSortの性質ではありません。"],["JavaScriptで[10,2].sort()が[10,2]のままになり得る理由は何ですか。","既定の比較が文字列順なので、数値比較関数を渡す必要があるためです。","二分探索が自動実行され、数値を捨てるためです。","Stable Sortは必ず数値を降順にするためです。","既定では数値10と2を文字列の順で比べます。比較関数(a,b)=>a-bを渡せば数値の昇順です。二分探索やStableの規則が原因ではありません。"]],
    checks:["線形・二分探索","Sortedの必要性","Sortの比較と分割","安定性","Web・DBでのSort場所"], search:"Search linear search binary search sorted Sort merge sort stable sort Java Collections JavaScript ORDER BY"
  });

  const bigO = ch("big-o", 9, "Big O", "Big O：入力が増えたときの伸び方", "Big Oは、データ件数が増えたとき仕事量がどう伸びるかを表すものさしです。O(1)、O(log n)、O(n)、O(n log n)、O(n²)を比べます。", {
    goals:["nを入力数として読む方法","五つの成長率","平均・最悪・定数の区別","Web APIやDBを成長率で考えること"],
    why:`<p>10件では速い処理が100万件では遅くなることがあります。入力が増えたときの伸び方を知らないと、本番で遅さを発見します。</p><p>Big Oは秒数を正確に予言するものではなく、入力の増加傾向を共有する言葉です。</p>`,
    example:`<p>配列の<code>a[100]</code>は件数に左右されにくくO(1)です。全件を調べる線形探索はO(n)、候補を半分にする二分探索はO(log n)です。</p><p>Merge SortはO(n log n)、二重ループで全ペアを比べる処理はO(n²)です。nが100から10000になると、n²はおよそ1万倍に増えます。</p>
    <h3>件数を2倍にしたときの仕事量</h3>
    <p>100件から200件へ増やし、各処理の1回あたりの費用が同じと仮定します。</p>
    <ul><li><strong>全件を一度ずつ見る処理</strong>は、100回から200回へ増えます。</li>
      <li><strong>全件をすべての件と比較する処理</strong>は、1万回から4万回へ増えます。</li>
      <li><strong>毎回半分に絞る処理</strong>は、入力が2倍になっても絞り込みが概ね1段増えるだけです。</li></ul>
    <p>Big Oは、入力をどのように増やすかと、比較などの何を数えたかを一緒に説明すると伝わります。実行時間はその上で、各操作の費用や環境の影響も受けます。</p>`,
    internal:`${diagram("成長率の比較",[["O(1)","一定回数"],["O(log n)","半分に絞る"],["O(n)","全件を1回"],["O(n log n)","効率的なSort"],["O(n²)","全ペア比較"]],"各行の左は増え方を表す記号、右はその増え方になる操作の例です。たとえば全件を一度ずつ見る処理は、件数nを2倍にすると見る回数も2倍になるためO(n)です。")}${flow("処理選択",[["目的","等価か範囲か"],["構造","Hash / Tree / Array"],["成長率","O(1)〜O(n²)"],["実測","負荷試験"]],"Big Oで候補を絞り、データ分布と計測で判断します。")}<h3>五つの見方</h3><p>O(1)は入力数に左右されにくい処理、O(log n)は半分ずつ絞る処理、O(n)は一周、O(n log n)は効率的な比較Sort、O(n²)は全組み合わせの比較です。</p><h3>省略の意味</h3><p><code>3n+10</code>は大きなnではnの項が支配的なのでO(n)です。小さなnでは定数や実装が速さを左右します。</p><h3>時間とメモリ</h3><p>全件を別配列へコピーすると時間O(n)と空間O(n)が必要です。Web APIではレスポンスサイズ、DBではIndex容量も一緒に考えます。</p>${callout("note","平均・最悪・償却","HashMapの平均O(1)でも衝突時は遅くなります。どの条件のOかを明記します。")}`,
    web:`<p>Web APIの全件検索O(n)、各行で外部APIを呼ぶO(n)回のI/O、ユーザー同士を全比較するO(n²)は、入力が増えると危険です。Pagination、HashMap、DB Index、Batch処理で仕事の形を変えます。</p><p>第3部のRoutingや第8部のB+Treeは、探索を短くする構造の例です。</p>`,
    lab:`${experiment("macOS / Java","cat > BigOBench.java <<'EOF'\nclass BigOBench{static long one(int n){long s=0;for(int i=0;i<n;i++)s+=i;return s;}static long two(int n){long s=0;for(int i=0;i<n;i++)for(int j=0;j<n;j++)s+=i+j;return s;}public static void main(String[]x){for(int n:new int[]{1000,2000,4000}){long t=System.nanoTime();one(n);System.out.println(n+\" linear \"+(System.nanoTime()-t));t=System.nanoTime();two(n);System.out.println(n+\" pairs \"+(System.nanoTime()-t));}}}\nEOF\njavac BigOBench.java && java BigOBench","O(n)とO(n²)の傾向を測ります。","JITや測定の揺れではなくnの増加を見ます。","二重ループの増え方が大きいと分かります。")}${experiment("Linux / JavaScript","node -e \"function one(n){let s=0;for(let i=0;i<n;i++)s+=i;return s}function two(n){let s=0;for(let i=0;i<n;i++)for(let j=0;j<n;j++)s+=i+j;return s}for(const n of [1000,2000,4000]){console.time(n+' one');one(n);console.timeEnd(n+' one');console.time(n+' two');two(n);console.timeEnd(n+' two')}\"","JavaScriptで一次と二次を比べます。","絶対時間でなくnへの増え方を読みます。","成長率を実測と結びつけられます。")}`,
    misunderstandings:[["O(1)なら必ず一番速いです。","定数やI/Oが大きく、小さなnでは別の処理が速いこともあります。"],["Big Oが同じなら同じ速さです。","実装、cache、比較関数、定数、平均/最悪条件が異なります。"]],
    questions:[["Big Oのnは何を表しますか。","入力データの件数や大きさです。","CPUの型番だけです。","常に実行時間をミリ秒で表す固定値です。","nを入力規模として、増えたとき仕事量がどう伸びるかを比べます。CPU型番や特定環境のミリ秒そのものではありません。"],["配列の添字アクセスの計算量の目安は何ですか。","O(1)です。","O(log n)で中央から絞ります。","O(n)で先頭から全要素を調べます。","連続配置なら添字から位置を計算でき、要素数に比例して探す必要がありません。二分探索や線形探索とは違う操作です。"],["二分探索の計算量の目安は何ですか。","O(log n)です。","O(1)で必ず一回だけです。","O(n²)で全ペアを比べます。","候補を半分ずつ減らすため、必要な比較回数はlog n程度です。一回固定でも全ペア比較でもありません。"],["全件を一度ずつ見る探索の計算量の目安は何ですか。","O(n)です。","O(log n)で半分ずつ捨てます。","O(n²)で全ての組を比較します。","入力の各要素を最大一回確認するのでnに比例します。半分捨てる二分探索や全ペア比較とは違います。"],["大きな入力で処理が遅いとき、Big Oだけで何でも断定できますか。","実装・定数・平均/最悪ケース・I/Oを実測と合わせて確認します。","O記法だけ見ればCPUやDBの待ち時間も不要です。","入力件数を測らず、常に最適化を先に行います。","Big Oは増え方の比較で、定数やCache、Network・DB I/Oも実時間に影響します。計測なしの断定や先行最適化は原因を取り逃がします。"], ["二重ループで全ペアを比べる処理の計算量の目安は何ですか。", "O(n²)です。", "O(1)で入力件数によらず一定です。", "O(log n)で候補を半分ずつ捨てます。", "外側と内側がそれぞれ最大n回動くため比較回数はおよそn×nになります。一定回数や二分探索の伸び方ではありません。"]],
    checks:["nと成長率","O(1)・O(log n)・O(n)","O(n log n)・O(n²)","平均・最悪・定数","Web・DB性能設計"], search:"Big O complexity O(1) O(log n) O(n) O(n log n) O(n^2) average worst amortized time space Web API DB index pagination"
  });

  const partChapters = [arrayList, stackQueue, hash, bst, btree, heapGraph, graphSearch, searchSort, bigO];
  globalThis.registerPart("part-6", partChapters);
})(); 
