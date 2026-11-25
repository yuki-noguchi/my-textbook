/* 第1部・第1〜5章の追加図解。本文の説明を、値の移動と状態変化で追えるようにしたものです。 */
globalThis.chapterVisuals = globalThis.chapterVisuals || {};

globalThis.chapterVisuals.cpu = [
  {
    afterSection: 2,
    html: `<figure class="concept-figure" role="img" aria-label="CPUがアドレス0x1000の命令を読み、足し算を実行して結果3を保存する流れ">
      <h3 class="visual-title">命令1つの旅：1 + 2 = 3</h3>
      <div class="visual-sequence">
        <div class="visual-step"><span class="visual-chip">PC = 0x1000</span><strong>FETCH</strong><small>メモリ[0x1000]から命令を読む</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">ADD R3, R1, R2</span><strong>DECODE</strong><small>R1とR2を足し、結果はR3へ</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">R1 = 1<br>R2 = 2</span><strong>EXECUTE</strong><small>演算器が 1 + 2</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">R3 = 3</span><strong>WRITE</strong><small>結果を保存、PC = 0x1004</small></div>
      </div>
      <figcaption class="visual-caption">番地 <code>0x1000</code> にある加算命令1つを処理する例です。<code>ADD R3, R1, R2</code>の先頭のR3が結果の保存先です。命令が4 byteごとに並ぶこの例では、次に読む位置は <code>0x1004</code> になります。</figcaption>
    </figure>`
  },
  {
    afterSection: 5,
    html: `<figure class="concept-figure">
      <h3 class="visual-title" id="cpu-io-title">CPU処理とI/O待ちの違い</h3>
      <table class="time-comparison" aria-labelledby="cpu-io-title">
        <thead><tr><th scope="col">経過時間</th><th scope="col">要求A</th><th scope="col">CPUコア</th></tr></thead>
        <tbody>
          <tr><th scope="row">0–2 ms</th><td data-visual-role="process">JSON解析</td><td>Aを実行</td></tr>
          <tr><th scope="row">2–8 ms</th><td rowspan="2" data-visual-role="wait">DB待ち</td><td>Bを実行</td></tr>
          <tr><th scope="row">8–32 ms</th><td>空き時間</td></tr>
          <tr><th scope="row">32–34 ms</th><td data-visual-role="process">応答を生成</td><td>Aを再開</td></tr>
        </tbody>
      </table>
      <figcaption class="visual-caption">リクエストAはDBの応答を30 ms待ちます。その間、同じCPUコアで別のリクエストBを処理できます。CPU使用率が低くても、I/O待ちが長いと応答は遅くなります。</figcaption>
    </figure>`
  }
];

globalThis.chapterVisuals.instructions = [
  {
    afterSection: 3,
    html: `<figure class="concept-figure" role="img" aria-label="Javaソースがbytecodeを経てCPUごとの機械語になる変換の流れ">
      <h3 class="visual-title">人のコードからCPUの命令へ</h3>
      <div class="visual-sequence">
        <div class="visual-step"><span class="visual-chip">if (age &gt;= 18)</span><strong>Javaソース</strong><small>人が読める条件</small></div>
        <span class="visual-arrow"><span class="visual-arrow-symbol" aria-hidden="true">→</span><span>javac</span></span>
        <div class="visual-step"><span class="visual-chip">iload_1<br>bipush 18<br>if_icmplt L1</span><strong>Bytecode</strong><small>JVM向けの小さな命令</small></div>
        <span class="visual-arrow"><span class="visual-arrow-symbol" aria-hidden="true">→</span><span>JIT</span></span>
        <div class="visual-step"><span class="visual-chip">CMP X0, #18<br>B.LT L1</span><strong>ARM64アセンブリ表現</strong><small>機械語を人向けの記号で表示</small></div>
      </div>
      <figcaption class="visual-caption">同じソースでも、実行するCPUに合わせて最後の命令の表現が変わります。</figcaption>
    </figure>`
  },
  {
    afterSection: 4,
    html: `<figure class="concept-figure" aria-labelledby="if-branch-title">
      <h3 class="visual-title" id="if-branch-title">if文は「比較して、次の場所を選ぶ」</h3>
      <p><code>if (age &gt;= 18)</code>でCPUが次の命令を選ぶ流れです。まず「比較」から矢印をたどり、次に17歳と18歳の行き先を比べてください。</p>
      <div class="visual-grid">
        <div class="visual-panel"><strong>比較</strong><p><code>age</code>を18と比べる</p></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-panel"><strong>分岐命令</strong><p>18未満なら、未成年向けの命令へ飛ぶ</p></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-panel"><strong>次の命令</strong><p>飛んだ先か、順番どおり次の位置から読む</p></div>
      </div>
      <div class="visual-compare">
        <div><strong>17歳なら飛ぶ</strong><p>18未満なので、番地 <code>0x2010</code> の未成年向け処理へ進みます。</p></div>
        <div><strong>18歳ならそのまま進む</strong><p>18未満に当てはまらないので、順番どおり番地 <code>0x2008</code> の成人向け処理へ進みます。</p></div>
      </div>
      <figcaption class="visual-caption">この番地は説明用です。プログラムカウンタ（PC）は、選ばれた命令の番地を指します。</figcaption>
    </figure>`
  }
];

