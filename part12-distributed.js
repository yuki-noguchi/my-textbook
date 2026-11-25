(() => {
  "use strict";
  const kit = globalThis.courseKit;
  if (!kit) throw new Error("courseKit is required before part12-distributed.js");
  const { makeChapter, flowDiagram, callout, experiment, codeBlock } = kit;
  const metadata = { partTitle: "第12部 分散システム", total: 9 };
  const chart = (title, items, caption, options={}) => flowDiagram(title, items, caption, options);
  const table = (title, items, caption) => `<figure class="diagram"><p class="diagram-title">${title}</p><div class="memory-map">${items.map(([a,b]) => "<div class=\"memory-row\"><span>"+a+"</span><span>"+b+"</span></div>").join("")}</div><figcaption>${caption}</figcaption></figure>`;
  const decisionChart = (title, start, branches, caption) => `<figure class="concept-figure" data-animate="false"><p class="diagram-title">${title}</p><div class="visual-sequence"><div class="visual-step" data-visual-role="input"><strong>${start[0]}</strong><small>${start[1]}</small></div><span class="visual-arrow" aria-hidden="true">→</span><div class="visual-step" data-visual-role="process"><strong>状態を分ける</strong><small>返事がないだけでは結果を決めない</small></div></div><div class="visual-grid branch-options">${branches.map(([label,detail,action,role])=>`<div class="visual-panel" data-visual-role="${role}"><strong>${label}</strong><p>${detail}</p><small>次の行動：${action}</small></div>`).join("")}</div><figcaption>${caption}</figcaption></figure>`;
  const ch = (id,no,shortTitle,title,deck,content) => makeChapter({id,no,...metadata,shortTitle,title,deck},content);
  const serverLab = (port, source, commands, purpose, focus, result) => `
    <p>Node.jsとcurlが入った環境で試します。端末を二つ開き、端末1で待ち受けが始まってから、端末2で通信を試してください。観察を終えたら端末1でCtrl+Cを押します。</p>
    ${codeBlock("端末1でサーバーを起動", `node - <<'NODE'
const http = require('node:http');
${source}
server.listen(${port}, '127.0.0.1', () => console.log('listening on ${port}'));
NODE`)}
    ${experiment("端末2からリクエストを送信", commands, purpose, focus, result)}`;

  const story = "注文APIへPOSTしたClientが返事を待ちきれずtimeoutしました。しかしServerは注文を保存し、決済まで成功させていました。";

  const c1 = ch("distributed-system",1,"Distributed System / Partial Failure","Distributed System / Partial Failure：一部だけ壊れる世界","複数のコンピュータが協力する分散システムでは、全体が一度に止まるとは限りません。届いたか分からない返事を出発点に、部分障害を考えます。",{
    goals:["Distributed Systemと単一プログラムの違い","Partial Failureが一部だけ応答しない状態であること","timeoutしたがServer側では成功した事例","障害を前提に境界と状態を設計すること"],
    why:`<p>Webサービスはブラウザ、API、DB、決済サービス、Queueなど複数の機械に分かれています。どれか一つが遅くなっても、他は動き続けることがあります。</p><p>分散の考え方がないと、Clientのtimeoutを処理失敗と決めつけ、注文の二重作成や二重決済を起こします。返事が消えただけで、仕事の結果まで消えたとは限りません。</p>`,
    example:`<p>${story}Clientは失敗と表示しますが、再送すると同じ注文が二つになる危険があります。Clientから見える応答なしと、ServerやDBで起きた処理済みは別の事実です。</p><p>通信経路だけが壊れたり、DBだけが遅くなったりする状態をPartial Failureと呼びます。相手が生きているか、処理を終えたかを直接確実には知れません。</p>
    <h3>注文の結果が分からないまま戻ってきた場合</h3>
    <p>注文ボタンを押して応答が来ないと、Clientには何が起きたか確定できません。</p>
    <ul><li><strong>依頼が届かなかった</strong>場合は注文がまだありません。</li>
      <li><strong>処理だけ終わった</strong>場合は注文があり、返事だけが届いていません。</li></ul>
    <p>画面で「結果を確認中」と扱い、元の依頼を識別できる番号で照会できれば、利用者に同じ注文をもう一度作らせずに状態を確認できます。通信の観測と、注文が確定したかという業務上の状態を分ける例です。</p>`,
    internal:`${chart("一部障害の時系列",[["Client","POST /orders"],["Server","DBへ保存"],["Network","responseがLoss"],["Client","timeout、結果不明"],["Server","決済まで成功"]],"ClientのtimeoutはServerが処理していない証明ではありません。")}${table("見える事実と隠れた事実",[["Client","返事が期限内に届かない"],["Network","遅延・Loss・切断の可能性"],["Server","保存や決済の可能性"],["DB","commit済みか未確定"]],"左列は観察する側、右列はその場所で分かることや調べる対象です。たとえばClientの行で分かるのは「期限内に返事が来なかった」ことです。注文が確定したかを知るには、ServerやDB側で同じ注文の記録を確認します。")}<h3>境界とMessage</h3><p>別Processや別マシンでは、関数呼び出しのように結果が必ずすぐ返るとは考えません。MessageにIDや状態を持たせ、後から問い合わせられるようにします。</p><h3>障害の種類</h3><p>Crashは相手が止まること、Network Partitionは通信経路が分かれること、Slowは壊れていないのに遅いことです。利用者からはどれもtimeoutに見えます。</p>${callout("important","最初の原則","timeoutは失敗確定ではなく、結果がまだ分からない状態です。確認API、重複防止、監査ログを組み合わせます。")}`,
    web:`<p>第11部のKubernetesではPodが再起動し、一部Replicaだけが応答しないことがあります。第8部のRDBがcommitした後にAPI Podが落ちる場合も、Clientには返事なしが見えます。</p><p>第3部のPacket LossやRouting遅延を、APIとデータの設計へつなげます。最終章では全体を復習します。</p>`,
    lab:`${serverLab(3030, `const server = http.createServer((request, response) => {
  setTimeout(() => {
    console.log('server processed the request');
    response.end('done');
  }, 1500);
});`, "curl --max-time 1 -X POST http://127.0.0.1:3030/orders",
    "応答を諦めたClientと、処理を続けたServerを同じ要求で観察します。",
    "端末2にタイムアウトが出たあと、端末1に server processed the request が出ます。",
    "Clientの期限が切れても、相手の処理が止まるとは限りません。この実験ではログを処理完了の目印にしています。")}`,
    misunderstandings:[["ClientがtimeoutしたらServerの処理も取り消されています。","通信の返事が消えただけで、Serverが保存済みの場合があります。"],["複数台を使えば自動的に高可用です。","通信、再起動、整合性、重複処理を設計する必要があります。"]],
    questions:[["Partial Failureとは何ですか。","一部の機械や通信だけが失敗する状態です。","全てのNodeが同時に同じ失敗をする状態です。","処理結果が必ず成功か失敗のどちらかに確定している状態です。","「一部の機械や通信だけが失敗する状態です。」が正しいのは、一部のNodeや通信だけが失敗し、全体の一部が動き続けるため。誤答1の「全てのNodeが同時に同じ失敗をする状態です。」は一部だけの失敗を全体停止としている。誤答2の「処理結果が必ず成功か失敗のどちらかに確定している状態です。」は返事がなく結果が決まらない状態と混同している。"],["timeoutから分かることは何ですか。","期限内に返事が届かなかったことです。","Serverが処理を必ず失敗させたことです。","RequestがServerへ届かなかったことです。","「期限内に返事が届かなかったことです。」が正しいのは、期限までにClientが返事を受け取れなかった事実だけが分かるため。誤答1の「Serverが処理を必ず失敗させたことです。」はServer側の失敗まで断定している。誤答2の「RequestがServerへ届かなかったことです。」は送信経路の失敗まで断定している。"],["timeout後の注文をすぐ再送する危険は何ですか。","Server側で最初の注文が成功し、二重作成になることです。","最初の注文が失敗したと確定しているため安全です。","RetryするとServerは同じ注文を必ず一度だけ処理します。","「Server側で最初の注文が成功し、二重作成になることです。」が正しいのは、最初の処理がServerで成功していた可能性があり重複作成になるため。誤答1の「最初の注文が失敗したと確定しているため安全です。」は結果不明のまま失敗と決めている。誤答2の「RetryするとServerは同じ注文を必ず一度だけ処理します。」は重複を防ぐ設計がないのに一回処理を保証している。"],["結果不明の処理へ必要な設計は何ですか。","状態確認、重複防止、監査ログなどです。","Client側のtimeout値だけを長くします。","同じRequestを理由なく何度も送ります。","「状態確認、重複防止、監査ログなどです。」が正しいのは、状態確認・重複防止・監査ログでServer側の結果を追えるようにするため。誤答1の「Client側のtimeout値だけを長くします。」は待つ時間だけを延ばして結果を確認していない。誤答2の「同じRequestを理由なく何度も送ります。」は再送による重複を増やすだけで追跡情報がない。"],["localhost実験の目的は何ですか。","Clientの期限切れとServerの遅い処理を別に観察することです。","Networkを複数Regionへ分けて遅延を測ります。","DBのIndex性能だけを測ります。","「Clientの期限切れとServerの遅い処理を別に観察することです。」が正しいのは、Clientの期限切れとServerの遅い処理を分けて観察するため。誤答1の「Networkを複数Regionへ分けて遅延を測ります。」は実験の主題を地理的な分散へ広げている。誤答2の「DBのIndex性能だけを測ります。」はHTTP経路ではなくDB検索だけを対象にしている。"]],
    checks:["分散システムの境界","Partial Failure","timeoutと処理成功の違い","確認・重複防止・監査"],search:"Distributed System Partial Failure timeout server success network partition Kubernetes Pod RDB"
  });

  const c2 = ch("distributed-timeout",2,"Timeout","Timeout：待つ時間の境界","Timeoutは相手が失敗したと断定する魔法ではありません。待ち続けて自分まで止まらないための期限と、その後の確認を設計します。",{
    goals:["Connect・Read・Request Timeoutの違い","短すぎる期限と長すぎる期限","timeout後もServer処理が続く可能性","期限を予算として分ける方法"],
    why:`<p>返事を無限に待つThreadやConnectionはサービス全体を詰まらせます。Timeoutは待つ仕事を切り上げ、資源をほかへ戻す境界です。</p><p>短すぎると正常な処理を諦め、${story}のような結果不明を増やします。長すぎると遅い依存先が全体を止めます。</p>`,
    example:`<p>全体の期限を2秒とし、DNSに300ms、TCP/TLSに500ms、API処理に1秒の予算を割り当てます。APIを始める時点で残りが200msなら、その期限を相手へ渡します。</p><p>Clientが2秒でtimeoutしても、Serverが2.2秒でcommitすることがあります。再送前に注文状態をGETで確認します。</p>
    <h3>残り時間を次のサービスへ渡す</h3>
    <p>最初の受付から800 ms以内に応答したいとします。受付と検査までに250 ms、別サービスの呼び出し前にさらに150 msかかった場合、残りは400 msです。その先にも時間が必要なら、この呼び出しに400 msすべてを使えるわけではありません。</p>
    <p>各段階で同じ800 msを設定すると、時間を足した結果は利用者が待てる800 msを超えます。共通の期限から残り時間を割り当てると、応答を作る分の余裕も計算に入れられます。</p>`,
    internal:`${decisionChart("Timeout後に考える三つの例",["Clientの期限切れ","時間内に返事が届かなかった"],[["Serverは成功済み","処理は終わり、返事だけ届かなかった","Request IDで結果を取得","store"],["Serverは処理中","仕事は続いている","状態APIで待つか取消す","wait"],["Serverへ未到着","接続前などで止まった","安全条件を確認してRetry","error"]],"Timeoutから直接『失敗』へ一本で進めません。状態を確認してから次の行動を選びます。")}
      <figure class="concept-figure" aria-labelledby="timeout-clocks-title">
        <h3 class="visual-title" id="timeout-clocks-title">どの待ち時間に上限を設けるか</h3>
        <p>一件の要求に対して、何を待つときの上限かを比べます。</p>
        <table class="diagram-data-table" aria-labelledby="timeout-clocks-title">
          <thead><tr><th scope="col">期限の種類</th><th scope="col">期限を設ける対象</th></tr></thead>
          <tbody>
            <tr><th scope="row">Connect</th><td>相手との接続ができるまで</td></tr>
            <tr><th scope="row">Read</th><td>接続後に、次のデータが届くまで</td></tr>
            <tr><th scope="row">Request</th><td>要求を始めてから、やり取りを終えるまでの全体</td></tr>
          </tbody>
        </table>
        <figcaption class="visual-caption">全体の期限が先に切れることもあります。計測の始点や適用範囲は使うライブラリによって異なるので、実際の設定ではどの待ち時間を指すかを確認します。</figcaption>
      </figure>
      ${table("期限の予算",[["Client全体","2,000 ms"],["DNS","300 ms"],["TCP/TLS","500 ms"],["API/DB","残り1,200 ms"]],"Retryすると残り時間も減ります。")}<h3>期限の種類</h3><p>Connectは接続まで、Readはデータを待つ時間、Requestは送信から完了までです。ライブラリごとに名前と既定値が異なります。</p><h3>Timeout後の状態</h3><p>Socketを閉じてもServerの仕事が自動で取り消されるとは限りません。キャンセル信号、Job ID、状態確認APIを用意します。</p>${callout("note","設定の記録","timeout値、区間、依存先、request IDをログへ残します。")}`,
    web:`<p>第2部のSocketが長く待つとThread Poolの空きが減ります。第11部のProbe再起動をtimeoutの代わりに乱用すると、処理中のPodをさらに不安定にします。</p><p>HTTP Clientには全体、接続、応答の期限を明示します。</p>`,
    lab:`${serverLab(3031, `const server = http.createServer((request, response) => {
  setTimeout(() => response.end('success\\n'), 1200);
});`, "curl --max-time 0.5 http://127.0.0.1:3031/\ncurl --max-time 3 http://127.0.0.1:3031/",
    "約1.2秒で応答するServerに、異なる期限で同じ要求を送ります。",
    "最初の要求は0.5秒でタイムアウトし、次の要求は success を受け取ります。",
    "Serverの処理は同じでも、Clientが待てる時間によって観測結果が変わります。Javaの例も試す場合は端末1を起動しておきます。")}${experiment("Java / localhost","cat > TimeoutDemo.java <<'EOF'\nimport java.net.*;class TimeoutDemo{public static void main(String[]x)throws Exception{try(Socket s=new Socket()){s.connect(new InetSocketAddress(\"127.0.0.1\",3031),500);s.setSoTimeout(500);System.out.println(s.getInputStream().read());}catch(Exception e){System.out.println(e.getClass().getSimpleName());}}}\nEOF\njavac TimeoutDemo.java && java TimeoutDemo","Java Socketの接続・読み取り期限を確認します。","ConnectとReadの例外を区別します。","期限の種類で見えるエラーが変わります。")}`,
    misunderstandings:[["timeoutしたらServerへ届いていません。","届いて処理中、処理済み、返事だけLossなど複数の可能性があります。"],["期限は長いほど安全です。","長すぎると資源を占有し、連鎖的な遅延を起こします。"]],
    questions:[["Connect Timeoutの区間はどこですか。","接続を確立するまでです。","Serverの処理が完了するまでです。","Response Bodyを全て読み終えるまでです。","「接続を確立するまでです。」が正しいのは、接続を確立するまでの区間だから。誤答1の「Serverの処理が完了するまでです。」は接続後の処理時間としている。誤答2の「Response Bodyを全て読み終えるまでです。」は本文読取の区間としている。"],["Read timeoutでもServerが成功できる理由は何ですか。","Clientの待ち期限とServerの処理期限が別だからです。","Clientの期限切れはServerの処理も必ず止めます。","Serverの処理期限がClientのRead期限と常に同じです。","「Clientの待ち期限とServerの処理期限が別だからです。」が正しいのは、Clientが待つ期限とServerが処理を続ける期限は別に設定できるため。誤答1の「Clientの期限切れはServerの処理も必ず止めます。」はClientの中断がServer処理も取り消すとしている。誤答2の「Serverの処理期限がClientのRead期限と常に同じです。」は二つの時計を同一視している。"],["期限を予算に分ける目的は何ですか。","DNSや接続など、どこで時間を使ったか管理するためです。","全ての時間をServer処理だけに割り当てます。","DNSや接続の時間を計測せず最後だけ待ちます。","「DNSや接続など、どこで時間を使ったか管理するためです。」が正しいのは、DNS・接続・処理など各区間に使える時間を管理するため。誤答1の「全ての時間をServer処理だけに割り当てます。」は時間配分をServerだけへ偏らせている。誤答2の「DNSや接続の時間を計測せず最後だけ待ちます。」は途中の区間を無視している。"],["timeout後に確認APIを使う理由は何ですか。","結果不明の処理が成功済みか調べるためです。","結果不明でも同じ注文をもう一度作るためです。","確認APIはClientのtimeoutを解除するためです。","「結果不明の処理が成功済みか調べるためです。」が正しいのは、最初の処理が成功済みかを副作用なしに確認するため。誤答1の「結果不明でも同じ注文をもう一度作るためです。」は確認を重複作成の再送にしている。誤答2の「確認APIはClientのtimeoutを解除するためです。」は確認APIの役割を待ち時間の変更としている。"],["期限が長すぎる問題は何ですか。","資源を占有し、ほかの処理まで詰まらせることです。","長い期限なら占有資源は必ず減ります。","待っているRequestは他の処理へ影響しません。","「資源を占有し、ほかの処理まで詰まらせることです。」が正しいのは、接続やWorkerなどの資源を長く占有し詰まりを広げるため。誤答1の「長い期限なら占有資源は必ず減ります。」は長時間保持の影響を逆にしている。誤答2の「待っているRequestは他の処理へ影響しません。」は待ちが共有資源を使う点を無視している。"]],
    checks:["Timeoutの種類","期限予算","timeout後のServer状態","資源占有と連鎖遅延"],search:"Timeout connect read request deadline budget Socket Java Node.js"
  });

  const c3 = ch("retry-backoff",3,"Retry / Exponential Backoff","Retry / Exponential Backoff：再試行の間隔","Retryは便利ですが、全員が同時に再試行すると障害を大きくします。回数、間隔、Jitterを設計します。",{
    goals:["Retryしてよい失敗と危険な失敗","Exponential Backoffの増加規則","Jitterで時刻をずらす理由","timeout後の注文を無条件再送しない判断"],
    why:`<p>一時的なLossや503なら、待って再試行すると成功することがあります。${story}の後に同じPOSTを無条件Retryすると、二重注文になります。</p><p>さらに多数のClientが同時Retryすると、復旧しかけたServerへ負荷を集中させます。</p>`,
    example:`<p>間隔を100ms、200ms、400ms、800msのように倍へ増やします。±20%のJitterも加え、Clientごとの時刻をずらします。</p><p>GETはRetryしやすいですが、注文POSTはIdempotency Keyや状態確認とセットにします。</p>
    <h3>失敗の理由で次の一手を変える</h3>
    <p>注文の入力に必須項目がないと返された場合は、同じ内容を送り直しても結果は変わりません。一時的な混雑や接続の失敗なら、少し間を置くと成功する場合があります。ただし期限が切れていたり、注文がすでに処理済みだったりする可能性も考えます。</p>
    <p>再試行の条件を決めるときは、失敗が一時的か、元の操作を繰り返してよいか、時間と回数に余裕があるかを順に確認します。間隔を調整する仕組みは、その判断の後に使います。</p>`,
    internal:`${decisionChart("Retryする前の判断",["失敗・Timeout","種類と副作用を確認"],[["400・認証失敗","同じRequestでは直らない","Retryせず入力や権限を直す","error"],["GETの503・切断","一時障害で副作用が少ない","Backoffして上限内でRetry","wait"],["注文POSTの結果不明","最初の処理が成功済みかもしれない","状態確認または同じKeyでRetry","process"]],"Error名だけで再送せず、直る可能性と二重実行の影響を確認します。")}${chart("Exponential Backoff",[["1回目","失敗 → 約100ms","wait"],["2回目","失敗 → 約200ms","wait"],["3回目","失敗 → 約400ms","wait"],["Jitter","時刻を少しずらす","process"],["上限","回数・期限で停止","error"]],"待ち時間を広げ、同時Retryの波を小さくします。", {animate:true})}<h3>BackoffとJitter</h3><p>Backoffは再試行するほど間隔を広げます。Jitterは乱数で少しずらす仕組みです。全Clientが同じ時刻にRetryするThundering Herdを避けます。</p><h3>Retryの境界</h3><p>回数、最大待ち時間、対象エラー、全体deadlineを決めます。Retryは処理をなかったことにしません。</p>${callout("warning","停止条件","Retryを無限にしません。期限を超えたら状態確認へ進みます。")}`,
    web:`<p>第11部のPod再起動やDB接続拒否では、Client、Mesh、WorkerのRetryが重なることがあります。各層の回数を掛け算にしません。</p><p>第3部のTCPもLossへ対応します。アプリRetryを細かくしすぎると、待ち時間が増えます。</p>`,
    lab:`${experiment("localhost / Node.js","node - <<'EOF'\nfor(let i=0;i<5;i++){const b=100*2**i;console.log(i+1,Math.round(b*(.8+Math.random()*.4))+'ms')}\nEOF","BackoffとJitterの予定時刻を表示します。","同じ回数でも間隔が変わる点に注目します。","Retryの波をずらす考え方を確認できます。")}${serverLab(3032, `const server = http.createServer((request, response) => {
  response.statusCode = 503;
  response.end('temporary');
});`, `for n in 1 2 3; do
  curl -sS -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:3032/
  if [ "$n" -lt 3 ]; then sleep "$n"; fi
done`, "一時的な利用不可を表すHTTP 503に対し、間隔を空けて試します。", "503が合計3回表示され、そこで止まります。待ち時間は1秒、2秒です。", "間隔を広げる設定に加え、いつ再試行を打ち切るかを決めておく必要があります。")}`,
    misunderstandings:[["Retryすれば最終的に必ず成功します。","障害が続くと負荷だけが増え、期限切れや重複を起こします。"],["Backoffだけで同時Retry問題は解決します。","Jitter、上限、Circuit Breakerなども必要です。"]],
    questions:[["Retryが有効な失敗は何ですか。","一時的な切断や503など、回復しうる失敗です。","入力ミスや権限拒否も無条件に再送します。","一時的な切断でも一度失敗したら永久に終わりです。","「一時的な切断や503など、回復しうる失敗です。」が正しいのは、一時的な切断や503のように再び成功する可能性がある失敗だから。誤答1の「入力ミスや権限拒否も無条件に再送します。」は利用者側の修正が必要な失敗まで再送している。誤答2の「一時的な切断でも一度失敗したら永久に終わりです。」は一時失敗にも再試行しないとしている。"],["Backoffの目的は何ですか。","復旧途中の相手へ負荷を集中させないことです。","復旧途中の相手へ同時に大量のRetryを送ります。","Retry間隔を常に0にして復旧を早めます。","「復旧途中の相手へ負荷を集中させないことです。」が正しいのは、復旧途中の相手へ送る負荷を時間的に分散するため。誤答1の「復旧途中の相手へ同時に大量のRetryを送ります。」は負荷集中を避ける目的と逆の動作だから。誤答2の「Retry間隔を常に0にして復旧を早めます。」は間隔をなくすことで集中を強めている。"],["Jitterとは何ですか。","Retry時刻へランダムなずれを加えることです。","全Clientが同じ時刻にRetryするようそろえる値です。","Retryを永遠に禁止するための固定期限です。","「Retry時刻へランダムなずれを加えることです。」が正しいのは、Retry時刻にClientごとのランダムなずれを加えるため。誤答1の「全Clientが同じ時刻にRetryするようそろえる値です。」は同時Retryをそろえる機能としている。誤答2の「Retryを永遠に禁止するための固定期限です。」はRetry停止の設定と取り違えている。"],["timeout後の注文POSTをRetryする前に何をしますか。","Keyや状態確認で最初の処理を調べます。","成功したか分からないまま別Keyで新しい注文を作ります。","状態確認をせず、無限にRetryを続けます。","「Keyや状態確認で最初の処理を調べます。」が正しいのは、Idempotency Keyや状態確認で最初の処理結果を調べるため。誤答1の「成功したか分からないまま別Keyで新しい注文を作ります。」は同じ注文か区別できない再作成になっている。誤答2の「状態確認をせず、無限にRetryを続けます。」は停止条件と結果確認を欠いた再送になっている。"],["停止条件が必要な理由は何ですか。","無限待ちや負荷の連鎖を防ぐためです。","Retry回数を無限に増やせば負荷の連鎖を防げます。","期限を設けるとServer資源を必ず長く占有します。","「無限待ちや負荷の連鎖を防ぐためです。」が正しいのは、無限待ちとRetryによる負荷の連鎖を止めるため。誤答1の「Retry回数を無限に増やせば負荷の連鎖を防げます。」は無限再送を防止策としている。誤答2の「期限を設けるとServer資源を必ず長く占有します。」は期限の効果を逆にしている。"]],
    checks:["Retry対象","Exponential Backoff","Jitter","副作用と重複","回数・期限・停止"],search:"Retry Exponential Backoff Jitter Thundering Herd 503 429 Circuit Breaker"
  });

  const c4 = ch("idempotency",4,"Idempotency / Idempotency Key","Idempotency / Idempotency Key：同じ命令を一度の結果にする","同じRequestが二度届いても、結果を一つに保つ仕組みがIdempotencyです。注文APIを例にKeyと保存状態を設計します。",{
    goals:["Idempotencyの意味","ClientがKeyを作る理由","ServerがKeyと結果を保存する流れ","timeout後の安全な再送"],
    why:`<p>通信では同じRequestが届くことがあります。${story}の後に無条件再送すると注文が二つになる可能性があります。</p><p>Keyと最初の結果を記録しないと、同じ決済Commandを二度実行しない保証を作れません。</p>`,
    example:`<p>Clientが<code>Idempotency-Key: K1</code>を付けます。ServerはK1を処理中へ保存し、注文と決済を成功させ、結果をKeyへ紐づけます。</p><p>同じK1で再送されたら新しい決済をせず、保存済みの注文結果を返します。別Keyなら別注文です。</p>
    <h3>同じキーで違う金額が送られたら</h3>
    <p>同じ注文の再送なら、最初の依頼と同じキーと同じ内容が届きます。キーが同じなのに金額が変わっていた場合、それを最初の注文として扱うと内容が食い違います。キーと一緒に依頼内容を照合できる情報を保持すれば、内容の違う再利用を検出できます。</p>
    <p>再送の設計では、キーが何を一件として識別するかを決めます。同じ操作の再試行には元のキーを使い、利用者が内容を変えて新しい操作を始める場合は区別できるキーを使います。</p>`,
    internal:`${chart("Key付き注文",[["Client","POST + Key K1"],["Server","K1を処理中へ保存"],["DB","注文・決済をcommit"],["Network","responseがLoss"],["Client","同じK1で再送"],["Server","保存結果を返す"]],"同じKeyなら同じ操作の再送と判定します。")}${table("Idempotency記録",[["K1","status=SUCCEEDED"],["request hash","金額・商品と一致"],["response","orderId=O100"],["期限","古いKeyを削除"]],"Keyと内容を検査します。")}<h3>状態設計</h3><p>処理中、成功、失敗を記録します。処理中なら待たせるか処理中と返し、成功済みなら同じResponseを返します。</p><h3>保存境界</h3><p>Key記録と注文保存を別々に行うと、片方だけ成功する穴ができます。DB Transaction、一意制約、Outboxなどを組み合わせます。</p>${callout("important","Keyの責任","Keyは再送を見分ける識別子です。Serverは有効期限、所有者、Request内容を検証します。")}`,
    web:`<p>決済、注文、メール送信、ファイル作成など副作用のあるAPIで重要です。GETはIdempotentに設計されることが多いですが、POSTは自動的にそうなりません。</p><p>第8部のRDBの一意IndexやTransaction、第11部のWorker再実行と組み合わせます。</p>`,
    lab:`${serverLab(3033, `const orders = new Map();
const server = http.createServer((request, response) => {
  const key = request.headers['idempotency-key'];
  if (!key) {
    response.statusCode = 400;
    response.end('missing idempotency key');
    return;
  }
  if (!orders.has(key)) {
    const orderId = 'O' + (orders.size + 100);
    console.log('created', orderId);
    orders.set(key, new Promise(resolve => {
      setTimeout(() => resolve({ orderId }), 600);
    }));
  }
  orders.get(key).then(order => response.end(JSON.stringify(order) + '\\n'));
});`, `curl --max-time 0.2 -H 'Idempotency-Key: K1' -X POST http://127.0.0.1:3033/
curl -H 'Idempotency-Key: K1' -X POST http://127.0.0.1:3033/
curl -H 'Idempotency-Key: K2' -X POST http://127.0.0.1:3033/`,
    "初回がタイムアウトしてから、同じキーで再送し、別のキーでも一回送ります。",
    "K1の再送はO100、K2はO101を返します。端末1の created O100 は一回だけです。",
    "同じキーには処理中から同じ結果を対応付けます。比較はキーだけを使う小さなモデルです。")}${experiment("Java / localhost","cat > KeyCheck.java <<'EOF'\nimport java.util.*;class KeyCheck{public static void main(String[]x){Map<String,String>m=new HashMap<>();m.putIfAbsent(\"K1\",\"O100\");m.putIfAbsent(\"K1\",\"O200\");System.out.println(m);}}\nEOF\njavac KeyCheck.java && java KeyCheck","JavaのputIfAbsentでKey重複を確認します。","K1がO100のまま変わらない点に注目します。","一意Keyと結果再利用の基本を確認できます。")}`,
    misunderstandings:[["同じ内容ならKeyは不要です。","同じ内容でも別注文の可能性があるため、操作単位のKeyが必要です。"],["Keyだけで外部決済もExactly-onceです。","外部システムとの境界には状態確認や補償が必要です。"]],
    questions:[["Idempotencyとは何ですか。","同じ操作を複数回受けても結果が一回分になる性質です。","同じ操作を複数回受けると回数分の結果を作る性質です。","同じ操作は必ずServerへ一度しか届かない性質です。","「同じ操作を複数回受けても結果が一回分になる性質です。」が正しいのは、同じ操作を複数回受けても効果を一回分に保つ性質だから。誤答1の「同じ操作を複数回受けると回数分の結果を作る性質です。」は重複の効果をそのまま増やしている。誤答2の「同じ操作は必ずServerへ一度しか届かない性質です。」はネットワーク配送回数そのものを一回に保証している。"],["Keyの役割は何ですか。","同じ操作の再送を見分ける識別子です。","Request内容を暗号化するための秘密鍵です。","Retryを行うたび新しい操作として番号を変える識別子です。","「同じ操作の再送を見分ける識別子です。」が正しいのは、同じ操作の再送を同一操作として見分けるため。誤答1の「Request内容を暗号化するための秘密鍵です。」は暗号化鍵と操作識別子を混同している。誤答2の「Retryを行うたび新しい操作として番号を変える識別子です。」は再送を別操作にする番号としている。"],["同じKeyで内容が違うRequestを受けたらどうしますか。","不正として拒否します。","内容が違っても最初の結果をそのまま返します。","内容が違っても新しい注文として受け付けます。","「不正として拒否します。」が正しいのは、同じKeyが別の内容に使われた不正な再利用なので拒否するため。誤答1の「内容が違っても最初の結果をそのまま返します。」は内容不一致を黙って同じ結果にしている。誤答2の「内容が違っても新しい注文として受け付けます。」はKeyを変えず別注文として処理している。"],["成功済みKeyへ再送したとき何を返しますか。","保存済みの同じ結果です。","同じ操作をもう一度実行して新しい結果を作ります。","成功済みでも常にtimeoutエラーだけを返します。","「保存済みの同じ結果です。」が正しいのは、保存済みの結果を再利用して副作用を増やさないため。誤答1の「同じ操作をもう一度実行して新しい結果を作ります。」は成功済み操作を再実行している。誤答2の「成功済みでも常にtimeoutエラーだけを返します。」は結果確認を失敗扱いに固定している。"],["Keyに期限を持たせる理由は何ですか。","古いRetryを永遠に同じ操作と扱わないためです。","古いRetryも永久に同じ操作として受け付けるためです。","期限を付けると同じ処理中のRetryを別操作にします。","「古いRetryを永遠に同じ操作と扱わないためです。」が正しいのは、古いRequestをいつまでも同じ操作として扱わないため。誤答1の「古いRetryも永久に同じ操作として受け付けるためです。」は期限の目的を無期限保持としている。誤答2の「期限を付けると同じ処理中のRetryを別操作にします。」は有効期間中の重複防止と逆にしている。"]],
    checks:["Idempotency","Keyと結果の保存","処理中・成功・失敗","一意制約","外部副作用の限界"],search:"Idempotency Idempotency-Key POST retry order payment duplicate unique constraint"
  });

  const c5 = ch("delivery-semantics",5,"At-most-once / At-least-once / Exactly-once","At-most-once / At-least-once / Exactly-once：配送回数の考え方","Messageが何回届くかと、仕事が何回実行されるかは別です。Exactly-onceを安易に約束せず、重複に強い処理を組み立てます。",{
    goals:["At-most-onceとAt-least-once","Exactly-onceが難しい理由","Ackの前後で起きる失敗","重複排除とIdempotent Consumer"],
    why:`<p>WorkerがDBへ保存してからAckを返すとき、保存後にWorkerが落ちるとBrokerは再配信します。${story}と同じ結果不明がQueueでも起きます。</p><p>先にAckすると、保存前のCrashでMessageを失います。</p>`,
    example:`<p>At-most-onceは最大一回で、失う可能性があります。At-least-onceは少なくとも一回で、重複します。</p><p>Exactly-onceはMessageが一回届く意味ではなく、複数回届いても外から見た効果が一回になる意味で使われる場合があります。保証範囲を定義します。</p>
    <h3>処理した直後にAckが失われたら</h3>
    <p>Workerが通知の送信を終え、QueueにAckを返す直前に止まったとします。Queueは完了を確認できないので、再配信する仕様なら、別のWorkerが同じ依頼を受け取ります。処理済みかどうかは、メッセージの配信回数だけからは判断できません。</p>
    <p>一回に抑えたい効果が「通知を送る」ことなら、処理の記録と送信先の仕組みを合わせて考えます。Queue内での保証が、外部への送信や保存まで及ぶかも確認しましょう。</p>`,
    internal:`${chart("Ack前に落ちた場合",[["Receive","Workerが読む","input"],["Process","DBへ保存","store"],["Crash","Ack前に停止","error"],["Broker","同じMessageを再配信","wait"],["Consumer","重複をKeyで検出","process"],["結果","効果は一回分","store"]],"At-least-onceでは再配信を前提にし、Consumer側で重複へ耐えます。", {animate:true})}${table("配送の比較",[["At-most-once","失う可能性があるが、再配信は抑える"],["At-least-once","失いにくいが、重複がある"],["Exactly-once","どの範囲の効果を一回にするか定義が必要"],["実用策","Idempotency + 一意制約 + Transaction"]],"左は配送の保証、右はその保証で考える必要がある結果です。配送が2回でも、Consumerが二重処理を防げばDBへの反映が1回になることがあります。")}<h3>段階1：先にAckする場合</h3><p>処理前にAckすると再配信は減りますが、Ack直後にWorkerが落ちると仕事を失います。これはAt-most-once寄りの選択です。</p><h3>段階2：処理後にAckする場合</h3><p>DB保存後にAckすれば仕事を失いにくくなります。ただし保存後・Ack前に落ちると再配信されるため、同じevent IDを二度適用しない仕組みが必要です。</p><h3>段階3：Exactly-onceの境界</h3><p>Broker内で一回に見えても、DB保存と外部メール送信を一つのTransactionにできなければ片方だけ成功します。Outbox、重複排除、状態確認、補償処理を組み合わせます。</p>${callout("warning","言い過ぎない約束","配送、Consumer、DB、外部副作用のどこまで保証するかを定義します。")}`,
    web:`<p>第11部のWorker再起動はAt-least-onceの再実行を起こします。第8部のRDBで一意制約を置き、同じevent_idを二度適用しないConsumerにします。</p><p>一回だけ処理したい要件は配送方式だけでなくCommandのIdempotencyとして設計します。</p>`,
    lab:`${experiment("localhost / Node.js","node - <<'EOF'\nconst ms=[{id:'E1'},{id:'E1'}],done=new Set();for(const m of ms){if(done.has(m.id)){console.log('duplicate ignored');continue}console.log('apply',m.id);done.add(m.id)}\nEOF","同じevent IDを二度受けるConsumerを動かします。","二回目がignoredになる点に注目します。","At-least-onceでも効果を一回にする基本を確認できます。")}${experiment("Redis任意 / localhost","redis-cli set event:E1 done NX\nredis-cli set event:E1 done NX\nredis-cli get event:E1","RedisのNXで重複記録を確認します。","未導入なら実行せずNode実験を使います。","一意event IDを保存する例を見られます。")}`,
    misunderstandings:[["At-least-onceなら仕事は一度だけです。","再配信で重複実行され、Consumerの重複排除が必要です。"],["Exactly-onceなら外部メールも一度だけです。","外部システムとの境界を一つのTransactionにできない場合があります。"]],
    questions:[["At-most-onceの弱点は何ですか。","Messageや仕事を失う可能性です。","失敗してもMessageを必ず再送し、重複だけを防ぎます。","Messageが必ず一度はWorkerへ届く保証です。","「Messageや仕事を失う可能性です。」が正しいのは、再送しない設計ではMessageや仕事を失う可能性があるため。誤答1の「失敗してもMessageを必ず再送し、重複だけを防ぎます。」は配送保証と重複防止の特徴を逆にしている。誤答2の「Messageが必ず一度はWorkerへ届く保証です。」はAt-least-onceの保証と取り違えている。"],["At-least-onceの弱点は何ですか。","同じMessageが重複する可能性です。","同じMessageを絶対に二度届けない保証です。","Messageが失われても再配信しない方式です。","「同じMessageが重複する可能性です。」が正しいのは、再配信で届く一方、同じMessageが重複する可能性があるため。誤答1の「同じMessageを絶対に二度届けない保証です。」は重複を防ぐ保証としている。誤答2の「Messageが失われても再配信しない方式です。」は再配信をしない方式としている。"],["Ack前にWorkerが落ちると何が起きますか。","Brokerが再配信することがあります。","Ack前に落ちてもBrokerは処理済みと確定し削除します。","Workerが落ちたMessageは再配信されません。","「Brokerが再配信することがあります。」が正しいのは、Ackを受け取れないためBrokerが未処理とみなし再配信することがあるから。誤答1の「Ack前に落ちてもBrokerは処理済みと確定し削除します。」はAck未受信でも確定削除するとしている。誤答2の「Workerが落ちたMessageは再配信されません。」は再配信の契機を無視している。"],["Exactly-onceの保証範囲を定義する理由は何ですか。","DBや外部副作用を一つのTransactionにできない場合があるためです。","DBや外部副作用まで常に一つのTransactionにできます。","Exactly-onceは全ての障害で同じ結果を自動保証します。","「DBや外部副作用を一つのTransactionにできない場合があるためです。」が正しいのは、Queue内の重複防止と外部副作用の実行は別なので保証範囲を分けるため。誤答1の「DBや外部副作用まで常に一つのTransactionにできます。」は外部副作用も自動的に同一Transactionになるとしている。誤答2の「Exactly-onceは全ての障害で同じ結果を自動保証します。」は障害条件や範囲を無視している。"],["Idempotent Consumerとは何ですか。","同じMessageでも効果を一回にするConsumerです。","同じMessageを受けるたび必ず二回効果を適用します。","重複Messageを検出せず到着順だけで処理します。","「同じMessageでも効果を一回にするConsumerです。」が正しいのは、同じMessageを複数回受けても結果への効果を一回にするため。誤答1の「同じMessageを受けるたび必ず二回効果を適用します。」は重複効果を増やす処理としている。誤答2の「重複Messageを検出せず到着順だけで処理します。」は重複判定を行わない処理としている。"]],
    checks:["三つの配送概念","AckとCrash","重複排除","Exactly-onceの境界","Outboxと補償"],search:"At-most-once At-least-once Exactly-once ack broker consumer duplicate dedup Outbox"
  });

  const c6 = ch("queue-pubsub",6,"Queue / PubSub","Queue / PubSub：仕事と出来事の流れ","Queueは一つの仕事を誰かが処理する流れ、PubSubは複数の購読者へ出来事を配る流れです。Backpressureと再処理も含めて使い分けます。",{
    goals:["QueueとPubSubの違い","Producer・Consumer・Subscriber","Queueによる負荷吸収","順序、再処理、Dead Letter"],
    why:`<p>画像変換やメールをHTTP内で全て行うと応答が長くなります。Queueへ仕事を置けば、APIは受付だけを短く返せます。</p><p>${story}の後に同じ注文をQueueへ二つ置かないよう、event IDを使います。</p>`,
    example:`<p><code>OrderCreated{eventId:E1}</code>をQueueへ置きます。Workerは取り出して処理し、完了後にAckします。在庫、メール、分析へ配るならPubSubです。</p><p>Producerが速すぎるとQueueが伸びます。受付制限やBackpressureが必要です。</p>
    <h3>注文を誰が何回受け取るか</h3>
    <p>注文の配送依頼を一つのWorkerが担当してほしい場合は、同じQueueを複数Workerで分担できます。同じ注文が成立した事実を在庫・通知・分析のそれぞれが使いたい場合には、購読先ごとに受け取れる構成にします。</p>
    <p>依頼を作るときは、処理を分担したい相手と、事実を共有したい相手を書き分けましょう。通知が詰まっても他の処理を進めたいなら、どの購読先に未処理のイベントが残っているかを確認できると役立ちます。</p>`,
    internal:`${chart("Queueの流れ",[["Producer","enqueue"],["Broker","保持"],["Worker","dequeue"],["Ack","完了通知"],["Retry","再配信"]],"QueueはProducerとWorkerを分けます。")}${table("PubSubの分岐",[["Event E1","OrderCreated"],["Inventory","在庫を減らす"],["Mail","確認メール"],["Analytics","集計へ送る"],["各Subscriber","独立Ack"]],"一つのEventを複数のSubscriberが受け取ります。")}<h3>Backpressure</h3><p>Producerが毎秒1000件、Workerが毎秒100件ならQueueは毎秒900件伸びます。長さ、最古Messageの年齢、失敗数を監視します。</p><h3>Dead Letter</h3><p>何度も失敗するMessageを通常Queueから分ける場所をDead Letter Queueと呼びます。原因修正後の再処理に備えます。</p>${callout("note","順序の注意","Queue全体、同じKey内、各Subscriberの順序は別です。必要な範囲だけ順序を要求します。")}`,
    web:`<p>第3部のPacketのLossは通信の問題、Queueは業務のRetryと再処理を扱います。第11部でWorker Podを増やしても、DBや外部APIの上限まで増やすとは限りません。</p>`,
    lab:`${experiment("localhost / Node.js","node - <<'EOF'\nconst q=[];for(let i=1;i<=5;i++)q.push({id:'E'+i});while(q.length)console.log('worker',q.shift().id)\nEOF","小さなQueueとWorkerを動かします。","enqueue順とdequeue順を確認します。","Queueが処理速度を分離する箱だと分かります。")}${serverLab(3034, `const server = http.createServer((request, response) => {
  response.statusCode = 202;
  response.end('accepted\\n');
  console.log('accepted work');
  setTimeout(() => console.log('worker finished'), 1000);
});`, "curl -i -X POST http://127.0.0.1:3034/events",
    "依頼の受付と処理の完了を別の時点として観察します。",
    "端末2に202と accepted が返ったあと、端末1に worker finished が出ます。",
    "受付の応答で仕事が完了したとは判断できません。ここではタイマーで後続処理を表しています。")}`,
    misunderstandings:[["Queueへ入ればすぐ処理されます。","Workerの能力や障害で待ち時間が伸びます。"],["PubSubの全Subscriberは同じ速度と順序です。","Subscriberごとに遅延、Retry、Ack、順序が異なります。"]],
    questions:[["Queueの目的は何ですか。","ProducerとWorkerを分け、仕事を一時保持することです。","ProducerとWorkerを同じ処理に固定し、仕事を保持しません。","Queueは結果を即時に全Subscriberへ配る仕組みです。","「ProducerとWorkerを分け、仕事を一時保持することです。」が正しいのは、ProducerとWorkerを分け、仕事を一時的に保持するため。誤答1の「ProducerとWorkerを同じ処理に固定し、仕事を保持しません。」は非同期の仕事保持を否定している。誤答2の「Queueは結果を即時に全Subscriberへ配る仕組みです。」はPubSubの配布と混同している。"],["PubSubの特徴は何ですか。","一つのEventを複数Subscriberへ配ることです。","一つのEventを一人のSubscriberだけへ届けます。","Eventを保存せずProducerへだけ返します。","「一つのEventを複数Subscriberへ配ることです。」が正しいのは、一つのEventを複数Subscriberへ配れるため。誤答1の「一つのEventを一人のSubscriberだけへ届けます。」は複数購読者への配布を一人に限定している。誤答2の「Eventを保存せずProducerへだけ返します。」はSubscriberへの配布をProducerへの返却としている。"],["Queue長が増え続ける理由は何ですか。","ProducerがConsumerより速いからです。","ConsumerがProducerより速く仕事を処理しているためです。","Producerが止まっているためです。","「ProducerがConsumerより速いからです。」が正しいのは、Producerの生成速度がConsumerの処理速度を上回るため。誤答1の「ConsumerがProducerより速く仕事を処理しているためです。」は流入と処理の速さを逆にしている。誤答2の「Producerが止まっているためです。」はQueue増加をProducer停止の結果としている。"],["Dead Letter Queueの用途は何ですか。","何度も失敗するMessageを分け、調査や再処理を行うことです。","成功したMessageを先に集めて通常処理へ戻すためです。","失敗Messageを削除し、調査記録も残さないためです。","「何度も失敗するMessageを分け、調査や再処理を行うことです。」が正しいのは、繰り返し失敗するMessageを分けて調査や再処理を行うため。誤答1の「成功したMessageを先に集めて通常処理へ戻すためです。」は成功Messageの通常処理としている。誤答2の「失敗Messageを削除し、調査記録も残さないためです。」は失敗原因を調べる機会まで消している。"],["timeout後の注文でevent IDを使う理由は何ですか。","Queue上の重複イベントを見分けるためです。","重複Eventを別の新規注文として増やすためです。","event IDでQueueの順番を暗号化するためです。","「Queue上の重複イベントを見分けるためです。」が正しいのは、同じEventの重複配信を見分けるため。誤答1の「重複Eventを別の新規注文として増やすためです。」は重複判定を新規作成に使っている。誤答2の「event IDでQueueの順番を暗号化するためです。」は識別子を暗号用途としている。"]],
    checks:["QueueとPubSub","Producer/Worker/Subscriber","Backpressure","Dead Letter","event ID"],search:"Queue PubSub Producer Consumer Subscriber Backpressure Dead Letter event retry Kubernetes Worker"
  });

  const c7 = ch("cache-invalidation",7,"Cache / Cache Invalidation","Cache / Cache Invalidation：速さと古さの交換","Cacheはよく使うデータを近くに置いて応答を速くします。しかし元データが変わった後、古い値をいつまで見せるかが難題です。",{
    goals:["Cache HitとCache Miss","TTLと古いデータ","Cache Invalidationの難しさ","timeout・Retryと古い結果"],
    why:`<p>商品詳細を毎回DBから読むと負荷がかかります。Cacheへ置けば同じ問い合わせに速く答えられます。</p><p>一方、無効化を設計しないCacheは価格や在庫を古く表示します。${story}の後に古い注文状態を返す危険もあります。</p>`,
    example:`<p><code>product:42</code>を60秒保存します。最初はMissでDBから読み、次はHitで返します。価格更新時にKeyを削除するか上書きします。</p><p>削除通知がReplicaへ届かないと古い値が残ります。TTLは古さの上限ですが、更新直後の最新を保証しません。</p>
    <h3>削除した直後に古い値が戻る場合</h3>
    <p>商品価格を100円から120円へ変える途中を考えます。更新前に古い価格をDBから読んだ処理が遅れている間に、別の処理が120円を確定してキャッシュを消します。その後、遅れていた処理が読み取った100円をキャッシュへ保存すると、古い値がまた見える場合があります。</p>
    <p>キャッシュの正しさを考えるときは、削除する順番に加え、遅れて完了する読み取りも追いましょう。価格の版を比較する設計なら、古い読み取り結果で新しい版のキャッシュを置き換えることを防ぐ判断に使えます。</p>`,
    internal:`${chart("Cache Read",[["API","Keyを要求"],["Cache","Hitなら返す"],["Miss","DBを読む"],["Cache","TTL保存"],["Client","値を受ける"]],"Hitは速い一方、保存時点の値を返します。")}${table("Invalidation経路",[["Update","DBを更新"],["Delete","Key削除"],["Replica","別Nodeへ通知"],["失敗","古いKeyが残る"],["TTL","期限後Miss"]],"通知失敗にTTLやVersionを組み合わせます。")}<h3>Cache戦略</h3><p>Cache-asideではAPIがMiss時にDBを読みCacheへ入れます。Write-throughなど方式ごとに失敗時の状態が違います。</p><h3>古さの扱い</h3><p>TTL、Version、更新時刻をResponseへ含めます。注文や在庫のように正確さが必要な値は、Cacheを使わず確認APIへ問い合わせます。</p>${callout("important","Invalidateの現実","Cache Invalidationは分散通信です。TTL、Version、再構築を組み合わせます。")}`,
    web:`<p>第11部の複数PodがローカルCacheを持つと、Podごとに値が違います。Redisなど共有Cacheでも障害時のFallbackと負荷集中を決めます。</p><p>第8部のRDBが正しい元データで、Cacheは読み取りの近道です。</p>`,
    lab:`${experiment("localhost / Node.js","node - <<'EOF'\nconst c=new Map(),db={price:100};function r(){if(c.has('p'))console.log('hit',c.get('p'));else{c.set('p',db.price);console.log('miss',db.price)}}r();r();db.price=120;r();c.delete('p');r();\nEOF","Hit、更新後の古い値、削除後の再読込を確認します。","DBを120にしてもCacheが100を返す点に注目します。","Invalidationが必要な理由を体験できます。")}${experiment("Redis任意 / localhost","redis-cli set product:42 100 EX 10\nredis-cli get product:42\nredis-cli del product:42","RedisのKey、TTL、削除を確認します。","未導入ならNode実験を使います。","TTLと明示削除の例を見られます。")}`,
    misunderstandings:[["CacheはDBと常に同じです。","更新通知の遅延や失敗で古いことがあります。"],["TTLを短くすれば問題はなくなります。","DB負荷、Stampede、更新直後のずれは残ります。"]],
    questions:[["Cache Hitとは何ですか。","Cacheの値をDBなしで返せる状態です。","Cacheに値がなくDBへ必ず読み込みに行く状態です。","Cacheの値を使わず毎回最新DBだけを読む状態です。","「Cacheの値をDBなしで返せる状態です。」が正しいのは、Cacheの値を使いDB読込なしで返せる状態だから。誤答1の「Cacheに値がなくDBへ必ず読み込みに行く状態です。」はHitとMissを逆にしている。誤答2の「Cacheの値を使わず毎回最新DBだけを読む状態です。」はCacheを使わない読み方としている。"],["Cache Missで何をしますか。","元DBから読みCacheへ保存します。","Cacheの古い値だけを返しDBを確認しません。","Cache Miss時にDBの変更を削除します。","「元DBから読みCacheへ保存します。」が正しいのは、元DBから読み、取得した値をCacheへ保存するため。誤答1の「Cacheの古い値だけを返しDBを確認しません。」はMissでもCacheの古い値を返すとしている。誤答2の「Cache Miss時にDBの変更を削除します。」は読み取り処理を削除操作としている。"],["TTLの役割は何ですか。","古い値が残る最長時間を制限します。","古い値を無期限に残すためです。","TTLはDBの更新を即時に全Clientへ通知する時間です。","「古い値が残る最長時間を制限します。」が正しいのは、古い値を使える最長時間を区切るため。誤答1の「古い値を無期限に残すためです。」は期限の役割を無期限保持にしている。誤答2の「TTLはDBの更新を即時に全Clientへ通知する時間です。」はCache更新通知と有効期限を混同している。"],["更新後に古い値が返る理由は何ですか。","削除や更新通知が届いていないためです。","更新通知が届かなくてもCacheは自動で必ず新しくなります。","古い値が返るのはDBの更新が失敗したときだけです。","「削除や更新通知が届いていないためです。」が正しいのは、Cacheの削除や更新通知がまだ届いていない可能性があるため。誤答1の「更新通知が届かなくてもCacheは自動で必ず新しくなります。」は通知遅延を無視している。誤答2の「古い値が返るのはDBの更新が失敗したときだけです。」はCacheの状態ではなくDB失敗だけを原因としている。"],["Cacheを使わず確認APIを呼ぶ場面は何ですか。","注文や在庫など最新状態が重要な場面です。","いつでもCacheだけを読むことで最新状態を保証します。","静的な画像のように古さが問題にならない情報へ使います。","「注文や在庫など最新状態が重要な場面です。」が正しいのは、注文や在庫のように最新状態の確認が重要な場面だから。誤答1の「いつでもCacheだけを読むことで最新状態を保証します。」は最新性が必要な場面でCacheだけを使っている。誤答2の「静的な画像のように古さが問題にならない情報へ使います。」は更新頻度より古さが問題にならない情報を選んでいる。"]],
    checks:["Hit/Miss","TTL","Cache-aside","Invalidation失敗","DBとCacheの責任"],search:"Cache Hit Miss TTL Cache Invalidation cache-aside Redis stale version"
  });

  const c8 = ch("replication-consistency",8,"Replication / Consistency","Replication / Consistency：コピーと見え方","Replicaを作ると読み取りや障害に強くなります。一方、コピーが同時に同じ値になるとは限りません。",{
    goals:["Leader-Followerの役割","同期・非同期Replication","StrongとEventual Consistency","timeout後のWrite確認とRead先"],
    why:`<p>一台のDBだけだと、そのDBが止まったとき読み書きできません。Replicaを作れば読み取りを分散できます。</p><p>非同期Replicationでは、Leaderが成功を返した直後にFollowerへまだ届かないことがあります。${story}の後、Followerに注文がない可能性があります。</p>`,
    example:`<p>LeaderへO100を書き成功を返します。複製が100ms遅れている間にFollowerへGETするとNot Foundになることがあります。後で見える状態がEventual Consistencyです。</p><p>Strong Consistencyでは必要なReplicaの確認を待つため、最新を見やすい一方で遅延が増えます。</p>
    <h3>保存直後に自分の投稿を読みたい</h3>
    <p>投稿画面がLeaderから保存成功を受けた後、一覧はFollowerから読むとします。複製が追いつく前に一覧を開くと、自分の投稿がまだ見えない場合があります。少し時間を置いて、同じFollowerで変更が反映された後に読めば見えるようになります。</p>
    <p>保存した利用者には直後にも見せたいなら、直後の読み取り先や、必要な版まで反映したかを確認する方法を設計します。すべての一覧に同じ新しさを求めるのか、投稿した本人の直後の操作で必要なのかを分けられます。</p>`,
    internal:`${chart("Leader-Follower",[["Client","Write O100"],["Leader","commit、ACK"],["Follower","Replication中"],["Client","別ReplicaをRead"],["結果","一時Not Found"],["収束","FollowerもO100"]],"Write成功と全Replica一致に時間差があります。")}${table("Consistency比較",[["Strong","確認後は最新を読む"],["Eventual","時間で一致する"],["Read-after-write","自分のWriteを見る"],["対策","Leader Read / Version"]],"必要な読み取り保証を機能ごとに選びます。")}<h3>LeaderとFollower</h3><p>Leaderは書込み順を決め、Followerは変更を複製します。FollowerをRead専用にすると負荷を減らせますが、遅延した値を返します。</p><h3>収束確認</h3><p>VersionやCommit番号をResponseへ含め、必要Version以上のReplicaを読みます。timeout後はLeaderや状態APIへ問い合わせます。</p>${callout("note","Eventualの意味","すぐ一致ではなく、更新が伝われば最終的に一致する性質です。")}`,
    web:`<p>第8部のRDBではRead ReplicaのLagやFailoverを監視します。第11部のKubernetes ReplicaはPodのコピーで、DBデータのReplicationとは別です。</p><p>注文確認はLeader、検索一覧はFollowerというように許容する古さを決めます。</p>`,
    lab:`${experiment("localhost / Node.js","node - <<'EOF'\nlet l={v:0,o:[]},f={v:0,o:[]};l.v++;l.o.push('O100');console.log('leader',l);console.log('follower',f);f={...l,o:[...l.o]};console.log('replicated',f);\nEOF","Leader直後のFollowerと収束を確認します。","複製前は注文がなく、後で見える点に注目します。","Replication Lagを安全に体験できます。")}${experiment("Java / localhost","cat > ReplicaVersion.java <<'EOF'\nclass ReplicaVersion{public static void main(String[]x){int leader=5,follower=4;System.out.println(\"need >= \"+leader+\", actual \"+follower);}}\nEOF\njavac ReplicaVersion.java && java ReplicaVersion","VersionでReplicaの古さを判定します。","要求Version 5にFollower 4が足りない点を確認します。","Read-after-writeのVersion設計を試せます。")}`,
    misunderstandings:[["Replicaが増えればどのReadも最新です。","非同期ReplicationではFollowerが遅れます。"],["Kubernetes ReplicaとDB Replicaは同じです。","前者はPod、後者はデータ変更のコピーです。"]],
    questions:[["Leaderの役割は何ですか。","書込みを受け変更順を決めることです。","全Followerへ同じ書込みを同時に命令するだけです。","読み取りだけを担当し変更順は決めません。","「書込みを受け変更順を決めることです。」が正しいのは、書込みを受け付けて変更の順序を決めるため。誤答1の「全Followerへ同じ書込みを同時に命令するだけです。」はLeaderの合意形成を単なる一斉命令にしている。誤答2の「読み取りだけを担当し変更順は決めません。」は書込み順序の担当を読み取り専用にしている。"],["Follower Readの代償は何ですか。","Replication Lagで古い値を返す可能性です。","Follower Readは常にLeaderより新しい値を返します。","Follower ReadはReplication遅延の影響を受けません。","「Replication Lagで古い値を返す可能性です。」が正しいのは、Replication Lagにより古い値を返す可能性があるため。誤答1の「Follower Readは常にLeaderより新しい値を返します。」はFollowerの値が新しいと逆にしている。誤答2の「Follower ReadはReplication遅延の影響を受けません。」は複製遅延を無視している。"],["Eventual Consistencyとは何ですか。","更新が伝われば最終的に一致する性質です。","更新直後から全Replicaが同じ値を返します。","一つのReplicaが更新を拒否すると永久に不一致になります。","「更新が伝われば最終的に一致する性質です。」が正しいのは、更新が各Replicaへ伝われば最終的に一致する性質だから。誤答1の「更新直後から全Replicaが同じ値を返します。」は収束までの時間をゼロとしている。誤答2の「一つのReplicaが更新を拒否すると永久に不一致になります。」は最終的な収束と永久不一致を混同している。"],["timeout後FollowerがNot Foundならどうしますか。","Leaderや状態APIで結果を確認します。","Not Foundなら注文が必ず失敗したと決めます。","FollowerのNot Foundを正しい最新結果としてClientへ返します。","「Leaderや状態APIで結果を確認します。」が正しいのは、Leaderや状態APIで処理結果を確認し、Replica遅延を切り分けるため。誤答1の「Not Foundなら注文が必ず失敗したと決めます。」はFollowerの一時的な不在を失敗確定としている。誤答2の「FollowerのNot Foundを正しい最新結果としてClientへ返します。」は遅延したReplicaの返事を最終結果としている。"],["Version番号の用途は何ですか。","必要な更新までReplicaが追いついたか判断することです。","Versionが小さくてもReplicaが必ず最新です。","Version番号はClientのRetry回数だけを数えます。","「必要な更新までReplicaが追いついたか判断することです。」が正しいのは、必要な変更番号までReplicaが適用できたか判断するため。誤答1の「Versionが小さくてもReplicaが必ず最新です。」は番号の大小と追いつき具合を逆にしている。誤答2の「Version番号はClientのRetry回数だけを数えます。」は複製状態ではなくRetry回数としている。"]],
    checks:["Leader-Follower","同期・非同期","Eventual Consistency","Read-after-write","Kubernetes Replicaとの違い"],search:"Replication Leader Follower consistency strong eventual lag read-after-write version RDB"
  });

  const c9 = ch("distributed-lock-cap",9,"Distributed Lock / CAP Theorem","Distributed Lock / Split Brain / CAP Theorem：分散協調の限界","複数Workerが同じ仕事を取らないようLockを使います。しかし通信分断で二人のLeaderが生まれるSplit Brainが起きます。CAPは三つ全部を自由に選べる標語ではありません。",{
    goals:["Distributed LockとLease","Split Brainの因果","CAPのConsistency・Availability・Partition tolerance","CAPを常に二つだけ選ぶと誤読しないこと"],
    why:`<p>同じ請求書を二つのWorkerが処理すると二重決済です。Lockがあれば一人だけが実行できます。</p><p>通信が切れたとき古いWorkerと新しいWorkerが同時に所有者になる可能性があります。${story}の結果不明に加え、二つの所有者が生まれるのがSplit Brainです。</p>`,
    example:`<p>Worker Aが<code>job:O100</code>を30秒Leaseします。Aが停止したら期限後にBが取得できます。Aが復帰しても、古いLeaseでDBを書けないようFence Tokenを確認します。</p><p>CAPのPは通信分断が起きても動く前提です。分断時にConsistencyを優先して片側を止めるか、Availabilityを優先して返事を続けるかを選びます。</p>
    <h3>期限切れのWorkerが戻ってきたら</h3>
    <p>Worker Aが処理途中で止まり、Leaseが切れた後にBが同じ仕事を引き受けます。Bが更新した後でAが復帰すると、Aには自分のほうが後から書き込もうとしている事情が見えないことがあります。</p>
    <p>更新先が新しい取得順を示す番号を記録し、古い番号の更新を拒否する設計なら、遅れて復帰したAの書き込みを区別できます。ロックを持つつもりのWorker側と、書き込みを受け付ける側のどこで正しさを判断するかがポイントです。</p>`,
    internal:`${chart("Split Brainが起きる流れ",[["Leader A","期限付きLockを保持","store"],["Network","Aとの通信が分断","error"],["Leader B","期限切れと見て新しいLockを取得","process"],["両者","同じJobを実行","error"],["DB","新しいFence Tokenだけ許可","process"],["結果","古いAの書き込みを拒否","store"]],"Lockだけでは古い所有者が止まったと保証できません。世代番号であるFence TokenをDB側でも確認します。", {animate:true})}<h3>問題1：仕事を一人へ任せる</h3><p>Lockは所有者を一人にし、Leaseはその権利へ期限を付けます。やさしく言えば『期限付きの鍵』です。しかし、止まっていた古いWorkerが期限後に動き出す可能性があります。新しい所有者ほど大きな番号を持つFence Tokenを使い、保存先で古い番号を拒否します。</p><h3>問題2：通信分断中に返事をするか</h3>${table("CAPの三要素",[["C Consistency","どのNodeから見ても矛盾しない値を優先"],["A Availability","届いたRequestへ返事することを優先"],["P Partition tolerance","Node間の通信分断を前提に動き続ける"],["分断時の選択","CとAのどちらを優先するか決める"]],"CAPはLockの実装方法ではなく、通信分断中のサービス判断を整理する考え方です。")}<p>CAPを『三つからいつでも二つ選ぶ』と覚えるのは不正確です。Partitionが起きた場面で、一貫しない可能性があっても返事をするか、正しさのために一部の返事を止めるかを考えます。</p>${callout("important","二つを混ぜない","Distributed Lockは同じ仕事の所有者を調整し、CAPは通信分断時の応答方針を整理します。どちらにもIdempotency、Fence、DB制約、状態確認を重ねます。")}`,
    web:`<p>第11部のKubernetesではLeaseでControllerの担当を一人にします。古いControllerの書込みをResource Versionで拒否する設計も使います。</p><p>第8部の一意制約やTransactionは、分散Lockが破れても最後の防波堤です。第3部のRouting障害はPartitionの原因になります。</p>`,
    lab:`${experiment("localhost / Node.js","node - <<'EOF'\nconst l={owner:null,until:0,token:0};function a(w,t){if(t>=l.until){l.owner=w;l.until=t+30000;l.token++;return {ok:true,token:l.token}}return {ok:false,owner:l.owner}}console.log(a('A',0));console.log(a('B',1000));console.log(a('B',31000));\nEOF","期限付きLockとFence Tokenの簡易モデルを動かします。","期限前はBが失敗し、期限後にTokenが増えます。","Leaseと世代番号を確認できます。")}${experiment("Redis任意 / localhost","redis-cli set lock:job:O100 workerA NX EX 30\nredis-cli get lock:job:O100","RedisのNXとEXの例を確認します。","未導入ならNode実験を使います。","共有Lockの保存場所と期限の一例です。")}`,
    misunderstandings:[["Lockを取れたら仕事は必ず一回だけです。","期限切れや分断で古いWorkerが復帰するためFenceとIdempotencyが必要です。"],["CAPは三つのうち常に二つだけ実現できます。","Partition発生時のCとAの選択という文脈で読みます。"]],
    questions:[["Leaseとは何ですか。","期限付きで資源を所有する仕組みです。","期限なしで資源を永久に所有する仕組みです。","Leaseは全Nodeへ同時に書込みを許可する仕組みです。","「期限付きで資源を所有する仕組みです。」が正しいのは、期限が切れると所有権を見直せる期限付きの所有だから。誤答1の「期限なしで資源を永久に所有する仕組みです。」は期限付きという特徴をなくしている。誤答2の「Leaseは全Nodeへ同時に書込みを許可する仕組みです。」は一つの所有者を決める仕組みと逆にしている。"],["Split Brainとは何ですか。","複数Nodeが同時にLeaderと誤認する状態です。","全NodeがLeaderを一つだけ正しく認識する状態です。","Leaderがいなくなり全ての書込みが安全に停止した状態です。","「複数Nodeが同時にLeaderと誤認する状態です。」が正しいのは、複数Nodeが同時に自分をLeaderだと誤認する状態だから。誤答1の「全NodeがLeaderを一つだけ正しく認識する状態です。」は複数Leaderの危険を単一Leaderとしている。誤答2の「Leaderがいなくなり全ての書込みが安全に停止した状態です。」はLeader不在の停止状態としている。"],["Fence Tokenの用途は何ですか。","古い所有者の書込みをDB側で拒否することです。","古い所有者のTokenでも新しい書込みを受け入れます。","Fence TokenはCacheのTTLを延ばす値です。","「古い所有者の書込みをDB側で拒否することです。」が正しいのは、DB側でTokenを比較し古い所有者の書込みを拒否するため。誤答1の「古い所有者のTokenでも新しい書込みを受け入れます。」は古い所有者を受け入れる動作としている。誤答2の「Fence TokenはCacheのTTLを延ばす値です。」はLockの期限とCache期限を混同している。"],["CAPのPは何ですか。","Network Partitionへの耐性です。","Pは処理が遅いことへの耐性です。","PはPrimary Keyの一貫性です。","「Network Partitionへの耐性です。」が正しいのは、PはNetwork Partitionへの耐性を表すため。誤答1の「Pは処理が遅いことへの耐性です。」は性能の遅さを表す語としている。誤答2の「PはPrimary Keyの一貫性です。」はDB Keyの性質と混同している。"],["CAPを誤読しないための文脈は何ですか。","分断時のConsistencyとAvailabilityの選択です。","分断時でもConsistencyとAvailabilityを両方必ず最大にします。","分断が起きない平常時の性能だけを比較します。","「分断時のConsistencyとAvailabilityの選択です。」が正しいのは、Network Partitionが起きたときConsistencyとAvailabilityのどちらを選ぶかを見るため。誤答1の「分断時でもConsistencyとAvailabilityを両方必ず最大にします。」は分断中の選択を同時保証としている。誤答2の「分断が起きない平常時の性能だけを比較します。」は平常時の性能の話に置き換えている。"],["timeout後にLock処理をRetryする前に何を確認しますか。","処理済みか、Leaseや状態を確認します。","処理済みかを確認せず、別Leaseで直ちに書き直します。","Leaseが切れていても古いLockを有効として再送します。","「処理済みか、Leaseや状態を確認します。」が正しいのは、処理済み状態とLeaseの有効性を確認してから再試行するため。誤答1の「処理済みかを確認せず、別Leaseで直ちに書き直します。」は結果確認を飛ばして重複処理を始めている。誤答2の「Leaseが切れていても古いLockを有効として再送します。」は期限切れの所有権を使い続けている。"]],
    checks:["Distributed LockとLease","Split Brain","Fence Token","CAPの三要素","Idempotency・DB制約"],search:"Distributed Lock lease Split Brain Fence Token CAP theorem Consistency Availability Partition tolerance Redis Kubernetes"
  });

  const partChapters=[c1,c2,c3,c4,c5,c6,c7,c8,c9];
  globalThis.registerPart("part-12",partChapters);
})(); 
