globalThis.chapterVisuals = globalThis.chapterVisuals || {};

globalThis.chapterVisuals.execution = [
  {
    afterSection: 2,
    html: `<figure class="concept-figure" role="img" aria-label="curlコマンドが実行ファイルからCPUの開始命令へ進む流れ">
      <h3 class="visual-title">実行開始の一本道</h3>
      <div class="visual-sequence">
        <div class="visual-step"><span class="visual-chip">入力</span><strong>curl https://example.com</strong><small>シェルから実行要求</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">検査</span><strong>curl実行ファイル</strong><small>形式・権限・CPU</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">準備</span><strong>新しいProcess</strong><small>コード・データ・Stack</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">開始</span><strong>最初の命令</strong><small>CPUがProgram Counterから実行</small></div>
      </div>
      <figcaption class="visual-caption">保存ファイルが、検査と準備を経て実行中のProcessになります。</figcaption>
    </figure>`
  },
  {
    afterSection: 4,
    html: `<figure class="concept-figure" role="img" aria-label="実行ファイルのコードとデータが仮想メモリへ対応付けられ、Stackが用意される図">
      <h3 class="visual-title">実行ファイルと仮想メモリ</h3>
      <div class="visual-grid">
        <div class="visual-panel">
          <span class="visual-chip">SSD上のELF / Mach-O</span>
          <div class="visual-memory">
            <div class="visual-memory-cell"><strong>code</strong><small>命令・読み取り専用</small></div>
            <div class="visual-memory-cell"><strong>data</strong><small>初期値・変数</small></div>
            <div class="visual-memory-cell"><strong>library</strong><small>共有ライブラリ</small></div>
          </div>
        </div>
        <div class="visual-arrow" aria-hidden="true">→</div>
        <div class="visual-panel">
          <span class="visual-chip">Processの仮想メモリ</span>
          <div class="visual-memory">
            <div class="visual-memory-cell"><strong>0x1000</strong><small>code page・必要時に読込</small></div>
            <div class="visual-memory-cell"><strong>0x8000</strong><small>data page・書き込み可</small></div>
            <div class="visual-memory-cell"><strong>0xFFFF</strong><small>Stack・実行時に成長</small></div>
          </div>
        </div>
      </div>
      <figcaption class="visual-caption">左はSSD上の実行ファイル、右は実行中のProcessから見える仮想メモリです。右の番地は説明用です。たとえば命令を読む仮想ページはファイル内のcodeに対応し、Stackは実行時の作業用に別途用意されます。</figcaption>
    </figure>`
  }
];

globalThis.chapterVisuals.process = [
  {
    afterSection: 2,
    html: `<figure class="concept-figure" role="img" aria-label="同じ実行ファイルから生まれたPID 412とPID 587の別Process">
      <h3 class="visual-title">一つのファイルから二つのProcess</h3>
      <div class="visual-grid">
        <div class="visual-panel"><span class="visual-chip">保存されたプログラム</span><strong>server</strong><small>同じ実行ファイル</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-panel">
          <div class="visual-state"><strong>PID 412</strong><span>running</span><small>仮想メモリA・socket A</small></div>
          <div class="visual-state"><strong>PID 587</strong><span>waiting</span><small>仮想メモリB・socket B</small></div>
        </div>
      </div>
      <div class="visual-compare">
        <div><strong>分離</strong><span>仮想メモリ・PID・状態</span></div>
        <div><strong>競合しうる共有資源</strong><span>CPU・port・ディスク容量</span></div>
      </div>
      <figcaption class="visual-caption">Processごとに実行状態は分かれますが、マシンの資源は奪い合うことがあります。</figcaption>
    </figure>`
  },
  {
    afterSection: 4,
    html: `<figure class="concept-figure" role="img" aria-label="Processのnew ready running waiting I/O terminated状態の遷移">
      <h3 class="visual-title">Processの状態遷移</h3>
      <div class="visual-sequence">
        <div class="visual-step"><span class="visual-chip">PID 412</span><strong>new</strong><small>起動要求</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><strong>ready</strong><small>CPU待ち行列</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><strong>running</strong><small>CPUで実行</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><strong>waiting I/O</strong><small>socket・disk待ち</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><strong>ready</strong><small>I/O完了</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><strong>running</strong><small>CPUを再取得</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><strong>terminated</strong><small>終了コード</small></div>
      </div>
      <figcaption class="visual-caption">PID 412の一生から、I/O待ちを一度含む経路を示しています。I/Oが終わるとまずreadyに戻り、OSがCPUに割り当てた時点でrunningになります。</figcaption>
    </figure>`
  }
];