globalThis.chapterVisuals.registers = [
  {
    afterSection: 3,
    html: `<figure class="concept-figure" role="img" aria-label="メモリのaとbをレジスタへ読み、加算して結果cをメモリへ戻すデータ移動">
      <h3 class="visual-title">a + b のデータ移動</h3>
      <div class="visual-sequence">
        <div class="visual-step"><span class="visual-chip">[0x4000] = 7<br>[0x4004] = 5</span><strong>メモリ</strong><small>a と b の値</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">R1 = 7<br>R2 = 5</span><strong>レジスタ</strong><small>CPU内部へ読み出し</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">R3 = R1 + R2<br>= 12</span><strong>演算器</strong><small>加算は内部で実行</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">[0x4008] = 12</span><strong>保存</strong><small>cへ書き戻し</small></div>
      </div>
      <figcaption class="visual-caption">レジスタは計算中の値をCPUのすぐそばに置く、少量で高速な作業場所です。</figcaption>
    </figure>`
  },
  {
    afterSection: 4,
    html: `<figure class="concept-figure" role="img" aria-label="プログラムカウンタとスタックポインタが命令位置と関数の枠を示す図">
      <h3 class="visual-title">特別なレジスタが「今」を示す</h3>
      <div class="visual-grid">
        <div class="visual-panel"><strong>PC</strong><span class="visual-chip">0x1000 → 0x1004</span><small>次に読む命令の位置</small></div>
        <div class="visual-panel"><strong>SP</strong><span class="visual-chip">0x7FF0 → 0x7FD0</span><small>関数呼び出しでStackを確保</small></div>
      </div>
      <div class="visual-memory">
        <div class="visual-memory-cell"><span>0x7FF0</span><b>mainの枠</b></div>
        <div class="visual-memory-cell"><span>0x7FD0 ← SP</span><b>validateの枠</b><small>引数 age = 20</small></div>
      </div>
      <figcaption class="visual-caption">PCは命令の現在地、SPは関数呼び出しで使うStackの現在地を示します。</figcaption>
    </figure>`
  }
];

