(() => {
  "use strict";
  const { makeChapter, flowDiagram, callout, experiment } = globalThis.courseKit;
  const partTitle = "最終章 URLから画面表示まで";
  const total = 1;
  const diagram = (title, nodes, caption, options={}) => flowDiagram(title, nodes, caption, options);
  const q = (question, correct, wrong1, wrong2, explanation) => [question, correct, wrong1, wrong2, explanation];

  const overview = [
    ["URL", "行き先を分ける", "input", "ブラウザがURLから相手の名前と取得したいパスを取り出します。"],
    ["Network", "名前解決・接続", "process", "DNSでIPを調べ、経路を選び、TCPとTLSで通信の準備をします。"],
    ["Server", "要求を受け取る", "process", "アプリがHTTPの要求を読み、誰がどのデータを読めるかを確認します。"],
    ["Database", "対象の行を読む", "process", "MySQLがSQLを実行し、User 123の名前を返します。"],
    ["Response", "結果を返す", "input", "アプリが結果をHTMLかJSONにしてHTTPで返します。"],
    ["Browser", "画面に描く", "process", "ブラウザが受け取った結果をDOMに反映し、表示位置と見た目を決めます。"]
  ];
  const related = [
    ["URL", [["http-basics", "HTTPの基本"]]],
    ["Network", [["dns-curl", "DNS"], ["routing-nat", "Routing"], ["tcp-handshake", "TCP接続"], ["tls-certificates", "TLS"]]],
    ["Server", [["authentication-authorization", "認証と認可"], ["system-call-process-signal", "System Call"]]],
    ["Database", [["thread-connection-pool", "接続プール"], ["optimizer-explain", "EXPLAIN"], ["buffer-pool", "Buffer Pool"]]],
    ["Response", [["cookie-cache-etag", "HTTPキャッシュ"]]],
    ["Browser", [["html-parser-dom", "DOM"], ["layout-paint", "LayoutとPaint"]]]
  ];
  const relatedChapters = `<nav class="related-chapters" aria-label="6段階から戻れる関連章">
    <h3>6段階から関連章へ</h3>
    <dl>${related.map(([stage, links]) => `<div><dt>${stage}</dt><dd>${links
      .map(([id, label]) => `<a class="inline-link" href="#${id}">${label}</a>`).join("")}</dd></div>`).join("")}</dl>
  </nav>`;
  const recapSteps = [
    ["Browser", "入力"], ["URL", "分解"], ["DNS", "名前→IP"], ["Routing", "次Hop"],
    ["ARP", "next hopのMAC"], ["TCP", "接続"], ["TLS", "保護"], ["HTTP", "GET"],
    ["Proxy", "代理"], ["App", "受付"], ["Process", "実行箱"], ["Thread", "実行流"],
    ["Syscall", "Kernel依頼"], ["Pool", "DB接続"], ["MySQL", "受取"], ["Parser", "SQL理解"],
    ["Optimizer", "道選択"], ["B+Tree", "Index"], ["Buffer", "Page"], ["Row", "User行"],
    ["Tx/MVCC", "一貫性"], ["HTTP Resp", "JSON/HTML"], ["TCP", "復路"], ["Browser", "受取"],
    ["DOM", "木"], ["Style", "CSSOM"], ["Layout", "位置"], ["Paint", "画面"]
  ];
  const recap = `<details class="lesson-details"><summary>28段階を一覧で確認</summary>
    <ol class="recap-steps">${recapSteps.map(([label, detail]) => `<li><strong>${label}</strong> ${detail}</li>`).join("")}</ol>
  </details>`;

  const partChapters = [makeChapter({
    id: "final-url-to-screen",
    no: 1,
    total,
    partTitle,
    shortTitle: "URLから画面表示まで",
    title: "URLから画面表示まで：一つのRequestの全経路",
    deck: "ブラウザへ https://example.com/users/123 と入力し、MySQLのUser名が画面に出るまでを追います。Webの各部品が、前の部品から何を受け取り、何を返すかを一つの物語で復習します。"
  }, {
    reading: "約35分",
    goals: ["まず6段階で全体をつかみ、最後に28段階を説明すること", "Network・OS・DB・Browserの境界", "Cache Hit・timeout・Lock待ち・Connection Pool枯渇の分岐", "HTTPとTLS、writeと到着、RoutingとARPの正確な違い"],
    why: `<p>Web開発では「APIを呼ぶ」「DBから読む」と短く言います。しかし実際には、ブラウザ、DNS、Router、TCP、TLS、HTTP、Proxy、Application、OS、DB、再びHTTPとブラウザという多くの担当が順番に仕事をします。どこで遅れ、どこで失敗するかを知らなければ、ログの一行を正しく結び付けられません。</p><p>この章では、<code>https://example.com/users/123</code>を開き、MySQLの<code>users.id=123</code>の<code>name</code>が画面へ表示される例を扱います。全てのサイトが同じ構成ではありませんが、各層の責任と境界を追うための地図になります。前の第1部〜第12部で学んだ部品を、最後に一本へつなぎます。</p>${callout("important", "題材の前提", "example.comのIPや構成を決め打ちするのではなく、検証用のWeb構成を想定します。実際の公開サイトではCDNやProxy、DBの場所、HTTPのVersionが異なる場合があります。")}`,
    example: `<p>利用者がアドレス欄へ<code>https://example.com/users/123</code>と入力し、Enterを押します。画面の目的は「User ID 123の名前を表示すること」です。</p><p>まずBrowserはURLを分解します。<code>https</code>はTLSを使う通信方法、<code>example.com</code>は相手の名前、既定のportは443、<code>/users/123</code>は取得したい道です。Browserは名前からIPアドレスを調べ、Networkへ出て、ServerがSQLを実行し、ResponseのHTMLやJSONをDOMへ反映します。</p><p>ここで注意することがあります。DNSが返すのは通常IPアドレスで、User名ではありません。ARPは同じLAN上の次の相手（多くはRouter）のMACアドレスを調べる仕組みで、世界中のServerのMACを調べるものではありません。</p>
    <h3>一つの遅い画面を三つに分けて調べる</h3>
    <p>利用者名の画面が表示されるまでが遅いとします。</p>
    <ol><li><strong>要求を送る準備</strong>では、名前解決や接続が終わるまでにかかった時間を見ます。</li>
      <li><strong>応答が来るまで</strong>では、最初のbyteを受け取るまでの時間を確認します。サーバー側のログや計測があれば、APIやDBの処理と照らし合わせます。</li>
      <li><strong>応答が来てから</strong>は、必要な資源の取得やJavaScript、Layout・Paintのどれが表示を待たせたかを追います。</li></ol>
    <p>たとえば応答がすぐ届いたのに画面が遅ければ、その後のブラウザの処理を見ます。反対に応答の到着が遅く、描画はすぐなら、接続やサーバー側を先に確認できます。どの観測を根拠に次の確認先を選んだかまで説明できれば、この教材で学んだ層の違いを使えています。</p>`,
    internal: `${diagram("最初に見る6段階", overview, "User 123の名前が画面に出るまでの流れです。「次へ」で1段階ずつ確認できます。", { animate: true })}${relatedChapters}
      <h3>ネットワーク往路</h3><p><strong>1 Browser → 2 URL：</strong>入力の処理主体はBrowserです。URLからscheme、host、port、pathを取り出し、HTTPSの443番portへ接続する準備をします。出力は「example.comの443番へ、/users/123をGETする」という接続情報です。</p><p><strong>3 DNS：</strong>BrowserやOSのResolverがCacheを確認し、なければDNS Serverへ尋ねます。入力は<code>example.com</code>、出力は一つ以上のIPアドレスです。DNS Cache Hitなら通信を減らせますが、古い値の有効期間（TTL）内であることが条件です。DNSが遅い、失敗する、IPが複数ある、という分岐もあります。</p><p><strong>4 Routing → 5 ARP：</strong>Hostはまず宛先IPをRouting Tableへ照らし、同じLANの相手へ直接送るか、Default Gatewayへ渡すかを決めます。次にARPで、その同じリンク上の次HopのMACを調べます。遠いexample.comのMACをARPで探すわけではありません。Routerを越えるたび、次Hopの選択とリンク上の配送を繰り返します。</p><p><strong>6 TCP：</strong>ClientとServer（またはProxy）のSocketを、SYN・SYN/ACK・ACKで接続します。入力は宛先IPとport、出力は順序と再送を扱えるTCP接続です。Packet lossなら再送で遅れ、timeoutなら接続失敗です。TCPの<code>write()</code>が成功しても、相手のApplicationが受け取った、または画面へ届いた保証ではありません。Kernelの送信Bufferへ受け渡せたことに近い結果です。</p><p><strong>7 TLS：</strong>TCPの上でTLS handshakeを行います。Server CertificateのHostname・期限・署名を検証し、共有秘密を作ります。TLSは暗号化・改ざん検出・相手確認を担当しますが、HTTPのGETや200の意味は決めません。</p><p><strong>8 HTTP：</strong>Browserは<code>GET /users/123 HTTP/2</code>などのRequestをTLSで包んで送ります。HeaderにはHost、Cookie、Acceptなどが入り、通常GETのBodyはありません。HTTP/2ならFrameとStream、HTTP/1.1ならテキスト形式の交換になります。</p>
      <h3>中継からApplication</h3><p><strong>9 Reverse Proxy：</strong>CDNやReverse ProxyがTLSを終端する構成なら、ここでCertificate検証済みのHTTPを受けます。CacheにUser 123の公開Responseがあれば、元Serverへ進まずCache Hitとして返せます。個人データを共有Cacheへ置くと別人へ返す事故になるため、Cache Keyと<code>private</code>の判断が必要です。</p><p><strong>10 Application：</strong>ProxyはRequestを内部のApplicationへroutingします。Host、path、CookieやAuthorizationを渡し、Applicationは<code>/users/:id</code>に合うHandlerを選びます。ここでAuthentication（誰か）とAuthorization（123を読んでよいか）を確認します。失敗なら401/403を返し、DBへ進みません。</p><p><strong>11 Process → 12 Thread：</strong>ApplicationはOS上のProcessとして動き、その中のThreadがRequest処理を進めます。Processはメモリや資源を入れる箱、Threadは命令を進める流れです。DBや別APIを待つ間にThreadが増えすぎると、QueueとContext Switchが増えます。</p><p><strong>13 System Call：</strong>ThreadがSocketからRequestを読み、Responseを書き、DB接続を作るとき、最終的にKernelのSystem Callを使います。User ModeのApplicationはNICやDiskを直接操作せず、Kernelへ依頼します。</p><p><strong>14 Connection Pool：</strong>Applicationは毎回TCP接続を作らず、MySQL接続をPoolから借ります。Poolに空きがあれば一つ借りてSQLを実行し、終われば返します。全接続が使用中ならPool待ちです。Requestが多すぎるとConnection Pool枯渇となり、DBが空いていてもApplicationは待ち、timeoutになります。</p>
      <h3>DB内部</h3><p><strong>15 MySQL：</strong>MySQL/InnoDBがPoolから来たSQLを受けます。入力は<code>SELECT name FROM users WHERE id = 123</code>という命令とParameter、出力は一致するRowです。</p><p><strong>16 Query Parser：</strong>ParserがSELECT、列name、表users、条件id=123を読み、SQLの構造を作ります。値をSQL文字列へ連結せずPrepared Statementにすれば、入力がSQL命令へ混ざりにくくなります。</p><p><strong>17 Optimizer：</strong>Optimizerは統計（Cardinalityなど）と候補Indexを見て、全表走査かIndexを使うか選びます。選択したExecution Planは「idのIndexから一行を探す」です。統計が古い、条件が広いなどで全表走査が選ばれることもあります。</p><p><strong>18 B+Tree Index：</strong>Primary Keyの<code>id=123</code>をB+TreeのRootからInternal Page、Leaf Pageへたどります。第6部のB+Treeの「木を降りる」考えに、RDBのPage I/OとClustered Indexが加わります。</p><p><strong>19 Buffer Pool：</strong>必要なIndex PageやData PageがInnoDB Buffer PoolにあればCache Hitでメモリから読めます。なければDiskからPageを読みます。SELECTは毎回Diskへ行くわけではありません。Buffer Poolが小さい、初回、別のPageに追い出された場合はCache Missとなり、Disk待ちが増えます。</p><p><strong>20 Row：</strong>Clustered IndexのLeafから、<code>id=123</code>のRowを得ます。SELECT列がIndex内だけならCovering Indexで本体へ戻らない場合もあります。ここではname列を本体Rowから取り出し、値をApplicationへ返します。</p><p><strong>21 Transaction / MVCC：</strong>読み取りはTransactionとIsolationの規則に従います。別Transactionが同じUser行を変更中でも、Snapshot Readは見える時点のVersionを選び、未Commitの値をそのまま見せないことがあります。UPDATEや<code>FOR UPDATE</code>ならLock待ちが起き、長いTransactionやDeadlockで遅れることがあります。第8部の「COMMIT前データはBuffer Pool上の変更PageとUndo情報にある」という説明へ戻ります。</p>
      <h3>復路と描画</h3><p><strong>22 HTTP Response：</strong>ApplicationはConnection Poolへ接続を返し、JSONなら<code>HTTP/1.1 200 OK</code>、<code>Content-Type: application/json</code>と<code>{"id":123,"name":"太郎"}</code>をResponse Bodyへ入れます。Proxyは必要なら圧縮やCache Headerを加えます。DBのRowそのものが直接Browserへ届くのではなく、ApplicationがHTTP表現へ変換します。</p><p><strong>23 TCP：</strong>ProxyやServerのSocketへ<code>write()</code>すると、KernelがTCP Segmentへ分けて送ります。write成功は相手のProcess到着・HTTP処理・Browser表示を保証しません。ACK、TLS、HTTP Parser、Browser処理を経て初めて利用者へ届きます。損失なら再送、一定時間返事がなければHTTP timeoutなどになります。</p><p><strong>24 Browser：</strong>TLSを復号し、HTTP StatusとHeaderを確認してBodyを受け取ります。FetchのPromiseが解決し、JSONをJavaScriptが読みます。Statusが404でもNetwork交換が成功する場合があるため、<code>response.ok</code>とStatusを確認します。</p><p><strong>25 DOM → 26 Style/CSSOM：</strong>JavaScriptが<code>document.querySelector(".user-name").textContent = data.name</code>を実行し、DOMのText Nodeを変えます。HTML Parserが作ったDOMと、CSS Parserが作ったCSSOMを合わせ、最終Styleを計算します。</p><p><strong>27 Layout：</strong>Browserは文字の幅、親の幅、Font、Marginなどからx・y・width・heightを計算します。名前が長ければ折り返し、後ろの要素も動くことがあります。</p><p><strong>28 Paint：</strong>背景、文字、画像、境界線をPaintし、必要ならLayerをCompositeして画面へ出します。ここでようやく、MySQLの<code>name</code>がピクセルとして見えます。第5部のDOM→CSSOM→Layout→Paintの流れです。</p>
      <h3>分岐する待ち時間</h3><p>DNS Cache Hitなら3の外部問い合わせを省けます。Reverse ProxyのCache Hitなら10以降のApplication・DBを省けます。反対にDNS timeout、TCP接続timeout、TLS検証失敗、Proxy timeout、Connection Pool枯渇、DBのPage I/O、Lock待ち、Applicationの長いTaskなど、同じ「遅い」でも原因の層が異なります。測定では各区間の開始・終了時刻を分けます。</p>${diagram("ネットワーク往路・復路", [["Browser", "URL入力"], ["DNS Resolver", "IPを得る"], ["Host / Router", "ARPはnext hop"], ["TCP Socket", "往路→"], ["TLS", "暗号化"], ["HTTP Proxy", "Cache / routing"], ["Application", "JSON化"], ["TCP Socket", "←復路"], ["TLS", "復号"], ["Browser", "Body受領"]], "同じTCP接続を往路と復路で使います。ARPは各リンクの次の相手を決め、TLSはHTTPの内容を守ります。")}${diagram("ApplicationからInnoDB", [["HTTP Request", "id=123"], ["Handler", "認証・認可"], ["System Call", "Socket / DB"], ["Connection Pool", "接続を借りる"], ["MySQL Parser", "SQLの構造"], ["Optimizer", "Plan"], ["B+Tree", "Leafへ降りる"], ["Buffer Pool", "Hit / Miss"], ["Row", "name=太郎"], ["MVCC", "見えるVersion"], ["HTTP Response", "JSON"]], "ApplicationはDBの内部PageやVersionをそのまま返さず、認可後のRowをAPIの表現へ変換します。")}${diagram("Browserの描画段階", [["HTTP Body", "HTML / JSON"], ["HTML Parser", "DOM"], ["JavaScript", "Fetch結果"], ["CSS Parser", "CSSOM"], ["Style", "最終値"], ["Render Tree", "描画対象"], ["Layout", "位置・サイズ"], ["Paint", "文字・色"], ["Composite", "画面"]], "ResponseのBodyはDOMやJavaScriptの入力になり、Style・Layout・Paintを通って画面へ変わります。")}${recap}`,
    web: `<p>実務ではこの全経路を一人で実装するのではなく、各境界にログとメトリクスを置きます。BrowserのNavigation Timing、ProxyのRequest ID、ApplicationのTrace ID、DBのQuery時間とEXPLAINを同じIDで結ぶと、「画面の遅さ」がDNSなのか、Pool待ちなのか、DBのPage・Lockなのかを分けられます。</p><p>設計時には、Cacheをどこで使うか、Session Cookieをどこで検証するか、TLSをどこで終端するか、Connection Poolの上限とDBの最大接続数をどう合わせるかを決めます。第12部のTimeout・Retry・冪等性も、途中で失敗したRequestを安全に扱うために必要です。</p><p>一つのURLの物語は、ブラウザだけでも、DBだけでも完結しません。Network、OS、DB、Browserの境界で入力と出力を追うことが、Webエンジニアのデバッグと設計の基本になります。</p>`,
    lab: `${experiment("macOS / Linux（curl）", `curl -v --connect-timeout 5 --max-time 15 https://example.com/users/123 -o /tmp/final-response.txt\nhead -20 /tmp/final-response.txt`, "TLS handshake、HTTP Request/Response、StatusとHeaderの往復を観察します。", "Connected、TLS certificate、ALPN、GET、HTTP status、Content-Type、time_totalに注目します。", "URLからTCP・TLS・HTTPを経てResponse Bodyが届く順番を確認できます。公開サイトのBodyは題材のUser 123とは限りません。")}${experiment("macOS / Linux（DNS・証明書）", `dig +noall +answer example.com\nopenssl s_client -connect example.com:443 -servername example.com </dev/null`, "DNSの名前解決とTLS証明書を別々に観察します。", "digのA/AAAAとTTL、証明書のsubject・issuer・Verify return codeに注目します。", "DNSは名前からIP、TLSは証明書と暗号化通路を担当し、Userデータを直接返すものではないと分かります。")}${experiment("Chrome DevTools / macOS・Linux", `1. DevToolsのNetworkを開く\n2. Preserve logを有効にする\n3. https://example.com/users/123 を開く\n4. DocumentのTiming、Headers、Previewを確認\n5. Performanceで長いTaskとRenderingを確認`, "Browser側のRequest、待ち時間、Response、描画のつながりを確認します。", "DNS、Initial connection、SSL、Waiting、Content Download、Status、Initiatorに注目します。", "ブラウザがNetworkを待ち、ResponseをDOM・JavaScript・描画へ渡す流れを画面で追えます。")}${experiment("MySQL 検証DB（macOS / Linux）", `mysql -uroot -p lesson_rdb -e "EXPLAIN SELECT name FROM users WHERE id=123;"\nmysql -uroot -p lesson_rdb -e "SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read%';"`, "同じ題材のDB側で、Index選択とBuffer Poolカウンタを確認します。", "EXPLAINのkey・rows・type、Buffer Poolのread_requestsとreadsに注目します。", "Applicationの一行のSELECTにもParser・Optimizer・B+Tree・Page Cacheが関係すると分かります。")}${callout("warning", "安全な観察", "公開サイトへ負荷をかけたり、他人のIDを推測したりしないでください。DB実験は自分のlesson_rdbだけで実行し、/tmpのResponseファイルに秘密情報を保存しないでください。")}`,
    misunderstandings: [
      ["ARPでexample.comのServerのMACアドレスを調べます。", "ARPは同じリンク上の次の相手を調べます。遠い宛先なら、通常はDefault GatewayのMACを調べ、Routerが次のリンクへ転送します。"],
      ["TCPのwriteが成功すれば、Browserの画面まで届いています。", "write成功は多くの場合、OSの送信Bufferへ渡せた結果です。相手のProcess受信、HTTP処理、TLS復号、Browser描画はまだ残っています。"],
      ["SELECTを実行するたび、必ずDiskからRowを読みます。", "必要なPageがInnoDB Buffer Poolにあればメモリから読みます。Cache Missや追い出し時だけDisk I/Oが必要になります。"],
      ["COMMIT前の値はDBのどこにもありません。", "変更PageはBuffer Poolなどにあり、Undoは古いVersionへ戻る手掛かりになります。ただし未Commit値を確定データとして別Transactionへ見せるとは限りません。"],
      ["HTTPSが使われていれば、ServerのDB接続も自動的に暗号化されます。", "HTTPSはTLS終端までの区間を守ります。終端後のProxy・Application・DB間を守る方法は別に設計します。"],
      ["HTTP 200ならDBから必ず最新のUser名を読んだ結果です。", "ProxyやBrowserのCacheから返る場合、別のTransactionのSnapshotを見る場合、Applicationが別の値を返す場合があります。Statusだけではデータの鮮度は決まりません。"]
    ],
    questions: [
      q("URLのhttps、example.com、/users/123はそれぞれ何を示しますか。", "httpsは通信方法、example.comはHost名、/users/123は取得したいPathです。既定portは443です。", "httpsはHost名、example.comはPath、/users/123は暗号方式を示します。", "httpsはDB名、example.comは利用者名、/users/123はIPアドレスを示します。", "URLではscheme、Host、Pathが別の役割を持ちます。ほかの選択肢は名前と役割を入れ替えており、接続先や取得対象を決められません。"),
      q("DNSの主な出力は何ですか。", "Host名に対応するIPアドレスです。", "同じLAN上の次Hopに対応するMACアドレスです。", "HTTP Responseに入るHTMLやJSONです。", "DNSは名前からIPアドレスを得る担当です。MACアドレスはARP、HTMLやJSONはHTTPとApplicationが扱います。"),
      q("ARPが調べる相手は誰ですか。", "同じリンク上で次に送る相手のMACアドレスで、遠いServerのMACではありません。", "DNSが返した遠隔ServerのMACアドレスを、Internet全体から探します。", "TCP接続を受けるApplicationのProcess IDを調べます。", "ARPの範囲は同じリンク内です。遠い宛先ならDefault GatewayのMACを調べます。遠隔ServerのMACやProcess IDはARPの対象ではありません。"),
      q("TLSとHTTPの担当の違いは何ですか。", "TLSは暗号化・改ざん検出・相手確認、HTTPはMethod・Status・Header・Bodyの意味を担当します。", "TLSがMethodとStatusを決め、HTTPが証明書を検証します。", "TLSもHTTPも、DBのRowを検索する同じ仕組みです。", "TLSは通信を守る層、HTTPはWebのメッセージを表す層です。役割を逆にしたり、DB検索と同一視したりすると境界を追えません。"),
      q("Connection Poolが枯渇すると何が起きますか。", "ApplicationがMySQL接続を借りられずPool待ちになり、DBが空いていてもtimeoutになることがあります。", "空き接続がなくても、全Requestが新しい接続を無制限に作ります。", "BrowserがMySQLへ直接接続し、Applicationを飛び越えます。", "Poolは同時に貸せる接続数を制限します。空きがなければ待ちます。無制限な接続作成やBrowserからDBへの直接接続にはなりません。"),
      q("IndexのB+TreeからUser Rowへ進む大まかな順番は何ですか。", "Root・Internal・Leaf Pageをたどり、必要なら主キーでClustered Indexの本体Rowへ進みます。", "LeafからRootへ逆向きに進み、最後にSQL ParserでRowを作ります。", "Buffer Poolを使わず、Rootから必ずDiskの全Pageを順番に読みます。", "B+Tree検索は比較しながらRootからLeafへ降ります。Secondary IndexならLeafの主キーから本体を探します。逆向きの探索や全Pageの順読みではありません。"),
      q("SELECTが毎回Diskへ行くわけではない理由は何ですか。", "InnoDB Buffer Poolに必要なPageがあれば、メモリから再利用できるからです。", "SELECTはPageを使わず、CPUレジスタだけで全Rowを保存するからです。", "SQL ParserがDisk上のRowをHTMLへ変えてBrowserへ直接送るからです。", "InnoDBは読み込んだPageをBuffer Poolへ置きます。必要なPageがあればメモリから読めます。レジスタだけでの保存やDBからBrowserへの直接送信ではありません。"),
      q("COMMIT前の新しい値と古い値を支える仕組みは何ですか。", "変更PageはBuffer Poolなどにあり、Undoが古いVersionへの手掛かりになり、MVCCがSnapshotに合う値を選びます。", "新旧の値はDNS Cacheに保存され、TTLでTransactionを切り替えます。", "COMMIT前は新しい値が一切存在せず、UndoもMVCCも使いません。", "更新はCOMMIT前にもメモリ上のPageへ反映され、Undoが古いVersionを再構成する手掛かりになります。DNS CacheはDBのVersion管理とは無関係です。"),
      q("TCPのwrite成功だけでは、なぜ画面表示を保証しませんか。", "送信Bufferへの受け渡し後に、再送・相手のHTTP処理・TLS復号・BrowserのDOM/Layout/Paintが残っているからです。", "write成功はBrowserのPaint完了をOSが確認したという意味だからです。", "write成功の後はNetworkを通らず、相手のメモリへRowが直接書かれるからです。", "writeの成功は通常、送信側Kernelがデータを受け取った段階です。相手への配送、上位Protocolの処理、Browser描画は別の段階なので、まだ失敗や待ちが起こり得ます。"),
      q("MySQLのnameが画面の文字になる最後の段階は何ですか。", "ResponseをBrowserが受け、DOMのText Nodeを更新し、LayoutとPaintでピクセルへ描く段階です。", "MySQLのLeaf Pageが直接ディスプレイへ文字を描く段階です。", "DNSがnameをIPアドレスへ変換し、そのIPを文字として表示する段階です。", "DBの値はApplicationとHTTPを経てBrowserへ届きます。最終的にDOMへ反映し、LayoutとPaintを通して画面になります。MySQLやDNSが直接描画するわけではありません。")
    ],
    checks: ["URLからDNS・Routing・ARP・TCP・TLS・HTTPへ進む順番", "Reverse Proxy・Application・Process・Thread・System Callの境界", "Connection PoolからMySQL Parser・Optimizer・B+Tree・Buffer Pool・Rowへの流れ", "Transaction・MVCC・Lock待ちの見え方", "HTTP ResponseがTCPを戻りBrowserへ届く仕組み", "HTMLとJSONで異なるDOMへの道", "ARPが同一リンクのnext hopを扱うこと", "write成功と相手到着・画面表示の違い", "Cache HitとCache Missの違い", "timeout・Pool枯渇・DB I/O・Lock待ちの切り分け", "各部のログとTrace IDを一本につなぐ考え方"],
    search: "final URL browser example.com users 123 DNS ARP next hop routing TCP TLS HTTP Reverse Proxy Application Process Thread System Call Connection Pool MySQL Query Parser Optimizer B+Tree Index Buffer Pool Row Transaction MVCC Lock HTTP Response DOM CSSOM Layout Paint timeout cache hit connection pool exhaustion write success arrival"
  })];

  const combinedBrowserDiagram = diagram("Browserの描画段階", [["HTTP Body", "HTML / JSON"], ["HTML Parser", "DOM"], ["JavaScript", "Fetch結果"], ["CSS Parser", "CSSOM"], ["Style", "最終値"], ["Render Tree", "描画対象"], ["Layout", "位置・サイズ"], ["Paint", "文字・色"], ["Composite", "画面"]], "ResponseのBodyはDOMやJavaScriptの入力になり、Style・Layout・Paintを通って画面へ変わります。");
  const splitBrowserDiagrams = diagram("HTML Responseの道", [["HTML Body", "文字列を受け取る", "input"], ["HTML Parser", "タグを読む", "process"], ["DOM", "文書の木", "store"], ["CSSOM / Style", "見た目を決める", "process"], ["Layout / Paint", "位置を計算して描く", "store"]], "HTMLはHTML ParserからDOMへ進みます。", {animate:true}) + diagram("JSON Responseの道", [["Fetch", "JSON Bodyを受け取る", "input"], ["JSON.parse", "JavaScriptの値にする", "process"], ["JavaScript", "必要なDOMを更新", "process"], ["CSSOM / Style", "見た目を決める", "process"], ["Layout / Paint", "位置を計算して描く", "store"]], "JSONは自動ではDOMになりません。JavaScriptが値を読み、DOMを更新してから描画へ進みます。", {animate:true});

  // 表現が混同されやすい境界を、表示用HTMLでも明示します。
  partChapters[0].html = partChapters[0].html
    .replace("Browserは<code>GET /users/123 HTTP/2</code>などのRequestをTLSで包んで送ります。HeaderにはHost、Cookie、Acceptなどが入り、通常GETのBodyはありません。HTTP/2ならFrameとStream、HTTP/1.1ならテキスト形式の交換になります。", "BrowserはGETとPathなどをHTTP/2の疑似Headerへ入れたRequest FrameとしてTLSで包んで送ります。HTTP/2はHTTP/1.1のようなテキストのRequest Lineではなく、FrameとStreamを使います。HTTP/1.1では<code>GET /users/123 HTTP/1.1</code>のようなテキスト形式で交換します。")
    .replace("別Transactionが同じUser行を変更中でも、Snapshot Readは見える時点のVersionを選び、未Commitの値をそのまま見せないことがあります。", "InnoDBの通常のIsolation Levelでは、別Transactionが同じUser行を変更中でも、Snapshot Readは見える時点のVersionを選び、未Commitの値をそのまま見せません。READ UNCOMMITTEDなど設定によって挙動は異なります。")
    .replace("一定時間返事がなければHTTP timeoutなどになります。", "一定時間返事がなければClientやProxyが設定したHTTP Request Timeoutなどになります。")
    .replace("FetchのPromiseが解決し、JSONをJavaScriptが読みます。", "HTML ResponseならHTML ParserがDOMを作り、JSON ResponseならFetchのPromise解決後にJavaScriptがJSONを読みます。")
    .replace("HTML Parserが作ったDOMと、CSS Parserが作ったCSSOMを合わせ、最終Styleを計算します。", "JSONの場合はJavaScriptが既存DOMを更新し、HTMLの場合はHTML Parserが作ったDOMを使います。CSS Parserが作ったCSSOMとDOMを合わせ、最終Styleを計算します。")
    .replace(combinedBrowserDiagram, splitBrowserDiagrams);
  globalThis.registerPart("final", partChapters);
})();