globalThis.chapterVisuals.thread = [
  {
    afterSection: 2,
    html: `<figure class="concept-figure" role="img" aria-label="一つのJVM ProcessでThread AとThread BがHeapを共有しStackを分けて持つ図">
      <h3 class="visual-title">Processの中の実行の流れ</h3>
      <div class="visual-grid">
        <div class="visual-panel"><span class="visual-chip">Process PID 900</span><div class="visual-memory"><div class="visual-memory-cell"><strong>Code</strong><small>共有</small></div><div class="visual-memory-cell"><strong>Heap</strong><small>Singleton・共有</small></div><div class="visual-memory-cell"><strong>Socket</strong><small>開いた資源・共有</small></div></div></div>
        <div class="visual-panel">
          <div class="visual-state"><strong>Thread A</strong><span>request A</span><small>Register・PC・Stack A</small></div>
          <div class="visual-state"><strong>Thread B</strong><span>request B</span><small>Register・PC・Stack B</small></div>
        </div>
      </div>
      <figcaption class="visual-caption">ThreadはStackと実行状態を分け、同じProcessのHeapやSocketを共有します。</figcaption>
    </figure>`
  },
  {
    afterSection: 4,
    html: `<figure class="concept-figure">
      <h3 class="visual-title" id="heap-race-title">共有Heapで起きる更新競合</h3>
      <table class="time-comparison" aria-labelledby="heap-race-title">
        <thead><tr><th scope="col">操作</th><th scope="col">Thread A</th><th scope="col">Thread B</th></tr></thead>
        <tbody>
          <tr><th scope="row">読み取り</th><td>0を読む</td><td>0を読む</td></tr>
          <tr><th scope="row">加算</th><td>0 + 1 = 1</td><td>0 + 1 = 1</td></tr>
          <tr><th scope="row">書き込み</th><td>1を書く</td><td>1を書く</td></tr>
        </tbody>
      </table>
      <div class="visual-compare"><div><strong>共有Heap</strong><span>count = 0 → 最終値1</span></div><div><strong>期待値</strong><span>2（更新が重ならなければ）</span></div></div>
      <figcaption class="visual-caption">両方のThreadが書き込み前にcountの値0を読むと、どちらも1を書き込みます。2回加算しても最終値は1です。</figcaption>
    </figure>`
  }
];

globalThis.chapterVisuals["context-switch"] = [
  {
    afterSection: 2,
    html: `<figure class="concept-figure" role="img" aria-label="CPUがThread Aの状態を保存してThread Bの状態を復元するContext Switch">
      <h3 class="visual-title">CPU担当の交代</h3>
      <div class="visual-sequence">
        <div class="visual-step"><span class="visual-chip">CPU</span><strong>Thread A 実行</strong><small>PC = 0x120・Register A</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><strong>Aを保存</strong><small>PC・Register・Stack位置</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><strong>Bを復元</strong><small>保存済みContext B</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">CPU</span><strong>Thread B 実行</strong><small>PC = 0x880・Register B</small></div>
      </div>
      <figcaption class="visual-caption">保存したPCとRegisterを戻すことで、Threadは止めた場所から再開できます。</figcaption>
    </figure>`
  },
  {
    afterSection: 4,
    html: `<figure class="concept-figure">
      <h3 class="visual-title" id="thread-io-title">I/O待ちの時間を別の仕事へ</h3>
      <table class="time-comparison" aria-labelledby="thread-io-title">
        <thead><tr><th scope="col">段階</th><th scope="col">Thread A</th><th scope="col">CPUコア</th></tr></thead>
        <tbody>
          <tr><th scope="row">I/O前</th><td data-visual-role="process">DBへ要求</td><td>Aを実行</td></tr>
          <tr><th scope="row">I/O中</th><td data-visual-role="wait">DBの応答待ち</td><td>Bを実行</td></tr>
          <tr><th scope="row">I/O後</th><td data-visual-role="process">応答を処理</td><td>Aを再開</td></tr>
        </tbody>
      </table>
      <figcaption class="visual-caption">OSはAがI/Oを待つ間、同じCPUコアでBを実行できます。I/Oが完了してAが実行可能になると、スケジューラがAを選んだ時点で処理を再開します。</figcaption>
    </figure>`
  }
];

globalThis.chapterVisuals["user-kernel-mode"] = [
  {
    afterSection: 2,
    html: `<figure class="concept-figure" role="img" aria-label="User ModeとKernel Modeの権限差とSystem Callの境界">
      <h3 class="visual-title">User ModeとKernel Mode</h3>
      <div class="visual-compare">
        <div><span class="visual-chip">User Mode</span><strong>アプリ・JVM</strong><span>足し算・割当済みメモリ</span><span>device直接操作は不可</span></div>
        <div><span class="visual-chip">Kernel Mode</span><strong>OSの中心</strong><span>file・socket・process管理</span><span>device・仮想メモリ管理</span></div>
      </div>
      <div class="visual-sequence"><div class="visual-step"><strong>アプリ</strong><small>read / writeを依頼</small></div><span class="visual-arrow" aria-hidden="true">→</span><div class="visual-step"><span class="visual-chip">System Call</span><strong>境界入口</strong><small>引数を検査</small></div><span class="visual-arrow" aria-hidden="true">→</span><div class="visual-step"><strong>Kernel</strong><small>権限資源を操作</small></div></div>
      <figcaption class="visual-caption">System Callが、アプリからKernelへ正式に依頼する通路です。</figcaption>
    </figure>`
  },
  {
    afterSection: 4,
    html: `<figure class="concept-figure" role="img" aria-label="HTTP送信がUser ModeのアプリからSystem Callを通ってKernelとNICへ進む図">
      <h3 class="visual-title">HTTP responseの行き先</h3>
      <div class="visual-sequence">
        <div class="visual-step"><span class="visual-chip">User Mode</span><strong>Webアプリ</strong><small>responseを作る</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">write()</span><strong>System Call</strong><small>socketへ書込依頼</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">Kernel Mode</span><strong>network処理</strong><small>packet・送信待ち</small></div>
        <span class="visual-arrow" aria-hidden="true">→</span>
        <div class="visual-step"><span class="visual-chip">NIC</span><strong>外部へ送信</strong><small>writeの復帰後に送る場合もある</small></div>
      </div>
      <div class="visual-compare"><div><strong>writeの戻り値</strong><span>Kernelが受け取ったbyte数。相手への到着保証ではない</span></div><div><strong>受信時</strong><span>NIC → Kernel socket → read()</span></div></div>
      <figcaption class="visual-caption">HTTPという一つの操作も、socketを扱うKernelの処理へつながります。writeが成功しても、相手への到着まで完了したとは限りません。</figcaption>
    </figure>`
  }
];