globalThis.chapterVisuals.memory = [
  {
    afterSection: 3,
    html: `<figure class="concept-figure" role="img" aria-label="アドレス0x1000から4つのbyteを順に読み、文字列WEB!を組み立てるメモリ図">
      <h3 class="visual-title">アドレスは1 byteごとの番地</h3>
      <div class="visual-memory">
        <div class="visual-memory-cell"><span>0x1000</span><b>57</b><small>文字 W</small></div>
        <div class="visual-memory-cell"><span>0x1001</span><b>45</b><small>文字 E</small></div>
        <div class="visual-memory-cell"><span>0x1002</span><b>42</b><small>文字 B</small></div>
        <div class="visual-memory-cell"><span>0x1003</span><b>21</b><small>文字 !</small></div>
      </div>
      <div class="visual-sequence"><span class="visual-chip">4 byteを順に読む</span><span class="visual-arrow" aria-hidden="true">→</span><span class="visual-chip">57 45 42 21</span><span class="visual-arrow" aria-hidden="true">→</span><span class="visual-chip">文字列 "WEB!"</span></div>
      <figcaption class="visual-caption">各箱はメモリ上の1 byteです。上段は番地、中央は保存された値を16進数で表したもの、下段はその値を文字として解釈した結果です。番地を <code>0x1000</code> から順にたどると、文字列「WEB!」になります。</figcaption>
    </figure>`
  },
  {
    afterSection: 4,
    html: `<figure class="concept-figure" role="img" aria-label="同じ配列の読み出しでキャッシュヒットとキャッシュミスの時間が違う比較">
      <h3 class="visual-title">近いデータはキャッシュが助ける</h3>
      <div class="visual-compare">
        <div class="visual-panel"><strong>1回目：キャッシュミス</strong><span class="visual-chip">RAM → Cache → CPU</span><small>約100 ns<br>配列[0] = 10</small></div>
        <div class="visual-panel"><strong>2〜4回目：ヒット</strong><span class="visual-chip">Cache → CPU</span><small>約1 ns<br>配列[1..3] = 20, 30, 40</small></div>
      </div>
      <div class="visual-memory"><div class="visual-memory-cell"><span>Cache line</span><b>10 | 20 | 30 | 40</b><small>近くの値をまとめて保持</small></div></div>
      <figcaption class="visual-caption">下のCache lineは、RAMから一度に運ばれた配列の一部分です。最初の読み出しで10に加えて20、30、40もCacheに入ると、続く3回はCacheから読めます。図の時間は、この違いをイメージするための概算です。</figcaption>
    </figure>`
  }
];

globalThis.chapterVisuals["stack-heap"] = [
  {
    afterSection: 3,
    html: `<figure class="concept-figure" role="img" aria-label="createUserがvalidateを呼び、validateのStack frameが先に外れる積み重ね図">
      <h3 class="visual-title">関数呼び出しはStackに積む</h3>
      <div class="visual-sequence">
        <div class="visual-step"><span class="visual-chip">① createUser()</span><strong>push</strong><small>戻り先 main:12</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">② validate()</span><strong>push</strong><small>引数 name = "A"</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">② validate()</span><strong>pop</strong><small>結果 true</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">① createUser()</span><strong>再開</strong><small>validateの後の行へ</small></div>
      </div>
      <div class="visual-memory"><div class="visual-memory-cell"><span>Stack（上）</span><b>createUser frame</b><small>戻り先・name参照</small></div><div class="visual-memory-cell"><span>Stack（下）</span><b>main frame</b><small>呼び出し元</small></div></div>
      <figcaption class="visual-caption">最後に呼び出したvalidateが先に終わるため、StackはLIFO（後入れ先出し）になります。</figcaption>
    </figure>`
  },
  {
    afterSection: 5,
    html: `<figure class="concept-figure" role="img" aria-label="Stackの参照がHeap上のUserオブジェクトを指し、関数終了後も参照が残る図">
      <h3 class="visual-title">Stackの参照からHeapのオブジェクトへ</h3>
      <div class="visual-grid">
        <div class="visual-panel"><strong>createUser frame</strong><span class="visual-chip">userRef = 0x9000</span><small>Stackにあるのは場所</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-panel"><strong>Heap 0x9000</strong><span class="visual-chip">User { name: "A" }</span><small>newで作った本体</small></div>
      </div>
      <div class="visual-compare"><span>関数実行中：userRef → 0x9000（使用中）</span><span>戻り値として保持：別の参照 → 0x9000（GC対象外）</span></div>
      <figcaption class="visual-caption">関数の枠が消えても別の参照が残れば、HeapのUserオブジェクトは使い続けられます。</figcaption>
    </figure>`
  }
];
