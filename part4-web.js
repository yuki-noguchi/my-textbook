(() => {
  "use strict";
  const { makeChapter, flowDiagram, callout, experiment } = globalThis.courseKit;
  const registerPart = globalThis.registerPart;
  const partTitle = "第4部 Web / HTTP / TLS";
  const total = 7;
  const diagram = (title, nodes, caption) => flowDiagram(title, nodes, caption);
  const chapter = (data, content) => makeChapter({ ...data, partTitle, total }, content);

  const partChapters = [
    chapter({
      id: "http-basics", no: 1, shortTitle: "HTTPの基本", title: "HTTP：Webで情報を運ぶ約束", deck: "URLを入力してから画面に答えが届くまでには、RequestとResponseの交換があります。HTTPの部品を一つずつ分け、Web通信を読めるようにします。"
    }, {
      reading: "約22分",
      goals: ["URLが相手と資源を指す仕組み", "HTTP RequestとResponseの部品", "Method・Status・Header・Bodyの役割", "TCP/Socketの上にHTTPが乗る理由"],
      why: `<p>Webエンジニアが「404になった」「Headerが足りない」と話すとき、見ているのはHTTPという通信の約束です。約束がなければ、ブラウザとサーバーは「何を求め、結果が成功したか」を共通の方法で伝えられません。</p><p>第3部で見たTCPは、順番どおりにバイト列を届ける通路です。しかしTCPだけでは、そのバイト列がページ取得なのか画像送信なのか分かりません。HTTPは通路の上に、意味のあるRequestとResponseの形を追加します。</p>${callout("important", "重要", "HTTPは暗号化の仕組みではありません。HTTPだけの通信は途中で読まれたり書き換えられたりします。暗号化とサーバー確認は、後のTLSが担当します。")}`,
      example: `<p>ブラウザが<code>https://example.com/news?id=7</code>を開く場合を考えます。<span class="term">URL</span>は、通信方法<code>https</code>、相手の名前<code>example.com</code>、道の番号<code>/news</code>、追加条件<code>id=7</code>をまとめた住所です。</p><p>ブラウザは「この住所の資源をください」という<code>GET</code> Requestを送り、サーバーは<code>200 OK</code>とHTMLを含むResponseを返します。エラーなら<code>404 Not Found</code>など別のStatusになります。</p>
    <h3>同じURLでも何を返すかは結果で変わる</h3>
    <p><code>GET /news?id=7</code>を受けたサーバーは、まず記事7を探します。</p>
    <ul><li><strong>記事がある場合</strong>は<code>200 OK</code>と記事の本文を返せます。</li>
      <li><strong>記事が見つからない場合</strong>は<code>404 Not Found</code>を返せます。404にも案内文やエラー情報の本文が付く場合があります。</li></ul>
    <p>応答を読むときは、ステータスで処理の結果を確かめ、ヘッダーで本文の形式を読み、最後にその形式で本文を解釈します。本文がJSONでも、成功したと判断する前にステータスを確認しましょう。</p>`,
      internal: `${diagram("URLからResponseまで", [["URL", "https + host + path"], ["Request", "method / headers / body"], ["Server", "処理と判断"], ["Response", "status / headers / body"]], "URLは宛先、Requestは依頼、Responseは結果です。TCP/Socketはこの交換を運ぶ土台です。")}
        <h3>Requestの構造</h3><p>Requestの先頭にはMethodと対象があり、たとえば<code>GET /news?id=7 HTTP/1.1</code>と書きます。<span class="term">Method</span>は「読む」「作る」「更新する」といった意図です。続く<span class="term">Header</span>には、ホスト名、受け取りたい形式、認証情報、本文の長さなどの補足を書きます。必要なら空行の後に<span class="term">Body</span>としてJSONやフォームのデータを置きます。</p><h3>Responseの構造</h3><p>Responseの先頭にはStatusがあります。<code>2xx</code>は成功、<code>3xx</code>は別の場所やキャッシュの指示、<code>4xx</code>は依頼側の問題、<code>5xx</code>はサーバー側の問題を表す分類です。Headerで<code>Content-Type: text/html</code>なら本文がHTMLだと分かり、Bodyに実際のHTMLが入ります。</p><h3>同じ番号でも意味は別</h3><p>URLの<code>:443</code>はTCPのport、Statusの<code>443</code>は存在しません。URLのportはどのSocketへ接続するか、HTTPのStatusは処理結果の分類です。似た数字を混ぜないことが大切です。</p>`,
      web: `<p>APIでは<code>GET /users/7</code>で読む、<code>POST /users</code>で新しい利用者を作る、と設計します。<code>POST</code>のJSONはBodyに入り、<code>Content-Type: application/json</code>で形式を伝えます。サーバーは入力を検査し、作成できれば<code>201 Created</code>を返します。</p><p>HTTPの1行やHeaderはSocketから届くバイト列をサーバーのHTTPライブラリが解釈した結果です。アプリは通常、Socketの細かな読み書きではなく、RequestオブジェクトとResponseオブジェクトを扱います。次の第5部では、そのResponseをブラウザがDOMや画面へ変える流れを追います。</p>`,
      lab: `${experiment("macOS / Linux", `curl -i https://example.com/\n\ncurl -i -X POST https://httpbin.org/post \\\n  -H 'Content-Type: application/json' \\\n  -d '{"name":"Ada"}'`, "GETのResponseと、JSONを送るPOSTの形を見ます。", "先頭行のStatus、Content-Type Header、最後のBodyに注目します。", "Method・Header・Bodyが役割の違う部品で、Statusが結果を表すことが分かります。")}${callout("note", "安全な観察", "httpbin.orgのような検証サービスへ個人情報や秘密鍵を送らないでください。")}`,
      misunderstandings: [["URLはファイルの場所だけを表します。", "URLはscheme、host、port、path、queryなどを組み合わせた通信先と資源の指定です。"], ["200なら、Bodyの中身も必ず正しいです。", "200はHTTP処理が成功したという結果で、アプリのデータが期待どおりかまでは保証しません。"]],
      questions: [["HTTPがTCPの上に必要なのはなぜですか。","TCPはバイト列を届ける通路であり、HTTPが依頼と結果の意味を決めるからです。","HTTPはTCPが届けるByte列を無視して電波だけを読みます。","TCPがRequestとResponseの意味を決めるためHTTPは不要です。","「TCPはバイト列を届ける通路であり、HTTPが依頼と結果の意味を決めるからです。」が正しいのは、TCPが運ぶByte列にRequest/Responseの意味を付けるため。誤答1の「HTTPはTCPが届けるByte列を無視して電波だけを読みます。」はHTTPとTCPの役割を逆にしているため。誤答2の「TCPがRequestとResponseの意味を決めるためHTTPは不要です。」はTCPだけでアプリの約束まで決まる説明だから。"],["GET Requestの主な意図は何ですか。","資源を読み取ることです。","GETは通常、資源を削除するためのMethodです。","GETは通常、資源を更新して新しい内容を保存するMethodです。","「資源を読み取ることです。」が正しいのは、GETは資源を読み取る意図を表すため。誤答1の「GETは通常、資源を削除するためのMethodです。」は削除の意図と取り違えているため。誤答2の「GETは通常、資源を更新して新しい内容を保存するMethodです。」は更新の意図と取り違えているため。"],["Headerの役割は何ですか。","本文の形式や長さ、認証、キャッシュなどの補足情報を伝えることです。","Headerは本文の画像だけを保存する領域です。","HeaderはTCPの再送順序だけを決める領域です。","「本文の形式や長さ、認証、キャッシュなどの補足情報を伝えることです。」が正しいのは、Bodyの形式・長さ・認証・Cacheなどの補足を伝えるため。誤答1の「Headerは本文の画像だけを保存する領域です。」はHTTPの補足情報を本文データの保存場所としているため。誤答2の「HeaderはTCPの再送順序だけを決める領域です。」はTCPの仕事をHTTP Headerの役割にしているため。"],["404はどの分類ですか。","4xxの依頼側に関係するエラーです。","404はServer内部の5xxに分類されます。","404は正常に作成できた2xxのStatusです。","「4xxの依頼側に関係するエラーです。」が正しいのは、依頼先の資源が見つからないなどClient側の4xxに分類されるため。誤答1の「404はServer内部の5xxに分類されます。」は4xxと5xxの分類を逆にしているため。誤答2の「404は正常に作成できた2xxのStatusです。」はエラーと成功の分類を混同しているため。"],["HTTPSの暗号化を担当するのは何ですか。","HTTPではなくTLSです。","HTTPSの暗号化はHTTPが単独で行います。","HTTPSの暗号化はDNSが行います。","「HTTPではなくTLSです。」が正しいのは、HTTPの下でTLSが通信路を暗号化するため。誤答1の「HTTPSの暗号化はHTTPが単独で行います。」はHTTPの意味とTLSの保護機能を同一視しているため。誤答2の「HTTPSの暗号化はDNSが行います。」は名前解決と暗号化を混同しているため。"],["JSONを送るときにContent-Typeを付ける理由は何ですか。","Bodyをどの形式として解釈すればよいか受け手に伝えるためです。","Content-TypeはResponseのTCP順序を指定するHeaderです。","Content-Typeは送信元のMAC Addressを知らせるHeaderです。","「Bodyをどの形式として解釈すればよいか受け手に伝えるためです。」が正しいのは、受け手がBodyをJSONとして解釈できるよう形式を示すため。誤答1の「Content-TypeはResponseのTCP順序を指定するHeaderです。」はデータ形式ではなくTransportの順序を説明しているため。誤答2の「Content-Typeは送信元のMAC Addressを知らせるHeaderです。」はLink層のAddress情報と混同しているため。"]],
      checks: ["URLの各部品の意味", "RequestとResponseの構造", "Method・Status・Header・Bodyの役割", "HTTPとTCP/SocketとTLSの境界"], search: "HTTP URL Request Response Method GET POST Status 200 404 Header Body Content-Type TCP Socket HTTPS"
    }),

    chapter({
      id: "http11-keepalive", no: 2, shortTitle: "HTTP/1.1とKeep-Alive", title: "HTTP/1.1：接続を使い回す設計", deck: "HTTP/1.1は、1本のTCP接続で何度もRequestとResponseを交換できるようにしました。便利さと、順番待ちの弱点を見ていきます。"
    }, {
      reading: "約18分",
      goals: ["HTTP/1.1のテキスト形式", "Keep-Aliveで接続を再利用する理由", "HostとContent-Lengthの役割", "Head-of-Line Blockingという待ち"],
      why: `<p>HTTP/1.0のように画像ごとにTCP接続を作ると、接続開始の往復が毎回必要です。接続が存在しなければ、TCP handshakeやTLS handshakeを資源ごとに繰り返し、ページ表示までの待ち時間とCPU負荷が増えます。</p><p>HTTP/1.1は同じ接続を使い回すKeep-Aliveを標準的に扱い、接続の準備を一度に減らしました。ただし、一つの接続ではResponseの順番が重要なため、先の処理が遅いと後ろも待つ弱点が残ります。</p>`,
      example: `<p>HTMLと画像3枚を取得するとします。Keep-Aliveなしでは4本の接続準備が必要です。Keep-Aliveなら、1本のTCP接続で順番に4つのRequestを送れます。Responseの終わりを知るため、サーバーは<code>Content-Length: 1280</code>やchunked形式でBodyの区切りを示します。</p>
    <h3>次の応答はどこから始まるか</h3>
    <p>Reuseできる接続で、最初の応答のヘッダーに<code>Content-Length: 5</code>があるとします。ヘッダーの後に5 byte読めば、本文の終わりが分かります。接続を開いたまま次の要求を送り、その応答を読み始められます。</p>
    <p>本文の区切りを接続の終了で示す応答では、切断されて初めて読み終わったと判断できます。接続を使い回すときは、受信側がどこまでを一件として読めるかを確認しましょう。</p>`,
      internal: `${diagram("HTTP/1.1の一つの接続", [["TCP接続", "handshake 1回"], ["Request A", "HTML"], ["Response A", "本文の長さ"], ["Request B", "画像"], ["Response B", "順番どおり"]], "同じSocketを再利用できますが、基本的に一つの接続上の交換は順番待ちになります。")}
        <h3>テキストとして読める交換</h3><p>HTTP/1.1のHeaderは人が読める文字列です。<code>Host</code>は同じIPアドレスで複数サイトを運ぶための名前で、サーバーがどのサイト向けか判断する材料になります。Bodyの境界は<code>Content-Length</code>、または<code>Transfer-Encoding: chunked</code>で伝えます。</p><h3>Keep-Aliveと切断</h3><p>Requestが終わってもTCPをすぐ閉じず、次のRequestを待つのがKeep-Aliveです。サーバーやクライアントが<code>Connection: close</code>を指定すれば、そのResponseの後に接続を閉じます。使い回しには、接続を長く保持するメモリとfile descriptorも必要です。</p><h3>順番待ちの弱点</h3><p>一つ目のResponse生成に2秒かかると、後ろの小さなResponseも同じ列で待つことがあります。これを<span class="term">Head-of-Line Blocking</span>と呼びます。HTTP/2は一つのTCP接続内で交換を分けることで改善します。</p>`,
      web: `<p>ブラウザとAPIサーバーの間では、接続再利用がTLSやTCPの準備回数を減らします。サーバーのkeep-alive timeoutが短すぎると接続がすぐ閉じ、長すぎるとアイドルなSocketが増えます。接続数、再利用率、待ち時間を監視します。</p><p>HTTP/1.1でも複数TCP接続を同時に張って待ちを分散できますが、接続ごとにKernelやTLSの資源を使います。多数接続で隠すより、HTTP/2以降の多重化が適切な場面があります。</p>`,
      lab: `${experiment("macOS / Linux", `curl -v --http1.1 https://example.com/ -o /dev/null https://example.com/ -o /dev/null`, "一回のcurl実行で、同じサーバーへ二つの要求を順に送り、接続の再利用を観察します。", "要求を表すGETが2回出ます。二回目に既存接続を再利用した表示が出るか、接続の開始がもう一度出るかを比べます。", "再利用できた場合は二回目のTCP接続とTLSの設定を省けます。相手が接続を閉じた場合などは接続し直すため、表示が変わります。")}${experiment("macOS / Linux", `curl -sS -D - --http1.1 https://example.com -o /dev/null`, "Response Headerを読みやすく確認します。", "Status、Date、Content-Type、Content-Length、Connectionを探します。", "Bodyとは別に、解釈のためのHeaderが先に送られると分かります。")}`,
      misunderstandings: [["Keep-AliveはHTTPの暗号化機能です。", "Keep-AliveはTCP接続を使い回す仕組みです。暗号化はTLSが行います。"], ["HTTP/1.1の一つの接続なら、全Requestが同時に自由に完了します。", "Responseの順番待ちがあり、先の処理が遅いと後ろも待つことがあります。"]],
      questions: [["Keep-Aliveが減らすものは何ですか。","RequestごとのTCP接続準備やTLS handshakeの回数です。","Keep-AliveはRequestごとにTCP接続を必ず作り直します。","Keep-AliveはHTTP Bodyの圧縮だけを行います。","「RequestごとのTCP接続準備やTLS handshakeの回数です。」が正しいのは、同じTCP接続を使い回して接続準備の回数を減らすため。誤答1の「Keep-AliveはRequestごとにTCP接続を必ず作り直します。」は接続再利用の動きを逆にしているため。誤答2の「Keep-AliveはHTTP Bodyの圧縮だけを行います。」は接続ではなく圧縮の役割としているため。"],["Host Headerが必要な場面は何ですか。","一つのIPアドレスで複数のWebサイトを区別するときです。","Host Headerは一つのIPに一つのWebサイトしかないときだけ必要です。","Host HeaderはTCPのSequenceを決めるために必要です。","「一つのIPアドレスで複数のWebサイトを区別するときです。」が正しいのは、同じIPで複数サイトを区別するため。誤答1の「Host Headerは一つのIPに一つのWebサイトしかないときだけ必要です。」はVirtual Hostの適用範囲を逆にしているため。誤答2の「Host HeaderはTCPのSequenceを決めるために必要です。」はHTTPのHeaderとTCPの番号を混同しているため。"],["Content-Lengthの役割は何ですか。","ResponseやRequestのBodyが何バイトかを示すことです。","Content-LengthはBodyが何種類の形式かを示します。","Content-Lengthは次のRouterのMAC Addressを示します。","「ResponseやRequestのBodyが何バイトかを示すことです。」が正しいのは、Request/Response Bodyのbyte数を示すため。誤答1の「Content-LengthはBodyが何種類の形式かを示します。」は長さと形式を混同しているため。誤答2の「Content-Lengthは次のRouterのMAC Addressを示します。」はHTTPの長さをLink層の宛先にしているため。"],["Head-of-Line Blockingとは何ですか。","先の交換が遅いことで後ろの交換まで待たされることです。","後ろの交換が先の交換を止めることです。","各交換が完全に独立し、先頭の遅れは後ろへ影響しません。","「先の交換が遅いことで後ろの交換まで待たされることです。」が正しいのは、先の交換の待ちが同じ列の後ろまで止めるため。誤答1の「後ろの交換が先の交換を止めることです。」は待ちの向きを逆にしているため。誤答2の「各交換が完全に独立し、先頭の遅れは後ろへ影響しません。」は影響が伝わらないと説明しているため。"],["Connection: closeが示すことは何ですか。","その交換の後にTCP接続を閉じる指示です。","その交換の後も同じTCP接続を永久に使う指示です。","Connection: closeはTLS証明書を更新する指示です。","「その交換の後にTCP接続を閉じる指示です。」が正しいのは、交換後にTCP接続を閉じる指示だから。誤答1の「その交換の後も同じTCP接続を永久に使う指示です。」は再利用と終了の意味を逆にしているため。誤答2の「Connection: closeはTLS証明書を更新する指示です。」は接続管理と証明書管理を混同しているため。"]],
      checks: ["HTTP/1.1がテキスト形式であること", "Keep-Aliveの利点と資源", "Body境界を示すHeader", "HTTP/1.1の順番待ち"], search: "HTTP/1.1 Keep-Alive keep alive Connection close Host Content-Length chunked Head-of-Line Blocking ALPN"
    }),

    chapter({
      id: "http2", no: 3, shortTitle: "HTTP/2", title: "HTTP/2：一つの接続を多重化", deck: "HTTP/2は、一本のTCP接続を複数のStreamに分け、HTMLや画像の交換を同時に進めやすくしました。見た目が同じHTTPでも、運び方が変わります。"
    }, {
      reading: "約18分",
      goals: ["Stream・Frame・Multiplexingの関係", "HTTP/1.1の待ちを軽くする方法", "HPACKによるHeader圧縮", "TCPに残るHead-of-Line Blocking"],
      why: `<p>現代のページはHTML、CSS、JavaScript、画像など多くの資源を読みます。HTTP/1.1で一つずつ待つと、TCPを増やしても接続準備が重くなります。HTTP/2が存在しなければ、同じサイトへの多数の資源を効率よく運びにくくなります。</p><p>HTTP/2は一つのTCP接続の中を複数の<span class="term">Stream</span>に分けます。小さなFrameを交互に送れるため、HTMLのResponseを待つ間にCSSのFrameも進められます。</p>`,
      example: `<p>Stream 1をHTML、Stream 3をCSS、Stream 5を画像とします。サーバーはHTMLのFrameの間にCSSのFrameを送れます。ブラウザはStream番号を見て、それぞれのBodyを組み立てます。接続は一本でも、論理的な交換は三つです。</p>
    <h3>CSSが画像を追い越せる場合</h3>
    <p>画像のFrameが大きな転送の途中で、CSSのFrameが送れる状態になったとします。送信側は画像のFrameの間にCSSのFrameを挟めます。受信側はStream番号を見ながら集めるので、画像が完了する前にCSSを使い始めることができます。</p>
    <p>一方、下のTCPで途中のデータが欠けると、それより後ろのbyteはTCPの順番が整うまでアプリへ渡されません。「HTTPがFrameを混ぜられること」と「TCPが順序どおりに渡すこと」が別の層の話だと分かります。</p>`,
      internal: `
      <figure class="concept-figure" aria-labelledby="http2-frames-title">
        <h3 class="visual-title" id="http2-frames-title">HTTP/2の多重化</h3>
        <p>一本の接続に、HTML・CSS・画像を運ぶ小さな部品（Frame）が混ざって届く例です。受信側は、やり取りごとに付いたStream番号で部品を振り分けます。</p>
        <table class="diagram-data-table" aria-labelledby="http2-frames-title">
          <thead><tr><th scope="col">到着順</th><th scope="col">Stream番号</th><th scope="col">中身</th></tr></thead>
          <tbody>
            <tr><th scope="row">1</th><td>1</td><td>HTML 前半</td></tr>
            <tr><th scope="row">2</th><td>3</td><td>CSS</td></tr>
            <tr><th scope="row">3</th><td>5</td><td>画像 前半</td></tr>
            <tr><th scope="row">4</th><td>1</td><td>HTML 後半</td></tr>
            <tr><th scope="row">5</th><td>5</td><td>画像 後半</td></tr>
          </tbody>
        </table>
        <figcaption class="visual-caption">例えば到着順1と4は、どちらもStream 1なのでHTMLとしてつなぎます。CSSはHTMLの後半を待たずに届きます。図では本文を運ぶFrameだけを示しています。</figcaption>
      </figure>
        <h3>FrameとStream</h3><p>HTTP/2はHeaderやBodyを一つの大きなテキストRequestとしてではなく、二進数の<span class="term">Frame</span>へ分けます。FrameにはどのStreamのものかを示す番号があります。Headerを運ぶFrameと、Bodyのデータを運ぶFrameは別種類です。</p><h3>Header圧縮</h3><p>CookieやUser-Agentなど、毎回似たHeaderをそのまま繰り返すと通信量が増えます。HPACKは過去に送ったHeaderを表に覚え、二回目から短い番号で示します。値が変わると新しい情報を送ります。</p><h3>残るTCPの待ち</h3><p>Streamは分かれていても、TCPは全バイトを一つの順番で届けます。一つのpacketが失われると、その後ろのデータが再送を待つ可能性があります。HTTP/2はHTTPの順番待ちを減らしますが、TCPレベルの待ちまでは消しません。HTTP/3はここを別の方法で扱います。</p>`,
      web: `<p>ブラウザはHTTPS接続時のALPNで、相手がHTTP/2を使えるか確認します。サーバーが対応していれば、画像ごとにTCP接続を増やさずに多くのStreamを使えます。HTTP/2ではサーバープッシュなどの機能もありましたが、実際の利用や効果は構成によって異なります。</p><p>アプリ開発者は通常、HTTP/2のFrameを直接作りません。Webサーバーやリバースプロキシが処理します。第7章で扱うCDNやReverse Proxyが、利用者とアプリの間でHTTP/2を終端することもあります。</p>`,
      lab: `${experiment("macOS / Linux", `curl -I -v --http2 https://example.com`, "サーバーとのHTTP/2利用可否とALPNを確認します。", "ALPNでh2が選ばれたか、環境のcurlがHTTP/2対応かに注目します。", "HTTP/2はHTTP Headerの機能だけでなく、TLS接続の通信方式の選択にも関係すると分かります。")}${callout("note", "環境差", "curlにHTTP/2機能がない場合は、`curl --version`でFeaturesを確認してください。対応するcurlやブラウザの開発者ツールでも観察できます。")}`,
      misunderstandings: [["HTTP/2ならTCPのpacket lossによる待ちは起きません。", "複数Streamでも同じTCPを共有するため、TCPの再送待ちの影響は残ります。"], ["HTTP/2はHTTP/1.1と全く別の意味のProtocolです。", "MethodやStatusなどHTTPの意味は保ち、Frameや多重化という運び方を変えています。"]],
      questions: [["HTTP/2のStreamは何を表しますか。","HTMLやCSSなど、独立した論理的な交換の流れです。","StreamはTCP接続そのものを複数のIPへ分けたものです。","StreamはFrameを保存するDiskの区画です。","「HTMLやCSSなど、独立した論理的な交換の流れです。」が正しいのは、一つの論理的なRequest/Responseの流れを表すため。誤答1の「StreamはTCP接続そのものを複数のIPへ分けたものです。」は接続という物理的な土台と論理的な流れを混同しているため。誤答2の「StreamはFrameを保存するDiskの区画です。」は保存領域としているため。"],["FrameにStream番号がある理由は何ですか。","混ざって届くデータを元の交換へ振り分けるためです。","Stream番号はFrameを暗号化するためだけに付けます。","Stream番号がなくても混ざったFrameを必ず元へ戻せます。","「混ざって届くデータを元の交換へ振り分けるためです。」が正しいのは、混ざって運ばれたFrameを元のStreamへ振り分けるため。誤答1の「Stream番号はFrameを暗号化するためだけに付けます。」は振り分けではなく暗号化の値としているため。誤答2の「Stream番号がなくても混ざったFrameを必ず元へ戻せます。」は番号なしでも識別できるという説明だから。"],["HPACKが減らすものは何ですか。","繰り返し送るHTTP Headerの通信量です。","HPACKは画像の画素データを圧縮します。","HPACKはTCPの再送回数を減らします。","「繰り返し送るHTTP Headerの通信量です。」が正しいのは、繰り返すHTTP Headerの通信量を減らすため。誤答1の「HPACKは画像の画素データを圧縮します。」はHeader圧縮と画像圧縮を混同しているため。誤答2の「HPACKはTCPの再送回数を減らします。」はHTTP/2のHeader方式とTCP制御を混同しているため。"],["HTTP/2でもTCPの損失待ちが残るのはなぜですか。","複数Streamが一つのTCPの順序と再送を共有するからです。","HTTP/2のStreamはそれぞれ別のTCP接続を使います。","HTTP/2ではPacket lossが起きても再送は不要です。","「複数Streamが一つのTCPの順序と再送を共有するからです。」が正しいのは、複数Streamが一つのTCPの順序と再送を共有するため。誤答1の「HTTP/2のStreamはそれぞれ別のTCP接続を使います。」は接続を一つに共有する特徴を逆にしているため。誤答2の「HTTP/2ではPacket lossが起きても再送は不要です。」はTCPの信頼性に必要な再送をなくしているため。"],["HTTP/2を直接実装することが少ないのはなぜですか。","WebサーバーやプロキシがFrameとStreamを処理し、アプリは通常HTTP APIを扱うからです。","アプリはFrameを必ず一つずつ手作業で作ります。","WebサーバーはHTTP APIを扱わず、Streamを作りません。","「WebサーバーやプロキシがFrameとStreamを処理し、アプリは通常HTTP APIを扱うからです。」が正しいのは、サーバーやProxyがFrameを処理し、アプリは通常HTTP APIを扱うため。誤答1の「アプリはFrameを必ず一つずつ手作業で作ります。」は実装の担当をアプリ側へ逆に置いているため。誤答2の「WebサーバーはHTTP APIを扱わず、Streamを作りません。」はサーバー側の処理を否定しているため。"]],
      checks: ["StreamとFrameの役割", "一つのTCP接続の多重化", "HPACKの目的", "HTTP/2でもTCP待ちが残る理由"], search: "HTTP/2 HTTP2 stream frame multiplexing HPACK ALPN h2 TCP Head-of-Line Blocking"
    }),

    chapter({
      id: "http3", no: 4, shortTitle: "HTTP/3", title: "HTTP/3：QUIC上のWeb通信", deck: "HTTP/3はTCPの代わりにQUICを使い、Streamごとの独立性と接続移動を目指します。UDPを使うから安全ではない、という境界も確認します。"
    }, {
      reading: "約18分",
      goals: ["HTTP/3とQUICとUDPの関係", "Streamごとの再送独立性", "Connection IDによる接続移動", "HTTP/3でもTLS 1.3が必要な理由"],
      why: `<p>HTTP/2はStreamを分けましたが、TCPの一つの順序に縛られます。packet lossがあると、関係のないStreamまで待つことがあります。HTTP/3がなければ、携帯回線からWi-Fiへ移ったときや、損失の多い回線でStreamを独立に進める設計が難しくなります。</p><p>QUICはUDPの上に作られた通信Protocolです。ただし「UDPに乗せただけ」ではありません。再送、順序、暗号、Stream、接続IDをQUIC自身が管理します。</p>`,
      example: `<p>動画のStreamで一つのパケットが失われても、CSSのStreamは受け取ったデータを処理できます。TCPのように全Streamが一つの順序待ちになるのを避ける設計です。スマートフォンのIPアドレスが変わっても、QUICのConnection IDで同じ接続を見つけやすくします。</p>
    <h3>失われたデータをどのStreamが待つか</h3>
    <p>画像とCSSが別Streamにあり、画像のデータだけを載せたパケットが失われたとします。画像のStreamでは欠けた位置を埋める必要があります。CSS側で自分のStreamの必要なデータが届いていれば、画像側の欠落を待たずに進めます。</p>
    <p>一つのパケットに複数Streamのデータが入っていれば、失われたパケットに含まれるStreamはそれぞれ影響を受けます。共有する回線の混雑も全体に影響します。独立しているのは、各Stream内で順番をそろえる処理です。</p>`,
      internal: `${diagram("HTTP/3の層", [["HTTP/3", "Request / Response"], ["QUIC", "Stream / 再送 / 暗号"], ["UDP", "datagram配送"], ["IP", "宛先への通信"]], "UDPは最低限の配送窓口で、信頼性や暗号を含むQUICがその上にあります。HTTP/3が安全なのはUDPだからではありません。")}
        <h3>Streamの独立</h3><p>QUICはStreamごとにデータの順番と再送を管理します。動画のStreamで失われたデータを待っている間も、CSSのStreamの受信済みデータをアプリへ渡せます。これがHTTP/2と比べた大きな違いです。</p><h3>Connection IDと移動</h3><p>TCP接続は通常、送信元IPとportの組み合わせに強く結び付きます。QUICはConnection IDを使って接続を識別するため、携帯回線の切替でIPが変わっても接続を維持しやすくなります。完全に必ず維持できるという意味ではなく、再接続の負担を減らす設計です。</p><h3>TLS 1.3との統合</h3><p>QUICはTLS 1.3を使って暗号化と相手確認のhandshakeを行います。HTTP/3の暗号化は次章のTLSとつながりますが、HTTPの意味をTLSが決めるわけではありません。</p>`,
      web: `<p>ブラウザはHTTPSの接続でHTTP/3を試し、対応していない場合はHTTP/2やHTTP/1.1へ切り替えます。サーバーやCDNがUDPの443番portを受けられる必要があり、企業ネットワークやFirewallの設定によってはTCPへ戻ることがあります。</p><p>HTTP/3を使っても、アプリのDB待ちやサーバー処理が遅くなるわけではありません。変わるのは主に利用者とHTTP終端の間の通信方法です。</p>`,
      lab: `${experiment("macOS / Linux", `curl -I -v --http3 https://example.com`, "curlがHTTP/3とQUICを利用できるか確認します。", "HTTP/3対応の有無、h3の表示、UDP/443に関するエラーに注目します。", "HTTP/3はアプリのURLを変えるものではなく、通信経路のProtocol選択であると分かります。")}${experiment("macOS / Linux", `curl --version`, "手元のcurlのProtocol対応を調べます。", "FeaturesにHTTP3、HTTP2が含まれるかを見ます。", "同じcurlコマンドでもビルド時のライブラリによって使えるProtocolが違うと分かります。")}`,
      misunderstandings: [["HTTP/3はUDPなので、通信が暗号化されません。", "QUICがTLS 1.3を統合して暗号化と相手確認を行います。UDP自体に安全性があるわけではありません。"], ["HTTP/3なら必ずHTTP/2より速くなります。", "回線の損失、サーバー処理、端末、Firewallなどで効果は変わります。"]],
      questions: [["HTTP/3がTCPの代わりに使うものは何ですか。","QUICです。QUICはUDPの上に信頼性やStreamを実装します。","HTTP/3はTCPの代わりにDNSを使います。","HTTP/3はTCPの代わりにEthernetだけを使います。","「QUICです。QUICはUDPの上に信頼性やStreamを実装します。」が正しいのは、QUICがUDP上で信頼性やStreamを実装するため。誤答1の「HTTP/3はTCPの代わりにDNSを使います。」はTransportの代替を名前解決にしているため。誤答2の「HTTP/3はTCPの代わりにEthernetだけを使います。」はLink層の仕組みだけでHTTPを運ぶ説明だから。"],["HTTP/3でStream独立性が役立つのはなぜですか。","一つのStreamのpacket lossが他のStreamの受信済みデータを止めにくくするからです。","一つのStreamのLossが必ず全Streamを停止させます。","Stream独立性はHeader圧縮だけを改善します。","「一つのStreamのpacket lossが他のStreamの受信済みデータを止めにくくするからです。」が正しいのは、一つのStreamの損失待ちが他のStreamへ広がりにくいため。誤答1の「一つのStreamのLossが必ず全Streamを停止させます。」は独立性の効果を逆にしているため。誤答2の「Stream独立性はHeader圧縮だけを改善します。」は損失制御ではなく圧縮の説明になっているため。"],["Connection IDの目的は何ですか。","IPやportが変わっても同じQUIC接続を識別しやすくするためです。","Connection IDは変化したIPを暗号化する鍵です。","Connection IDは各HTTP Headerの長さを表します。","「IPやportが変わっても同じQUIC接続を識別しやすくするためです。」が正しいのは、IPやPortが変わっても同じQUIC接続を識別しやすくするため。誤答1の「Connection IDは変化したIPを暗号化する鍵です。」は接続識別子と暗号鍵を混同しているため。誤答2の「Connection IDは各HTTP Headerの長さを表します。」はTransportの識別子をHTTPの長さにしているため。"],["HTTP/3の暗号化を担うProtocolは何ですか。","TLS 1.3です。","HTTP/3の暗号化はUDPだけが自動で行います。","HTTP/3はTLSを使わずHTTP Headerだけを隠します。","「TLS 1.3です。」が正しいのは、QUICと組み合わせたTLS 1.3が暗号化を担うため。誤答1の「HTTP/3の暗号化はUDPだけが自動で行います。」はUDPそのものに暗号機能があると誤解しているため。誤答2の「HTTP/3はTLSを使わずHTTP Headerだけを隠します。」はTLSを使わないという説明だから。"],["HTTP/3が使えないときに起きることは何ですか。","HTTP/2やHTTP/1.1など利用できるProtocolへ切り替えることがあります。","HTTP/3が使えないと通信は必ず失敗し、他方式は試しません。","HTTP/3が使えないとDNSへ切り替えて画面を表示します。","「HTTP/2やHTTP/1.1など利用できるProtocolへ切り替えることがあります。」が正しいのは、利用できるHTTP/2やHTTP/1.1へ切り替えることがあるため。誤答1の「HTTP/3が使えないと通信は必ず失敗し、他方式は試しません。」はFallbackの仕組みを否定しているため。誤答2の「HTTP/3が使えないとDNSへ切り替えて画面を表示します。」はHTTP以外の名前解決へ切り替える説明だから。"]],
      checks: ["UDP・QUIC・HTTP/3の層の違い", "Stream単位の再送", "Connection IDの意味", "HTTP/3とTLS 1.3の関係"], search: "HTTP/3 HTTP3 QUIC UDP stream packet loss Connection ID TLS 1.3 h3"
    }),

    chapter({
      id: "tls-certificates", no: 5, shortTitle: "TLSと証明書", title: "TLS：暗号化と本人確認", deck: "HTTPSの鍵マークは、データを隠すだけでなく、接続相手が本当にそのサイトかを確かめる仕組みの結果です。公開鍵暗号、証明書、共通鍵の役割を分けて考えます。"
    }, {
      reading: "約24分",
      goals: ["TLSがHTTPの前に作る安全な通路", "暗号化と本人確認の違い", "公開鍵暗号と共通鍵暗号の分担", "Certificate ChainとHostname検証"],
      why: `<p>HTTPをそのまま使うと、同じWi-Fiや途中のネットワークにいる人がPasswordやCookieを読めます。また、暗号化だけで相手の名前を確認しなければ、攻撃者が自分のサーバーを本物だと名乗れます。TLSが存在しなければ、秘密を隠すことと相手を信じることを安全に組み合わせられません。</p><p>TLSはHTTPの意味を変えず、HTTPが流れる前に安全な通路を作ります。つまりTLSは「誰と話しているか」「途中で読まれないか」「書き換えられていないか」を担当し、GETやStatusの意味はHTTPが担当します。</p>${callout("important", "境界", "暗号化は盗み見を難しくしますが、本人確認とは別です。証明書と信頼された認証局を検証して初めて、『この公開鍵はこの名前のサーバーのもの』と判断できます。")}`,
      example: `<p><code>https://shop.example</code>へ接続すると、サーバーは証明書を提示します。証明書にはHostname、公開鍵、有効期間、発行者の署名があります。ブラウザはHostnameが一致し、期限内で、信頼できる認証局から順につながるか確認します。</p><p>確認できたら、handshakeで共有秘密を作ります。公開鍵暗号はこの合意と署名確認に使われ、その後の大量のBodyは高速な共通鍵暗号で守ります。</p>
    <h3>鍵が同じでも名前を検査する理由</h3>
    <p><code>shop.example</code>を開いたのに、相手が<code>images.example</code>用の証明書を提示したとします。その証明書の署名や有効期限が正しくても、<code>shop.example</code>に対応する名前が含まれなければ、目的の相手と確認できません。</p>
    <p>証明書の確認は、信頼できる発行元につながるか、期限内か、接続した名前に対応するかを分けて考えます。開発環境でも、どの検査が失敗したかを確認すると、証明書の置き換えや接続先設定の修正箇所が分かります。</p>`,
      internal: `${diagram("TLS handshakeの役割", [["ClientHello", "対応方式・名前"], ["Certificate", "公開鍵と署名"], ["検証", "名前・期限・発行者"], ["共有秘密", "共通鍵を合意"], ["HTTP", "暗号化されたRequest"]], "公開鍵暗号を大量データに使い続けるのではなく、安全に共有秘密を作った後は共通鍵暗号で通信します。")}
        <h3>公開鍵と秘密鍵</h3><p>公開鍵は配ってよい鍵、秘密鍵はサーバーだけが持つ鍵です。公開鍵で暗号化したものを秘密鍵で戻す使い方や、秘密鍵で署名して公開鍵で検証する使い方があります。現代のTLSでは鍵交換方式にも工夫がありますが、「秘密鍵をネットワークへ送らない」が大切です。</p><h3>Certificate Chain</h3><p>サーバー証明書は、信頼されたRoot CAから直接発行されるとは限りません。Intermediate CAが署名し、その上をRoot CAが信頼する鎖を作ります。ブラウザは署名を順に検証し、途中の証明書が信頼できるRootへ到達するか見ます。</p><h3>暗号化だけでは足りない場面</h3><p>自己署名証明書で通信を暗号化することはできます。しかしブラウザがその証明書を信頼していないと、相手の本人確認は完了しません。開発環境では警告を理解した上で例外を使うことがありますが、本番では正しいHostnameと証明書を使います。</p>`,
      web: `<p>Webアプリは通常TLSを自分で実装せず、WebサーバーやLoad Balancer、CDNでTLSを終端します。そこで復号されたHTTPが内部へ流れる場合、利用者から終端までだけでなく、終端からアプリまでの保護も設計します。</p><p>証明書の期限切れ、Hostname不一致、秘密鍵漏えい、古いTLS設定は、HTTPのControllerコードが正しくても接続を壊します。監視では有効期限とhandshakeエラーを別に見ます。</p>`,
      lab: `${experiment("macOS / Linux", `openssl s_client -connect example.com:443 -servername example.com </dev/null`, "公開証明書、発行者、TLS方式の情報を観察します。", "subject、issuer、Not Before/After、Verify return code、Protocolに注目します。", "証明書に名前と期限があり、TLS handshakeの後に暗号化された通信が始まると分かります。")}${experiment("macOS / Linux", `curl -Iv https://example.com`, "curlがHostnameと証明書を検証する様子を見ます。", "SSL certificate verify、subject、SSL connectionの行に注目します。", "HTTPSでは接続先の名前を検証してからHTTP Requestを送ることが分かります。")}`,
      misunderstandings: [["HTTPSなら、接続相手の本人確認は不要です。", "暗号化と本人確認は別で、証明書の署名・名前・期限などを検証する必要があります。"], ["公開鍵暗号で全てのWeb Bodyを暗号化します。", "handshakeで共有秘密を作り、通常のBodyは高速な共通鍵暗号で暗号化します。"]],
      questions: [["TLSがHTTPの前に作るものは何ですか。","暗号化と改ざん検出ができる安全な通信路です。","TLSはHTTPのStatus Codeだけを作ります。","TLSは暗号化なしの通信路を作ります。","「暗号化と改ざん検出ができる安全な通信路です。」が正しいのは、HTTPを流す前に暗号化と改ざん検出の通信路を作るため。誤答1の「TLSはHTTPのStatus Codeだけを作ります。」はTLSとHTTPの役割をStatus生成に置き換えているため。誤答2の「TLSは暗号化なしの通信路を作ります。」は保護のない通路と説明しているため。"],["CertificateのHostnameを確認する理由は何ですか。","提示された公開鍵が接続先の名前のサーバーのものか確かめるためです。","Hostname確認は公開鍵を誰でも使えるようにするためです。","Hostname確認はCookieの有効期限を確認するためです。","「提示された公開鍵が接続先の名前のサーバーのものか確かめるためです。」が正しいのは、接続先名と証明書の対象名が一致するか確かめるため。誤答1の「Hostname確認は公開鍵を誰でも使えるようにするためです。」は名前と鍵の結び付きを確認する目的を逆にしているため。誤答2の「Hostname確認はCookieの有効期限を確認するためです。」はCookieの管理と証明書検証を混同しているため。"],["秘密鍵をネットワークへ送らない理由は何ですか。","盗まれると、そのサーバーになりすます材料になるためです。","秘密鍵は相手に送って共有するほど安全になります。","秘密鍵を送らないのは、通信速度を上げるためだけです。","「盗まれると、そのサーバーになりすます材料になるためです。」が正しいのは、盗まれるとそのServerになりすます材料になるため。誤答1の「秘密鍵は相手に送って共有するほど安全になります。」は漏えいリスクを安全性と逆にしているため。誤答2の「秘密鍵を送らないのは、通信速度を上げるためだけです。」は速度の問題だけに限定しているため。"],["公開鍵暗号と共通鍵暗号の分担は何ですか。","公開鍵暗号は合意や署名検証、共通鍵暗号は大量データの高速な暗号化を担当します。","公開鍵暗号は大量の本文を高速に暗号化し、共通鍵は署名だけを検証します。","公開鍵暗号も共通鍵暗号も鍵交換には使わず、同じ役割です。","「公開鍵暗号は合意や署名検証、共通鍵暗号は大量データの高速な暗号化を担当します。」が正しいのは、公開鍵暗号で合意や署名を扱い、共通鍵で大量データを高速に暗号化するため。誤答1の「公開鍵暗号は大量の本文を高速に暗号化し、共通鍵は署名だけを検証します。」は二つの方式の担当を逆にしているため。誤答2の「公開鍵暗号も共通鍵暗号も鍵交換には使わず、同じ役割です。」は役割を同一にしているため。"],["自己署名証明書の注意点は何ですか。","暗号化はできても、通常は信頼された発行者として本人確認されません。","自己署名証明書は発行者が信頼されるので本人確認も自動で完了します。","自己署名証明書は暗号化もできず、本文を平文で送ります。","「暗号化はできても、通常は信頼された発行者として本人確認されません。」が正しいのは、暗号化はできても、通常は信頼された発行者による確認にならないため。誤答1の「自己署名証明書は発行者が信頼されるので本人確認も自動で完了します。」は信頼の確認まで完了するとしているため。誤答2の「自己署名証明書は暗号化もできず、本文を平文で送ります。」は暗号化できることまで否定しているため。"],["HTTPのStatusを決めるのはTLSですか。","いいえ。TLSは通路を守り、Statusの意味はHTTPが決めます。","Status CodeはTLSが暗号化の成否として決めます。","Status CodeはDNSがHost名から決めます。","「いいえ。TLSは通路を守り、Statusの意味はHTTPが決めます。」が正しいのは、TLSは通路を守り、Statusの意味はHTTPが決めるため。誤答1の「Status CodeはTLSが暗号化の成否として決めます。」はTLSの保護とHTTPの意味付けを混同しているため。誤答2の「Status CodeはDNSがHost名から決めます。」は名前解決とResponseの意味を混同しているため。"]],
      checks: ["TLSとHTTPの境界", "暗号化と本人確認の違い", "証明書の検証項目", "公開鍵暗号と共通鍵暗号の分担"], search: "TLS HTTPS certificate public key private key CA Root Intermediate hostname verify encryption authentication symmetric asymmetric openssl"
    }),

    chapter({
      id: "cookie-cache-etag", no: 6, shortTitle: "Cookieとキャッシュ", title: "Cookie・Session・Cache：状態と再利用", deck: "HTTPは基本的に一回ごとの交換ですが、Cookieで利用者を見分け、Cache-ControlとETagで同じデータを再利用できます。保存と再検証を混同しないようにします。"
    }, {
      reading: "約24分",
      goals: ["CookieがRequestへ戻る仕組み", "Session IDとサーバー側の状態", "Cache-Controlによる保存可否と期間", "ETagと304による条件付きRequest"],
      why: `<p>HTTP Requestは、前のRequestを覚えているとは限りません。前の買い物かごやログイン状態が存在しなければ、毎回「誰ですか」と聞き直すことになります。CookieとSessionがなければ、ブラウザとサーバーの間で利用者の状態を続けて扱うのが難しくなります。</p><p>また、同じ画像やJSONを毎回サーバーから送ると、通信量と処理が増えます。Cacheがなければ速くできるデータまで取りに行くため、利用者にもサーバーにも無駄が増えます。</p>`,
      example: `<p>ログイン成功時、サーバーが<code>Set-Cookie: sid=abc123; Secure; HttpOnly</code>を返します。ブラウザは保存し、同じ範囲への次のRequestに<code>Cookie: sid=abc123</code>を付けます。サーバーは<code>abc123</code>をSession表で検索して利用者を判断します。Cookie自体に個人情報を詰め込む必要はありません。</p><p>画像Responseに<code>ETag: "v7"</code>があれば、次回ブラウザは<code>If-None-Match: "v7"</code>を送ります。内容が変わらなければサーバーは<code>304 Not Modified</code>だけを返し、Bodyを省けます。</p>
    <h3>識別と更新確認のヘッダーを読み分ける</h3>
    <p>ログイン済みの画面が、その後に共通のCSSを再取得する場面を考えましょう。</p>
    <ul><li><strong>Cookie</strong>は、送信条件を満たす要求にブラウザが保存済みの値を付ける仕組みです。サーバーはSessionを調べるために使えます。</li>
      <li><strong>ETag</strong>は、保存済みの応答の版を確認するときに使います。版が同じと分かれば、サーバーは<code>304</code>を返せます。</li></ul>
    <p>Networkパネルでは、Cookieが送られたかは要求ヘッダーで確認し、本文を再転送したかはステータスと転送量を見て判断します。</p>`,
      internal: `${diagram("CookieとCacheの往復", [["Response", "Set-Cookie / ETag"], ["Browser", "保存"], ["次のRequest", "Cookie / If-None-Match"], ["Server", "Session照合 / 304判断"]], "Cookieは主に状態の手掛かり、ETagは保存済みの表現がまだ新しいかを再検証する印です。")}
        <h3>CookieとSessionの分担</h3><p>Cookieはブラウザから自動で送られる小さな値です。Sessionはサーバーがその値に対応するログイン情報などを保存する仕組みです。Cookieに<code>sid=abc123</code>があっても、Session表から削除されればログイン状態は失効します。</p><h3>Cache-Controlの指示</h3><p><code>Cache-Control: max-age=60</code>は、受け取ってから60秒は新鮮として再利用できるという指示です。<code>no-store</code>は保存しない指示、<code>no-cache</code>は保存しても利用前に再検証する指示です。名前に「no」があっても、no-cacheは「一切保存禁止」と同じではありません。</p><h3>再検証と更新</h3><p>期限が切れたCacheは、元サーバーへ条件付きRequestを送ります。ETagが同じなら304でBodyを返さず、変わっていれば新しい200とBodyを返します。保存済みのResponseを無条件に使うことと、元サーバーへ新しいか尋ねることは別です。</p>`,
      web: `<p>Session IDには推測されにくい乱数を使い、Cookieには<code>Secure</code>、<code>HttpOnly</code>、適切な<code>SameSite</code>を設定します。Cookieを持っているだけで正当な利用者だと決めず、Sessionの期限やサーバー側の権限も確認します。</p><p>Cacheの範囲を間違えると、利用者Aの個人ページをBへ返す事故になります。個人情報を含むResponseは<code>private</code>や<code>no-store</code>を検討し、公開画像やバージョン付き静的ファイルは長くCacheできるようにします。</p>`,
      lab: `${experiment("macOS / Linux・Cookieを受け取って送り返す", `jar=$(mktemp)
curl -i -c "$jar" https://httpbin.org/cookies/set/demo/yes
curl -iv -b "$jar" https://httpbin.org/cookies
rm "$jar"`, "サーバーから受け取った教材用のCookieを、一時ファイルに記録して次の要求で送ります。", "最初の応答のSet-Cookieと、二回目の詳しいログで要求側に出るCookieを探します。", "応答で渡された値を利用するのは次の要求です。公開の実験用サービスへ接続するので、実際のログインCookieは使いません。")}
      ${experiment("Node.js・ETagで本文を省く", `node - <<'NODE'
const http = require('node:http');

const tag = '"v1"';
const server = http.createServer((request, response) => {
  response.setHeader('ETag', tag);
  if (request.headers['if-none-match'] === tag) {
    response.writeHead(304).end();
    return;
  }
  response.end('current content');
});

server.listen(0, '127.0.0.1', async () => {
  const url = 'http://127.0.0.1:' + server.address().port;
  try {
    const first = await fetch(url);
    const receivedTag = first.headers.get('etag');
    console.log('first:', first.status, receivedTag, await first.text());

    for (const knownTag of [receivedTag, '"old"']) {
      const response = await fetch(url, { headers: { 'If-None-Match': knownTag } });
      console.log('checked:', knownTag, response.status, (await response.text()).length);
    }
  } finally {
    server.close();
  }
});
NODE`, "同じURLに、保存した版と異なる版を送って応答を比べます。", "最初は200と本文が返ります。受け取ったETagで再確認すると304で本文は0文字、古いETagを送ると200で本文が返ります。", "保存済みの応答が今も使えると分かった場合、サーバーは本文を省けます。この例ではNode.jsが手元でサーバーも動かすため、外部サービスの応答には依存しません。")}`,
      misunderstandings: [["no-cacheは、Cacheへ一切保存してはいけない指示です。", "no-cacheは利用前の再検証を求める指示で、保存禁止はno-storeです。"], ["CookieにSession IDがあれば、ログインが必ず安全です。", "盗難やCSRFなどのリスクがあるため、Secure・HttpOnly・SameSite、期限、サーバー側検証が必要です。"]],
      questions: [["Set-Cookieの役割は何ですか。","ブラウザへCookieを保存するようResponseで伝えることです。","Set-CookieはServerのSessionを削除するRequest Headerです。","Set-CookieはTCPのWindowを広げる指示です。","「ブラウザへCookieを保存するようResponseで伝えることです。」が正しいのは、ResponseでBrowserへCookie保存を伝えるため。誤答1の「Set-CookieはServerのSessionを削除するRequest Headerです。」はCookie保存をServer側の削除操作としているため。誤答2の「Set-CookieはTCPのWindowを広げる指示です。」はHTTP状態とTCP制御を混同しているため。"],["Sessionはどこに状態を置く仕組みですか。","主にサーバー側へ利用者の状態を置き、CookieのIDで対応付けます。","Sessionは常にBrowserのCookie本文だけへ状態を保存します。","SessionはRouterのRouting Tableへ利用者の状態を保存します。","「主にサーバー側へ利用者の状態を置き、CookieのIDで対応付けます。」が正しいのは、主にServer側に状態を置き、CookieのIDと対応付けるため。誤答1の「Sessionは常にBrowserのCookie本文だけへ状態を保存します。」はServer側状態とBrowser保存を逆にしているため。誤答2の「SessionはRouterのRouting Tableへ利用者の状態を保存します。」は利用者状態と経路表を混同しているため。"],["max-age=60は何を表しますか。","Responseを受け取ってから60秒を新鮮として使える指示です。","max-age=60は60時間保存する指示です。","max-age=60は保存禁止を示す指示です。","「Responseを受け取ってから60秒を新鮮として使える指示です。」が正しいのは、受信から60秒を新鮮として使える指定だから。誤答1の「max-age=60は60時間保存する指示です。」は単位を時間へ変えているため。誤答2の「max-age=60は保存禁止を示す指示です。」は新鮮さの時間と保存禁止を混同しているため。"],["no-storeとno-cacheの違いは何ですか。","no-storeは保存しない、no-cacheは保存しても利用前に再検証する指示です。","no-storeは保存して再検証し、no-cacheは一切保存しません。","no-storeもno-cacheも常に再検証なしで使います。","「no-storeは保存しない、no-cacheは保存しても利用前に再検証する指示です。」が正しいのは、no-storeは保存せず、no-cacheは保存後に利用前の再検証を求めるため。誤答1の「no-storeは保存して再検証し、no-cacheは一切保存しません。」は二つのDirectiveの意味を逆にしているため。誤答2の「no-storeもno-cacheも常に再検証なしで使います。」は再検証が必要な場合を省いているため。"],["ETagが同じときのStatusは何ですか。","Bodyが変わっていないことを示す304 Not Modifiedです。","ETagが同じなら200で必ずBodyを再送します。","ETagが同じなら404で資源を削除します。","「Bodyが変わっていないことを示す304 Not Modifiedです。」が正しいのは、保存済みの表現が変わっていないので304を返せるため。誤答1の「ETagが同じなら200で必ずBodyを再送します。」は再検証成功時のBody省略を逆にしているため。誤答2の「ETagが同じなら404で資源を削除します。」は見つからない状態と取り違えているため。"],["Cache事故が起きる原因は何ですか。","個人向けResponseを共有Cacheへ保存するなど、Responseの対象範囲を誤ることです。","個人向けResponseを共有Cacheへ保存しても利用者ごとの差は出ません。","Cache事故はCacheを一切使わないことだけで起きます。","「個人向けResponseを共有Cacheへ保存するなど、Responseの対象範囲を誤ることです。」が正しいのは、Responseの対象範囲を誤り、個人向け内容を共有してしまうため。誤答1の「個人向けResponseを共有Cacheへ保存しても利用者ごとの差は出ません。」は共有範囲の違いを無視しているため。誤答2の「Cache事故はCacheを一切使わないことだけで起きます。」はCache未使用を事故の原因としているため。"]],
      checks: ["CookieとSessionの分担", "Cache-Controlの保存・再検証指示", "ETagとIf-None-Match", "304でBodyを省く流れ"], search: "Cookie Set-Cookie Session sid Secure HttpOnly SameSite Cache-Control max-age no-store no-cache ETag If-None-Match 304 private"
    }),

    chapter({
      id: "cdn-proxy-cors", no: 7, shortTitle: "CDN・Proxy・CORS", title: "CDN・Proxy・CORS：Webの境界を設計", deck: "利用者とアプリの間には、CDN、Reverse Proxy、Load Balancerが入り、ブラウザにはOriginの境界があります。どこで判断し、どこで止まるかを具体的に追います。"
    }, {
      reading: "約26分",
      goals: ["CDNとReverse Proxyの役割", "Load Balancerの振り分け", "Originをscheme・host・portで判定", "Same-Origin PolicyとCORSの許可手順"],
      why: `<p>アプリサーバーが世界中の利用者から直接すべての画像やRequestを受けると、距離による遅延、急なアクセス集中、攻撃や証明書管理を一台で抱えることになります。CDNやReverse Proxyが存在しなければ、近い場所から静的ファイルを返したり、複数台へ安全に振り分けたりしにくくなります。</p><p>一方、ブラウザは悪意あるサイトが別サイトのResponseを勝手に読むことを防ぎます。Same-Origin Policyがなければ、ログイン中の銀行サイトの情報を、開いた広告サイトのJavaScriptが読み取れる危険があります。必要な通信だけをCORSで許可します。</p>`,
      example: `<p>画面が<code>https://app.example</code>、APIが<code>https://api.example</code>なら、hostが違うため別Originです。JavaScriptの<code>fetch</code>はAPIへRequestを送れても、Responseを読むにはAPIが<code>Access-Control-Allow-Origin: https://app.example</code>を返す必要があります。</p><p>ブラウザがJSONのPOSTを送る前に、<code>OPTIONS</code>のpreflightを送ることがあります。APIが許可MethodやHeaderを返さなければ、本番のPOSTを送らずに止めます。</p>
    <h3>キャッシュで返った応答をJavaScriptが読めるか</h3>
    <p>アプリが別Originにある画像データを<code>fetch()</code>で読み取るとします。CDNにそのデータが保存されていれば、配信元へ問い合わせずに応答できる場合があります。応答をJavaScriptへ渡せるかどうかは、その後にブラウザがCORSの条件を確かめて決めます。</p>
    <p>調べるときは、CDNがどこから応答を返したかと、応答に必要なCORSヘッダーが付いているかを分けます。Originごとに許可ヘッダーを変える設計では、キャッシュでもどのOrigin向けの応答かを区別する必要があります。</p>`,
      internal: `${diagram("利用者からアプリまで", [["Browser", "SOP / CORS判定"], ["CDN", "近いCache"], ["Reverse Proxy", "TLS / Header / routing"], ["Load Balancer", "server-1 / server-2"], ["App", "API処理"]], "同じHTTPでも、どの層がResponseを返したかで、Cache・認証・Origin・障害時の見え方が変わります。")}
        <h3>CDNとReverse Proxy</h3><p><span class="term">CDN</span>は利用者に近い拠点へ静的ResponseをCacheし、距離と元サーバーの負荷を減らします。<span class="term">Reverse Proxy</span>は利用者から見るとアプリの代理人で、TLS終端、Header追加、圧縮、認証、内部サーバー選択などを行います。CDNがReverse Proxyの機能を持つこともあります。</p><h3>Load Balancer</h3><p>Load Balancerは複数のアプリサーバーへRequestを振り分けます。<code>server-1</code>が落ちても<code>server-2</code>へ送れるようHealth Checkを行います。Sessionを一台のメモリだけへ置くと、次のRequestが別台へ行ったときログインが消えたように見えるため、共有Storeや適切な設計が必要です。</p><h3>Originの計算</h3><p>Originは<code>scheme + host + port</code>の組です。<code>https://app.example:443</code>と<code>https://app.example:8443</code>はportが違い、<code>http://app.example</code>はschemeが違うため別Originです。pathの<code>/a</code>と<code>/b</code>だけが違う場合は同じOriginです。</p><h3>CORSの許可</h3><p>Same-Origin PolicyはブラウザがResponseを読む境界です。サーバーが<code>Access-Control-Allow-Origin</code>で具体的なOriginを許可し、必要なら<code>Access-Control-Allow-Methods</code>や<code>Access-Control-Allow-Headers</code>を返します。Cookieを伴うRequestでは<code>Access-Control-Allow-Credentials: true</code>が関係し、許可Originに<code>*</code>を使えない制約があります。</p>`,
      web: `<p>本番では、利用者→CDN→Reverse Proxy→Load Balancer→アプリという構成がよくあります。TLSをどこで終端するか、元の利用者IPをどのHeaderで渡すか、Cacheをどこで共有するかを明確にします。信頼できないClientからの<code>X-Forwarded-For</code>をそのまま認証に使ってはいけません。</p><p>CORSはサーバー間通信を暗号化する機能ではなく、ブラウザが別OriginのResponseをJavaScriptへ渡す条件です。curlはブラウザのSOPを強制しないため、curlで成功してもブラウザのfetchが成功するとは限りません。</p><p>次の第5部では、Browserが受け取ったResponseをHTML、CSS、JavaScriptとして解析し、画面へ描く流れを扱います。</p>`,
      lab: `${experiment("macOS / Linux", `curl -i -H 'Origin: https://app.example' https://httpbin.org/response-headers?Access-Control-Allow-Origin=https%3A%2F%2Fapp.example\ncurl -i -X OPTIONS https://httpbin.org/anything \\\n  -H 'Origin: https://app.example' \\\n  -H 'Access-Control-Request-Method: POST'`, "CORS Headerとpreflight Requestの形を確認します。", "Origin、Access-Control-Allow-Origin、OPTIONS、Allow-Methodsに注目します。", "Originはブラウザが付ける情報で、CORSの許可はResponse Headerで判断されると分かります。")}${experiment("macOS / Linux", `curl -I https://example.com\ncurl -I https://www.example.com`, "Reverse ProxyやCDNが返すServer、Via、Ageなどの手掛かりを観察します。", "Cache-Control、Age、Via、Server、X-Cacheなど、存在するHeaderを探します。", "利用者とアプリの間に代理やCacheがいても、HTTP Responseとして見える情報があると分かります。")}${callout("note", "ブラウザとの差", "curlはSame-Origin Policyを実施しません。CORSの実際の読み取り可否は、ブラウザの開発者ツールでも確認してください。")}`,
      misunderstandings: [["CORS Headerを付ければ、どんなClientからのアクセスも安全になります。", "CORSは主にブラウザのResponse読み取り制御です。認証やServer間のアクセス制御そのものではありません。"], ["app.exampleとapi.exampleは同じOriginです。", "hostが違うため別Originです。同じOriginにはscheme・host・portの三つが一致する必要があります。"]],
      questions: [["CDNの主な目的は何ですか。","利用者に近い場所のCacheから返し、距離と元サーバーの負荷を減らすことです。","CDNは常に元Serverだけから返し、利用者との距離を増やします。","CDNは認証情報を全利用者へ同じように配る仕組みです。","「利用者に近い場所のCacheから返し、距離と元サーバーの負荷を減らすことです。」が正しいのは、利用者に近いCacheから返して距離と元Serverの負荷を減らすため。誤答1の「CDNは常に元Serverだけから返し、利用者との距離を増やします。」はCDNの近接Cacheの利点を逆にしているため。誤答2の「CDNは認証情報を全利用者へ同じように配る仕組みです。」は認証の共有と配信Cacheを混同しているため。"],["Reverse Proxyは何をしますか。","利用者の代理としてTLS終端やHeader処理、内部サーバーへのroutingなどを行います。","Reverse ProxyはClientのBrowser内だけで動き、Serverへ転送しません。","Reverse Proxyは常にDNS recordだけを編集します。","「利用者の代理としてTLS終端やHeader処理、内部サーバーへのroutingなどを行います。」が正しいのは、代理としてTLS終端・Header処理・内部Serverへのroutingを行うため。誤答1の「Reverse ProxyはClientのBrowser内だけで動き、Serverへ転送しません。」はProxyの転送とBrowser内部の機能を混同しているため。誤答2の「Reverse Proxyは常にDNS recordだけを編集します。」はHTTP経路の代理と名前管理を同一視しているため。"],["Load BalancerのHealth Checkの目的は何ですか。","正常なアプリサーバーへRequestを振り分け、故障台を避けるためです。","Health Checkは故障したServerへ優先してRequestを送るためです。","Health CheckはResponse Bodyを圧縮するためです。","「正常なアプリサーバーへRequestを振り分け、故障台を避けるためです。」が正しいのは、正常なServerへ振り分け、故障台を避けるため。誤答1の「Health Checkは故障したServerへ優先してRequestを送るためです。」は振り分け条件を逆にしているため。誤答2の「Health CheckはResponse Bodyを圧縮するためです。」は可用性確認と本文圧縮を混同しているため。"],["Originを決める三要素は何ですか。","scheme、host、portです。","OriginはURLのpath、query、Cookieで決まります。","OriginはResponseのStatus、Body、ETagで決まります。","「scheme、host、portです。」が正しいのは、scheme・host・portの三つが組を作るため。誤答1の「OriginはURLのpath、query、Cookieで決まります。」はURLの識別要素と状態情報を取り違えているため。誤答2の「OriginはResponseのStatus、Body、ETagで決まります。」はResponse内容をOriginの構成要素としているため。"],["CORSで許可Originを伝えるHeaderは何ですか。","Access-Control-Allow-Originです。","Access-Control-Allow-OriginはRequest本文の長さを伝えるHeaderです。","Access-Control-Allow-OriginはTLSの証明書名を伝えるHeaderです。","「Access-Control-Allow-Originです。」が正しいのは、BrowserへScriptから読んでよいOriginを示すため。誤答1の「Access-Control-Allow-OriginはRequest本文の長さを伝えるHeaderです。」はCORSの許可範囲をBody長としているため。誤答2の「Access-Control-Allow-OriginはTLSの証明書名を伝えるHeaderです。」はBrowserの境界とTLSの名前確認を混同しているため。"],["curlでCORSを検証するときの注意は何ですか。","curlはブラウザのSame-Origin Policyを強制しないため、ブラウザでの結果とは異なることです。","curlはBrowserと同じSame-Origin Policyを必ず強制します。","curlで許可された結果なら、どのBrowserでも同じ制限なく読めます。","「curlはブラウザのSame-Origin Policyを強制しないため、ブラウザでの結果とは異なることです。」が正しいのは、curlは通常BrowserのSame-Origin Policyを自動適用しないため。誤答1の「curlはBrowserと同じSame-Origin Policyを必ず強制します。」はcurlの挙動をBrowserの制限と同じにしているため。誤答2の「curlで許可された結果なら、どのBrowserでも同じ制限なく読めます。」はコマンドの結果からBrowserの挙動まで断定しているため。"],["Cookie付きCORSで関係する設定は何ですか。","Access-Control-Allow-Credentialsと、具体的な許可Originです。","Cookie付きCORSではAllow-Credentialsは不要で、Originは*でよいです。","Cookie付きCORSではTLSの秘密鍵だけを設定します。","「Access-Control-Allow-Credentialsと、具体的な許可Originです。」が正しいのは、資格情報の許可と具体的なOrigin指定が必要になるため。誤答1の「Cookie付きCORSではAllow-Credentialsは不要で、Originは*でよいです。」はCredential設定とOrigin指定を不要としているため。誤答2の「Cookie付きCORSではTLSの秘密鍵だけを設定します。」はCORSとTLSの鍵設定を混同しているため。"]],
      checks: ["CDN・Reverse Proxy・Load Balancerの分担", "scheme・host・portによるOrigin判定", "Same-Origin Policyの目的", "CORS Responseとpreflightの手順"], search: "CDN reverse proxy load balancer health check cache Origin same-origin policy SOP CORS Access-Control-Allow-Origin OPTIONS preflight credentials"
    })
  ];

  registerPart("part-4", partChapters);
})();
