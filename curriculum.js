const courseParts = [
  { id: "part-1", title: "第1部 コンピュータの基礎", status: "complete", chapters: [] },
  { id: "part-2", title: "第2部 OS / Linux", topics: "Kernel、System Call、仮想メモリ、FD、Socket、I/O" },
  { id: "part-3", title: "第3部 ネットワーク", topics: "Ethernet、ARP、IP、Routing、TCP / UDP、DNS" },
  { id: "part-4", title: "第4部 Web / HTTP / TLS", topics: "HTTP/1.1–3、TLS、Cache、CDN、CORS" },
  { id: "part-5", title: "第5部 ブラウザ", topics: "DOM、CSSOM、Layout、Paint、Event Loop" },
  { id: "part-6", title: "第6部 データ構造とアルゴリズム", topics: "Hash Table、Tree、B+Tree、DFS / BFS、Big O" },
  { id: "part-7", title: "第7部 Java / Runtime", topics: "JVM、JIT、GC、Java Memory Model" },
  { id: "part-8", title: "第8部 RDB", topics: "MySQL、Index、Optimizer、MVCC、WAL、Replication" },
  { id: "part-9", title: "第9部 並行処理", topics: "Race、Mutex、CAS、Deadlock、各種Pool" },
  { id: "part-10", title: "第10部 Webセキュリティ", topics: "認証・認可、XSS、CSRF、OAuth 2.0 / OIDC" },
  { id: "part-11", title: "第11部 Container / Kubernetes", topics: "Namespace、cgroups、Pod、CNI、Control Plane" },
  { id: "part-12", title: "第12部 分散システム", topics: "Timeout、Retry、冪等性、Queue、Consistency" },
  { id: "final", title: "最終章 URLから画面表示まで", topics: "全レイヤーを貫く総復習" }
];

const chapterTerms = {
  "cpu": [
    ["CPU", "メモリから命令を読み、計算やデータの移動を行う装置。コアは、その処理を進める実行単位です。"],
    ["I/O（入出力）", "ディスクやネットワークなどとのデータのやり取り。応答を待つ時間をI/O待ちと呼びます。"]
  ],
  "instructions": [
    ["機械語・アセンブリ言語", "機械語はCPUが読むビット列。アセンブリ言語では、対応する操作をADDなどの記号で書きます。"],
    ["Bytecode・JVM", "BytecodeはJavaソースから作る中間形式の命令列。JVMはそれを実行する環境です。"],
    ["JIT", "実行中によく使われるコードを機械語に変換する仕組み。Just-In-Timeの略です。"]
  ],
  "registers": [
    ["レジスタ", "CPUコア内にある小さな保存場所で、命令が直接使えます。"],
    ["PC・SP", "PC（プログラムカウンタ）は命令の番地、SP（スタックポインタ）はスタックの現在位置を示します。"]
  ],
  "memory": [
    ["アドレス・byte", "アドレスはメモリの番地。1 byteは8ビットで、各番地には1 byteずつ対応します。"],
    ["RAM・キャッシュ", "RAMは実行中の命令やデータを置く主記憶。キャッシュは、よく使うデータを近くに置いて再利用する仕組みです。"]
  ],
  "stack-heap": [
    ["Stack（スタック）", "関数を呼ぶたびに作業枠を積み、関数から戻るたびに取り除く領域。作業枠はStack frameと呼びます。"],
    ["Heap（ヒープ）", "実行中に作られるオブジェクトなどを置く領域。参照は、そこにある対象を指す値です。"]
  ],
  "execution": [
    ["シェル", "入力したコマンドを解釈し、プログラムの起動などをOSに頼むプログラム。"],
    ["実行ファイル・ライブラリ", "実行ファイルには起動するプログラムの命令が入ります。ライブラリは、そのプログラムが利用する機能のまとまりです。"]
  ],
  "process": [
    ["Process（プロセス）", "実行中のプログラムをOSが管理する単位。PIDは、その実行を区別する番号です。"],
    ["仮想メモリ", "各Processから見えるメモリの番地の空間。同じ番地でも、Processごとに別の場所に対応できます。"]
  ],
  "thread": [
    ["Thread（スレッド）", "一つのProcessの中で、CPUが追いかける実行の流れ。Threadごとに呼び出しの枠と命令の位置があります。"],
    ["共有・競合", "複数のThreadが同じデータを使える状態が共有です。その操作順によって結果が変わることを競合と呼びます。"]
  ],
  "context-switch": [
    ["Context Switch", "CPUを別のThreadなどへ譲るため、実行を再開するのに必要な状態を保存・復元すること。"],
    ["スケジューラ", "実行できる候補の中から、どの処理にCPUを割り当てるかを決めるOSの仕組み。"]
  ],
  "user-kernel-mode": [
    ["Kernel", "メモリや装置などを管理するOSの中心部分。CPUはアプリとKernelで実行できる操作を分けます。"],
    ["System Call", "アプリがファイルの読み出しなど、Kernelが管理する操作を依頼するための入口。"]
  ],
  "os-kernel": [
    ["OS・Kernel", "OSはプログラムを動かす土台。Kernelはその中心で、CPU・メモリ・装置の利用を管理します。"],
    ["ユーザー空間", "通常のアプリが動く側。管理が必要な操作はSystem Callを使ってKernelに頼みます。"]
  ],
  "system-call-process-signal": [
    ["親Process・子Process", "別のProcessを作った側と、作られた側。親は子の終了を待ち、終了状態を受け取れます。"],
    ["Signal（シグナル）", "OSを通してProcessへ送る通知。終了の要求や、一時停止などに使います。"]
  ],
  "virtual-memory-page": [
    ["Page・Frame", "Pageは仮想メモリを区切った一定サイズの単位。Frameは物理メモリ側の対応単位です。"],
    ["Page Table・Page Fault", "Page Tableは仮想と物理の対応表。変換や権限に問題があると、Page Faultを通じてOSが対応します。"]
  ],
  "page-cache": [
    ["Page Cache", "ファイルの読み書きに使ったページを、KernelがRAMに保持して再利用する仕組み。"],
    ["Hit・Miss・dirty", "必要なページがあればHit、なければMiss。変更がストレージに反映されていないページはdirtyと呼びます。"]
  ],
  "filesystem-fd-stdio": [
    ["File System", "ファイル名、ディレクトリ、データの配置などをストレージ上で管理する仕組み。"],
    ["FD・標準入出力", "FDはProcessが開いたファイルなどを指す番号。標準入力・標準出力・標準エラー出力には通常0・1・2を使います。"]
  ],
  "socket-io": [
    ["Socket", "アプリがOSを通してデータを送受信するための窓口。TCPサーバーでは待ち受け用と接続ごとのSocketがあります。"],
    ["Port（ポート）", "TCPやUDPが、同じIPアドレス上でどの通信にデータを渡すかを区別するための番号。"]
  ],
  "blocking-nonblocking-io": [
    ["Blocking・Non-blocking", "準備ができるまで呼び出し元を待たせる方式と、今できることを返して呼び出し元へ戻る方式。"],
    ["準備完了通知", "どのSocketなどで読み書きを試せるかをOSから受け取る仕組み。この章のselectやpollが扱います。"]
  ],
  "network-interface": [
    ["Network Interface", "コンピュータがネットワークとデータをやり取りする接続口。物理的な装置にも仮想的な接続口にも使う言葉です。"],
    ["MAC Address・ARP", "MAC Addressは同じ区間で相手を指定する識別子。ARPは同じIPv4ネットワーク上でIPからMAC Addressを調べます。"],
    ["Frame・Packet", "Frameはその区間を渡るデータの単位。中に、IPで宛先へ届けるPacketを載せられます。"]
  ],
  "ip-subnet": [
    ["IP Address・Subnet", "IP AddressはIP通信の宛先などを示す番号。Subnetはその番号をひとまとまりにした範囲です。"],
    ["/24・Gateway", "/24は先頭24ビットをネットワークの範囲に使う指定。Gatewayは別のネットワークへ送るときの中継先です。"]
  ],
  "routing-nat": [
    ["Routing", "宛先IPに対し、どの接続口からどの次の機器へ渡すかを決めること。"],
    ["NAT", "通信が境界を通るときにIPアドレスを書き換える仕組み。Portも変換して通信を区別することがあります。"]
  ],
  "port-socket-udp": [
    ["TCP・UDP", "どちらもPortで宛先を区別します。TCPは接続で順番どおりのbyte列を運び、UDPは独立したDatagramを運びます。"],
    ["Datagram", "送信先を指定してひとまとまりで送るデータ。UDPはその到着や順序を保証しません。"]
  ],
  "tcp-handshake": [
    ["Handshake", "通信を始める前に双方の状態を確かめるやり取り。TCPでは3つのメッセージを交わします。"],
    ["SYN・ACK", "SYNは番号の同期を始める印。ACKは、相手から受け取った範囲を確認するための印です。"]
  ],
  "tcp-reliability": [
    ["Segment", "TCPがデータを運ぶときの区切り。どのbyteから始まるかをSequence Numberで示します。"],
    ["累積ACK・再送", "累積ACKは連続して受け取れた範囲の次の番号。再送は、受信を確認できなかったデータを送り直すことです。"]
  ],
  "tcp-control": [
    ["Flow Control", "受信側が保持できる量に合わせて、送信側が未確認データを増やしすぎないようにする制御。"],
    ["Congestion Control", "経路の混み具合に合わせ、送信側がネットワークへ送り込む量を調整する制御。"]
  ],
  "dns-curl": [
    ["DNS・Resolver", "DNSは名前に対応する情報を引く仕組み。Resolverはアプリに代わって検索する側で、AはIPv4、AAAAはIPv6の情報を返します。"],
    ["curl", "URLを指定して通信を行い、応答や途中のやり取りを端末で観察できるツール。"]
  ],
  "http-basics": [
    ["HTTP", "ブラウザなどがWebサーバーと依頼・結果をやり取りするための取り決め。"],
    ["Request・Response", "Requestはクライアントからの依頼、Responseはサーバーからの結果。Headerは付帯情報、Bodyは本文です。"]
  ],
  "http11-keepalive": [
    ["Keep-Alive", "通信を一件終えた後も接続を開いておき、次のHTTPのやり取りに使うこと。"],
    ["Content-Length", "HTTPの本文が何byteあるかを示すHeader。受信側が本文の終わりを判断する手掛かりです。"]
  ],
  "http2": [
    ["Frame・Stream", "FrameはHTTP/2が送るデータの区切り。Streamは、同じ接続の中で一件のやり取りを区別する流れです。"],
    ["多重化", "別々のStreamのFrameを、一つの接続で混ぜて運ぶこと。受信側は番号で振り分けます。"]
  ],
  "http3": [
    ["QUIC", "UDPの上で接続・暗号化・順序制御などを行う通信方式。HTTP/3はその上で動きます。"],
    ["Connection ID", "QUICの接続を識別するための値。相手のIPなどが変わったあとも同じ接続を扱う手掛かりになります。"]
  ],
  "tls-certificates": [
    ["TLS", "通信を暗号化し、途中で変更されていないことや通信相手を確認するための取り決め。HTTPSの土台です。"],
    ["証明書・認証局（CA）", "証明書は名前と公開鍵などを結び付ける情報。認証局は確認した内容に署名する組織です。"]
  ],
  "cookie-cache-etag": [
    ["Cookie", "サーバーがブラウザに預け、次の対象の要求でブラウザに送ってもらえる小さなデータ。"],
    ["Cache・ETag", "Cacheは過去の応答を保存して再利用する仕組み。ETagは保存した応答を見直すときに使う識別子です。"]
  ],
  "cdn-proxy-cors": [
    ["CDN・Reverse Proxy", "CDNは利用者に近い拠点などから配信する仕組み。Reverse Proxyは利用者の要求をアプリに代わって受け取ります。"],
    ["Origin・CORS", "Originは通信方式・ホスト名・Portの組。CORSは別Originの応答をブラウザのコードへ渡してよいかを決める仕組みです。"]
  ],
  "html-parser-dom": [
    ["Parser", "HTMLの文字列などを、記号の意味と構造を持つデータへ読み替える処理。"],
    ["DOM・Node", "DOMはブラウザが組み立てた文書の構造。Nodeは要素やテキストなど、木を構成する一つの項目です。"]
  ],
  "cssom-render-tree": [
    ["CSSOM", "ブラウザが組み立てたCSSルールの構造。DOM上の各要素にどの指定が当たるかを調べるために使います。"],
    ["Render Tree", "画面上に並べて描く対象とそのスタイルをまとめた考え方。"]
  ],
  "layout-paint": [
    ["Layout・Paint", "Layoutで箱の位置やサイズを決め、Paintで文字や背景などの見た目を描きます。"],
    ["Compositing（合成）", "描いた複数の層を重ねて、最終的に画面へ出す画像を作る段階。"]
  ],
  "javascript-engine": [
    ["Token・AST", "Tokenはソースを区切った記号や単語。ASTは、それらから文法上の関係を組み立てた木です。"],
    ["Interpreter・JIT", "Interpreterは命令を読みながら実行します。JITは実行中のコードを、CPU向けの機械語に変換できます。"]
  ],
  "event-loop": [
    ["Event Loop", "完了した処理の続きや入力イベントなどを、ブラウザが順に扱う仕組み。"],
    ["Task・Microtask", "Taskはタイマーやクリック処理などの実行単位。Promiseの続きなどのMicrotaskは、現在のTaskの後でまとめて処理されます。"]
  ],
  "browser-fetch-storage-security": [
    ["Fetch", "JavaScriptから通信を頼み、後から応答を受け取るためのブラウザAPI。"],
    ["Web Storage・Origin", "Web Storageはブラウザ内でキーと値を保存する機能。どこからアクセスできるかはOrigin単位で区切られます。"]
  ],
  "array-linked-list": [
    ["Array（配列）・添字", "Arrayは位置を番号で指定できる要素の並び。添字は、その番号です。"],
    ["Linked List・Node", "Linked Listは、値を持つNodeどうしを、次のNodeを指す参照でつないだ構造。"]
  ],
  "stack-queue": [
    ["Stack・LIFO", "最後に入れた項目から取り出す仕組み。関数の呼び出し順などに使います。"],
    ["Queue・FIFO", "最初に入れた項目から取り出す仕組み。仕事を受け付けた順で扱う場合に使います。"]
  ],
  "hash-table": [
    ["Hash Function・Bucket", "Hash Functionはキーを数値に変換します。その数値などを使って選ぶ格納先の区画がBucketです。"],
    ["Collision（衝突）", "違うキーが同じ候補の区画に入ること。格納後にキーを照合して区別します。"]
  ],
  "tree-bst": [
    ["Root・子・Leaf", "Rootは木の出発点。子はあるNodeの一段下につながるNodeで、子を持たないNodeはLeafです。"],
    ["Binary Search Tree（探索木）", "各Nodeを基準に、小さい値を左、大きい値を右に分けて検索できる木。"]
  ],
  "btree-bplus": [
    ["B+Tree", "一つのページから複数の子へ枝分かれできる探索木。データを探すときは葉へ下り、範囲は葉の横のつながりで読めます。"],
    ["境界キー・Page", "境界キーは木で進む先を決める目印。PageはDBが読み書きするデータのまとまりです。"]
  ],
  "heap-graph": [
    ["Heap（優先度付きの木）", "親と子の大小関係を保つ構造。最小値または最大値を取り出すのに使います。"],
    ["Graph・Vertex・Edge", "Graphはつながりを表す構造。対象をVertex（頂点）、その間のつながりをEdge（辺）と呼びます。"]
  ],
  "graph-traversal": [
    ["BFS（幅優先探索）", "出発点から近い頂点を先に調べる方法。候補は見つけた順で取り出します。"],
    ["DFS（深さ優先探索）", "一つの枝を先に進み、進めなくなったら分岐へ戻る方法。"]
  ],
  "search-sort": [
    ["線形探索・二分探索", "線形探索は一件ずつ比較。二分探索は値が並んでいることを利用して、候補を半分ずつ絞ります。"],
    ["Sort（整列）", "決めた規則に沿ってデータを並べ直す操作。"]
  ],
  "big-o": [
    ["Big O・入力数 n", "nを入力の件数などとし、nを増やしたときに仕事量がどの程度増えるかを表す記法。"],
    ["log n", "この章の例では、候補を繰り返し半分にしたときに残りが一件になるまでの段数の目安。"]
  ],
  "jvm-bytecode": [
    ["JVM・Bytecode", "JVMはJavaのコードを動かす実行環境。Bytecodeは、JVMに渡すために変換された命令列です。"],
    ["JDK・classファイル", "JDKはjavacなどの開発ツールと実行環境を含む一式。コンパイルしたクラスは通常classファイルに入ります。"]
  ],
  "jit": [
    ["JIT", "実行中に集めた情報をもとに、よく実行される処理を機械語へ変換する仕組み。"],
    ["Warm-up・最適化の取り消し", "Warm-upは実行が進むにつれて最適化が進む時期。想定が外れたときは、その想定に基づく最適化を取り消せます。"]
  ],
  "java-stack-heap-object-reference": [
    ["Object・Reference", "Objectは実行中に作られたデータの実体。Referenceは、そのObjectを指すための値です。"],
    ["Stack frame", "メソッド呼び出しごとに用意される、ローカル変数などを扱う作業枠。"]
  ],
  "gc-root-garbage-collection": [
    ["GC（Garbage Collection）", "プログラムから使われなくなったオブジェクトのメモリを回収する仕組み。"],
    ["GC Root・到達可能性", "GC Rootは参照をたどる出発点。出発点から対象にたどれる状態を到達可能と呼びます。"]
  ],
  "thread-jmm": [
    ["Java Memory Model（JMM）", "同じ変数を複数Threadから使うとき、どの書き込みが読み取りから見えるかを定める規則。"],
    ["happens-before", "ある操作の結果を、別の操作から見える状態にできる順序関係。この章ではThread間の値の引き渡しに使います。"]
  ],
  "synchronized-volatile-concurrent": [
    ["synchronized・volatile", "synchronizedで同じロックを取る処理を一人ずつ進められます。volatileの読み書きはThread間で値を知らせるのに使えます。"],
    ["Concurrent Collection", "複数Threadから同時に使うことを想定したデータ構造。どこまでを一つの操作として守れるかはAPIによって異なります。"]
  ],
  "out-of-memory-error": [
    ["OutOfMemoryError", "JVMが必要なメモリやThreadなどの資源を確保できなかったときのエラー。末尾のメッセージで調査先を絞れます。"],
    ["Heap Dump", "取得時点のHeapにどんなオブジェクトがあり、何がそれらを参照しているかを調べる資料。"]
  ],
  "relational-model": [
    ["RDB・Table", "RDBはデータを表として扱うDB。Tableは情報のまとまりで、一件を行、各項目を列で表します。"],
    ["Key・JOIN", "Keyは行を識別したり対応付けたりする値。JOINは条件に合う複数の表の行を組み合わせます。"]
  ],
  "page-disk-io": [
    ["Page・Disk I/O", "PageはDB内部の読み書きの単位。Disk I/Oはストレージとデータをやり取りする処理です。"],
    ["全表走査", "表の行を広く読み進め、条件に合う行を探すこと。"]
  ],
  "primary-foreign-key": [
    ["Primary Key（主キー）", "表の一行を一意に指定する列、または列の組み合わせ。"],
    ["Foreign Key（外部キー）", "表の値が、参照先の表にある有効なキーを指すことをDBに確認させる制約。"]
  ],
  "bplus-tree-index": [
    ["Index（索引）", "値から対応する行へたどるためにDBが持つデータ構造。"],
    ["Root・Internal・Leaf", "索引の木の出発点がRoot、中間の分岐がInternal、データのある末端がLeafです。"]
  ],
  "clustered-secondary-composite": [
    ["Clustered・Secondary Index", "InnoDBでは行本体をClustered Indexの葉に置きます。Secondary Indexは別の値から行の主キーへたどる索引です。"],
    ["Composite Index（複合索引）", "二つ以上の列を決まった順序で組み合わせる索引。たとえば姓、同じ姓の中で名の順に並べます。"]
  ],
  "optimizer-explain": [
    ["Optimizer", "SQLに答える方法の候補を見積もり、実行する手順を選ぶDBの処理。"],
    ["実行計画・EXPLAIN", "実行計画はどの表やIndexをどの順に使うかを示します。EXPLAINで、その計画を確認できます。"]
  ],
  "buffer-pool": [
    ["Buffer Pool", "InnoDBが読み込んだデータやIndexのページをメモリに保つ領域。"],
    ["Hit・Miss・Dirty Page", "必要なページがあればHit、なければMiss。更新されて書き出し前のページはDirty Pageです。"]
  ],
  "transaction-acid": [
    ["Transaction・COMMIT・ROLLBACK", "Transactionは操作を一まとまりにした単位。COMMITで確定し、ROLLBACKで変更を取り消します。"],
    ["ACID", "Transactionに求める原子性・一貫性・分離性・永続性の頭文字。送金の例で一つずつ見ます。"]
  ],
  "mvcc-lock-deadlock": [
    ["MVCC・Snapshot Read", "MVCCはデータの複数の版を使って同時処理を扱う方式。Snapshot Readは、読む処理から見えてよい版を選びます。"],
    ["Lock・Deadlock", "Lockは操作の競合を防ぐために取る権利。互いのLockの解除を待って進めなくなる状態がDeadlockです。"]
  ],
  "redo-undo-wal-replication": [
    ["Redo・Undo", "Redoは変更をやり直す手掛かり。Undoは変更を取り消したり、以前の値を参照したりする手掛かりです。"],
    ["WAL・Replication", "WALはデータより先に復旧用ログを書き出す取り決め。Replicationは変更を別のDBにも反映することです。"]
  ],
  "concurrency-parallelism": [
    ["Concurrency（並行）", "作業を切り替えながらなど、複数の仕事を同じ時間帯に進めること。"],
    ["Parallelism（並列）", "複数のCPUコアなどを使い、別々の仕事を同じ瞬間に実行すること。"]
  ],
  "race-critical-section": [
    ["Race Condition", "複数の処理の実行順によって、意図と異なる結果が出る状態。"],
    ["Critical Section", "共有データの正しさを保つために、競合しないようまとめて実行する区間。"]
  ],
  "mutex-semaphore": [
    ["Mutex", "同じ区間へ入れる処理を一つに制限するためのロック。"],
    ["Semaphore", "同時に資源を利用できる処理の数を、残り枠の数で管理する仕組み。"]
  ],
  "atomic-cas": [
    ["Atomic Operation", "他の処理から途中の状態が見えず、一つの操作として扱える処理。"],
    ["CAS", "Compare-And-Swapの略。値が期待した状態にあるときだけ、それを新しい値へ置き換える仕組み。"]
  ],
  "deadlock": [
    ["Deadlock", "複数の処理が互いに相手の持つ資源を待ち、そのままでは進めなくなる状態。"],
    ["待ちの関係", "どの処理がどの資源を持ち、誰がその解放を待っているかを示す関係。"]
  ],
  "thread-connection-pool": [
    ["Pool（プール）", "資源をあらかじめ用意し、仕事に貸して使い回す仕組み。Thread Poolで実行枠、Connection PoolでDBの接続を貸します。"],
    ["Backpressure", "処理先が受け付けられる量に合わせ、手前の処理や受付を抑える考え方。"]
  ],
  "authentication-authorization": [
    ["認証（Authentication）", "要求している人やシステムが誰かを確認すること。"],
    ["認可（Authorization）", "確認した相手が、あるデータや機能に対して操作してよいかを判断すること。"]
  ],
  "session-cookie": [
    ["Session", "ログイン後など、複数の要求にまたがって利用者の状態を扱う仕組み。"],
    ["Session ID・Cookie", "Session IDは状態を引くための値。Cookieを使うと、ブラウザは条件を満たす要求にその値を付けられます。"]
  ],
  "password-hash-salt": [
    ["Password Hash", "パスワードから計算した照合用の値。ログイン時は、入力から再計算した値を保存値と比べます。"],
    ["Salt・計算コスト", "Saltは登録ごとに用意する乱数。計算コストは、一回の照合に必要な計算量などを調整する設定です。"]
  ],
  "xss-csp": [
    ["XSS", "信頼できない入力などがコードとして扱われ、意図した範囲を超えてブラウザで実行される問題。"],
    ["CSP", "Content Security Policyの略。スクリプトなど、ページが実行・読み込みできるものをブラウザに指定します。"]
  ],
  "csrf-sop-cors": [
    ["CSRF", "ログイン済みブラウザの状態が使われ、利用者が意図していない変更をサーバーが受け付けてしまう問題。"],
    ["SOP・CORS", "SOPは別Originの情報を読むことなどを制限する方針。CORSは別Originからの読み取りを条件付きで許可する仕組みです。"]
  ],
  "sql-injection": [
    ["SQL Injection", "値として受け取ったはずの入力が、DBへ渡すSQLの命令や条件の一部として解釈される問題。"],
    ["Parameter Binding", "SQLの構造を決めたうえで、検索語などをパラメータの値として別に渡す方法。"]
  ],
  "ssrf-https-boundary": [
    ["SSRF", "URL取得などの機能を通じて、サーバーに本来許可すべきでない宛先への通信を行わせる問題。"],
    ["Allowlist・Redirect", "Allowlistは許可するものを明示した一覧。Redirectは応答が、次にアクセスする別のURLを示すことです。"]
  ],
  "oauth-oidc-jwt": [
    ["OAuth・OIDC", "OAuthは他のサービスの機能へアクセスする許可を扱います。OIDCはOAuthを土台に、ログインの結果を確認する仕組みです。"],
    ["JWT・Token", "Tokenは目的を定めて発行する値で、JWTはその表現形式の一つ。誰に何を提示する値かを確認します。"]
  ],
  "vm-container": [
    ["VM（仮想マシン）", "仮想的なハードウェアの上で、ゲストOSとアプリを動かす単位。"],
    ["Container", "ホスト側のKernelを使い、見える資源などを分けてアプリのProcessを動かす単位。"]
  ],
  "linux-namespace": [
    ["Namespace", "Processから見えるPID、ネットワーク、マウントなどをグループごとに分けるLinuxの仕組み。"],
    ["ホスト", "コンテナを動かしている側の環境。同じような名前や番号でも、コンテナ側と見え方が違うことがあります。"]
  ],
  "cgroups": [
    ["cgroups", "Processをグループにして、CPU時間やメモリなどの使用量を管理するLinuxの仕組み。"],
    ["limit・throttling", "limitは使える資源の上限。CPU時間を使い切った処理を次の実行機会まで待たせることをthrottlingと呼びます。"]
  ],
  "container-image-layer": [
    ["Image・Layer", "Imageは起動に使うファイルや設定のまとまり。Layerはそれを構成する差分です。"],
    ["Volume", "コンテナの書き込み領域とは別に、データを保存して使い回せる領域。"]
  ],
  "container-network-cni": [
    ["CNI", "コンテナのネットワーク設定を実行時にプラグインへ依頼するための取り決め。"],
    ["veth・Bridge", "vethは対になった仮想の接続口。Bridgeは複数の接続口の間で通信を中継します。"]
  ],
  "kubernetes-pod-deployment": [
    ["Pod", "Kubernetesがアプリを配置する単位。一つ以上のコンテナが同じネットワークを使えるまとまりです。"],
    ["Deployment・ReplicaSet", "DeploymentはPodの更新や目標を管理します。ReplicaSetは指定した数のPodがそろうよう調整します。"]
  ],
  "service-kube-proxy-dns": [
    ["Service・ClusterIP", "Serviceは入れ替わるPodへ要求を届ける入口。ClusterIPはクラスター内で使うServiceのIPです。"],
    ["Endpoint・kube-proxy", "Endpointは転送先の候補となるアドレスとPort。kube-proxyは構成に応じてServiceの通信を転送する規則を設定します。"]
  ],
  "scheduler-kubelet-control-plane": [
    ["Control Plane", "Kubernetes全体の設定を受け付け、希望する状態に近づける側の機能。"],
    ["Scheduler・kubelet", "SchedulerはPodを配置するNodeを選び、各Nodeのkubeletが割り当てられたPodの起動や稼働を管理します。"]
  ],
  "distributed-system": [
    ["分散システム", "複数のProcessやコンピュータが通信し、協力して一つの機能を提供するシステム。"],
    ["Partial Failure（一部障害）", "システムの一部や通信経路だけが失敗し、残りは動き続けること。"]
  ],
  "distributed-timeout": [
    ["Timeout", "待つために決めた時間を過ぎたこと。その時点で相手の処理結果が分からない場合があります。"],
    ["Deadline（期限）", "処理を終える時刻の上限。複数の呼び出しへ残り時間を割り当てる基準になります。"]
  ],
  "retry-backoff": [
    ["Retry・Backoff", "Retryは再試行。Backoffは、失敗が続くときに次に試すまでの間隔を延ばす方法です。"],
    ["Jitter", "待ち時間にばらつきを足し、複数のクライアントが同時に再試行するのを減らす工夫。"]
  ],
  "idempotency": [
    ["冪等性（べきとうせい）", "同じ操作を重ねても、外から見た効果が一回実行した場合と同じになる性質。"],
    ["Idempotency Key", "同じ依頼を再送したことをサーバーが判別するために、要求へ添える識別子。"]
  ],
  "delivery-semantics": [
    ["配送の保証", "一件のメッセージが失われ得るか、同じものが複数回届き得るかを示す取り決め。"],
    ["Ack", "受信側が、メッセージを受け取ったり処理し終えたりしたことを知らせる確認。意味は仕組みによって異なります。"]
  ],
  "queue-pubsub": [
    ["Queue・Worker", "Queueは処理を待つ依頼を置く場所。Workerはそこから依頼を取り出して実行する側です。"],
    ["Pub/Sub", "発行された情報を、登録した複数の購読先へそれぞれ届ける方式。PublishとSubscribeの略です。"]
  ],
  "cache-invalidation": [
    ["Invalidation・TTL", "Invalidationは古いキャッシュを使えなくすること。TTLは有効期間で、期限切れなら再取得などの対象になります。"],
    ["Hit・Miss", "取得しようとした値がキャッシュで使えればHit、なければMissです。"]
  ],
  "replication-consistency": [
    ["Leader・Follower", "Leaderが変更を受け付け、その内容をFollowerへ複製する構成があります。Followerの反映は遅れる場合があります。"],
    ["Consistency（一貫性）", "この章では、どこで読み取ったときにどの更新までを観察できるかの保証を指します。"]
  ],
  "distributed-lock-cap": [
    ["Lease・Fence Token", "Leaseは期限付きの利用権。Fence Tokenは取得順を表す番号で、更新先が古い所有者の操作を見分けるのに使います。"],
    ["CAP", "通信が分断されたとき、一貫した結果を保証することと、利用者の要求に応え続けることの関係を整理する考え方。"]
  ],
  "final-url-to-screen": [
    ["クライアント・サーバー", "要求を出すのがクライアント、処理して応答するのがサーバー。この章ではブラウザからDBまでの役割を追います。"],
    ["レイヤー（層）", "DNSの名前解決、HTTPのやり取り、DOMの描画など、役割が異なる処理を分けて捉える考え方。"]
  ]
};

const codeBlock = (label, code) => `<div class="code-block"><div class="code-heading"><span>${label}</span><button class="copy-code" type="button">コピー</button></div><pre><code>${code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre></div>`;
const callout = (type, label, text) => `<aside class="callout ${type}"><span class="callout-label">${label}</span><p>${text}</p></aside>`;
const section = (number, title, body) => `<section class="chapter-section"><span class="section-number">${String(number).padStart(2,"0")}</span><h2>${title}</h2>${body}</section>`;
const quizChoiceBank = {
  "CPUがなければ、メモリ上のプログラムはなぜ動かないのでしょうか。": ["メモリがソースコードを自動的に解釈して実行するからです。", "SSDが命令を計算してメモリへ結果を返すからです。", "CPUが命令を読み、意味を解釈し、実行して初めて値や状態が変わります。メモリやSSDは、置かれたビット列を自分では実行しません。"],
  "fetch・decode・executeを、機械の動作として説明してください。": ["データをSSDへ保存し、ネットワークへ送り、画面へ表示します。", "ソースコードを入力し、コンパイルし、利用者へ公開します。", "fetchは命令を読み、decodeは命令の意味を調べ、executeは計算や移動を実行します。ほかの選択肢はCPU内部の命令サイクルではありません。"],
  "APIの応答が遅いのにCPU使用率が低いとき、何が考えられますか。": ["CPUのクロック周波数が高すぎて、処理を停止している可能性だけを考えます。", "必ずプログラムに無限ループがあり、CPUの表示だけが間違っています。", "DB、外部API、ディスク、ネットワークなどのI/O待ちが考えられます。CPUが暇でも、外部から結果が戻らなければ応答は遅くなります。"],
  "3 GHzのCPUが毎秒30億命令を完了する、と断言できないのはなぜですか。": ["3 GHzはメモリ容量を表す単位で、命令とは無関係だからです。", "CPUは1秒に必ず1命令しか実行できないからです。", "3 GHzは1秒あたりのクロック周期数です。1命令に必要な周期数、並行実行、メモリ待ちがあるため、完了命令数とは一致しません。"],
  "JavaコードがARM64とx86-64の両方で動くとき、同じCPU命令が使われますか。": ["使われます。Javaの文字列をどのCPUも直接実行します。", "使われませんが、CPUではなくSSDがJavaを実行します。", "同じではありません。JVMのインタプリタやJITが、共通のbytecodeを各CPUの命令へ対応させます。"],
  "条件分岐はCPUの上でどのように表せますか。": ["条件に関係なく、すべての命令を必ず一度だけ実行します。", "比較結果をファイル名へ変換し、別のプログラムを起動します。", "値を比較し、その結果に応じて次に読む命令位置を変えます。分岐は処理の進む先を選ぶCPU命令で表せます。"],
  "機械語とアセンブリ言語の違いは何ですか。": ["機械語は人向けの文章で、アセンブリ言語は画像形式です。", "どちらもCPUの種類に関係なく同じ文字列を使います。", "機械語はCPUが読むビット列、アセンブリ言語はそれを人が扱いやすい記号で表したものです。役割は近くても表現が違います。"],
  "同じJavaのclassファイルが異なるCPUで動くのはなぜですか。": ["classファイルがARM64とx86-64の機械語を同時に実行するからです。", "CPUがJavaの文法を直接理解するよう設計されているからです。", "classファイルにはJVM向けのbytecodeが入り、各環境のJVMが対象CPUに合う方法で実行します。"],
  "ループ回数が増えるとCPU時間が増えやすいのはなぜですか。": ["ループするたびにCPUコアが必ず1個増えるからです。", "ループ回数に応じてネットワーク距離が長くなるからです。", "本体の命令を繰り返す回数が増えるためです。最適化される場合もありますが、通常は仕事量が増えます。"],
  "JITの役割を一文で説明してください。": ["使われていないメモリをすべてSSDへ移動する仕組みです。", "HTTP requestを暗号化してWebサーバーへ送る仕組みです。", "実行中によく使うbytecodeを対象CPUの機械語へ変換し、以後の実行を速くします。"],
  "レジスタが必要な理由は何ですか。": ["Webページを長期間保存する大容量の場所が必要だからです。", "CPUをネットワークへ接続する住所が必要だからです。", "CPUが今すぐ使う値や命令位置を、CPU内部の高速な場所へ置くためです。主記憶より小さい代わりに速く使えます。"],
  "プログラムカウンタには何が入りますか。": ["現在開いているファイルの総数が入ります。", "プログラムが使えるメモリ容量だけが入ります。", "次に実行する命令の位置が入ります。名前にcounterとありますが、単なる実行回数ではありません。"],
  "レジスタを主記憶のように大量に用意しないのはなぜですか。": ["レジスタはSSD上にあり、読み出しが遅くなるからです。", "レジスタはネットワーク通信にしか使えないからです。", "CPU内部の面積を使い、命令で指定する仕組みも複雑になるためです。高速さと容量には交換関係があります。"],
  "コンテキストスイッチでレジスタを保存するのはなぜですか。": ["別のThreadとレジスタの値を混ぜて計算するためです。", "終了したProcessのファイルを自動削除するためです。", "止めた処理を同じ状態から再開するためです。保存しなければ途中の値や次の命令位置を失います。"],
  "変数とレジスタは1対1ですか。": ["常に1対1で、変数は実行中ずっと同じレジスタにあります。", "変数は必ずSSDだけに置かれ、レジスタには入りません。", "1対1ではありません。コンパイラやJITが、利用時期に合わせてレジスタやメモリへの置き方を変えます。"],
  "CPUがメモリを必要とするのはなぜですか。": ["CPUのクロック周波数を記録するだけのためです。", "画面の色だけを保存するためです。", "実行する命令と計算に使うデータを置くためです。CPU内部のレジスタだけでは容量が足りません。"],
  "アドレスとは何ですか。": ["データの内容が正しいことを保証する暗号です。", "CPUの処理速度を示す数値です。", "メモリ中の位置を指定する番地です。同じ値でも、どこにあるかを示すにはアドレスが必要です。"],
  "4byteの整数は何個のbyteアドレスを使いますか。": ["1個です。どの値も必ず1アドレスに収まります。", "8個です。1 byteは必ず2アドレスに分かれます。", "通常は連続する4個のbyteアドレスを使います。1つのbyteアドレスが1 byteを指すためです。"],
  "配列を順番に読むと速いことが多いのはなぜですか。": ["配列を読むたびにCPUの周波数が上がるからです。", "順番に読むと、メモリへアクセスせず計算できるからです。", "近くのデータをcache lineとしてまとめて運べるためです。次に使う値がcacheへ入っている可能性が高まります。"],
  "GCがあってもメモリリークが起こるのはなぜですか。": ["GCはHeapを一度も確認しない仕組みだからです。", "GCがすべてのオブジェクトを作成直後に削除するからです。", "不要なオブジェクトへの参照が残ると、GCはまだ使われると判断します。GCは『不要という意図』ではなく、到達できるかを手掛かりにします。"],
  "Stack frameには何が入りますか。": ["WebサイトのHTMLファイル全体だけが入ります。", "別Processが使うHeapの全オブジェクトがコピーされます。", "戻り先、引数、ローカル変数、途中の値など、関数を続けるための情報が入ります。"],
  "StackがLIFOに向くのはなぜですか。": ["最初に呼んだ関数が必ず最初に終わるからです。", "関数は終了せず、Stackへ永遠に残るからです。", "最後に呼び出した関数が先に終了するためです。呼び出しの入れ子と後入れ先出しの順序が合います。"],
  "Heapの片づけが複雑なのはなぜですか。": ["Heap上の値はすべて同じ時刻に不要になるからです。", "Heapには数値を置けず、画像だけを置くからです。", "オブジェクトが不要になる順番は、作成順や関数の終了順と一致しないためです。残っている参照も確認する必要があります。"],
  "スレッド間で競合しやすいのはどちらのデータですか。": ["各Threadだけが持つStack上のローカルな値です。", "別マシンに保存され、どのThreadも触れないデータです。", "同じProcessのThreadから共有されるHeap上のデータです。複数のThreadが同時に更新できるため競合します。"],
  "StackOverflowErrorとOutOfMemoryErrorの違いは何ですか。": ["どちらも必ずネットワーク切断だけを表します。", "前者はHeap不足、後者は関数の呼び出し過多だけを表します。", "StackOverflowErrorは主に呼び出しStackの不足、OutOfMemoryErrorはHeapなどの確保失敗です。不足した領域が異なります。"],
  "実行ファイルとプロセスの違いは何ですか。": ["実行ファイルが実行中の状態で、Processは保存された文字列です。", "どちらも同じPIDを永久に持つファイルです。", "実行ファイルは保存されたコードと情報、Processはそれを動かすためOSが管理する実行中の状態です。"],
  "OSは実行前に何を確認しますか。": ["Webページの見た目と利用者の好みだけを確認します。", "ファイル名の長さだけを確認し、内容や権限は見ません。", "実行形式、対象CPU、実行権限、必要なライブラリなどを確認します。安全かつ実行可能かを判断するためです。"],
  "ローダーの役割は何ですか。": ["利用者のキーボード入力をHTTPへ変換します。", "停止したCPUを物理的に交換します。", "実行ファイルのコードやデータを仮想メモリへ対応付け、開始地点から実行できる状態を作ります。"],
  "Javaのmainより前に何が起きますか。": ["何も起きず、CPUがJavaのmainを直接読みます。", "必ずすべてのWeb requestへの応答が終わります。", "JVMの起動、classの読み込みと検査、ランタイム初期化などが行われます。mainは準備後に呼ばれます。"],
  "CrashLoopBackOffとこの章はどうつながりますか。": ["CPUが速すぎるためContainerを一度だけ停止した状態です。", "HTMLの色指定が間違っていることだけを示します。", "Container内のProcessが起動して失敗し、再起動を繰り返している状態としてつながります。Processの開始と終了を追う必要があります。"],
  "同じプログラムから複数Processを作れますか。": ["作れません。実行ファイルは一度だけしか読めません。", "作れますが、すべてが必ず同じPIDとメモリを共有します。", "作れます。同じ実行ファイルからでも、各Processは別のPIDと実行状態を持ちます。"],
  "PIDは永久に同じ対象を指しますか。": ["指します。マシンを交換しても同じProcessを指し続けます。", "PIDはProcessではなく、CPUコアの温度だけを示します。", "永久ではありません。Process終了後、その番号が別のProcessに再利用されることがあります。"],
  "別Processが同じ仮想アドレスを使えるのはなぜですか。": ["同じ仮想アドレスなら、必ず同じ物理メモリを共有するからです。", "仮想アドレスは実際には文字列で、位置を表さないからです。", "Processごとに仮想アドレスから物理メモリへの対応表が異なるためです。同じ番地表示でも行き先を分けられます。"],
  "PPIDは何を示しますか。": ["Processが使用できるport番号を示します。", "次に実行するCPU命令の位置を示します。", "そのProcessを作った親ProcessのPIDを示します。親子関係を調べる手掛かりになります。"],
  "Processが落ちるとThreadはどうなりますか。": ["Threadだけが別Processへ自動的に移動して続きます。", "最初のThreadだけが残り、同じHeapを使い続けます。", "そのProcess内のThreadもすべて終了します。Threadの実行場所と共有資源がProcessに属するためです。"],
  "Threadごとに分かれるものは何ですか。": ["同じProcessで共有するHeapと開いたsocketだけです。", "マシン全体のKernelと物理CPUです。", "レジスタ状態、プログラムカウンタ、Stackなどです。各Threadが別の位置から実行を続けるために必要です。"],
  "同じProcessのThreadが共有するものは何ですか。": ["各Thread専用のStackとプログラムカウンタです。", "PIDの異なる別Processの仮想メモリ全体です。", "Heap、コード、開いたfileやsocketなどです。これにより連携しやすい一方、同時更新に注意が必要です。"],
  "共有Heapはなぜ便利で危険ですか。": ["すべての値が自動的に読み取り専用になるからです。", "Threadごとに必ず全データをコピーするからです。", "コピーせず同じデータを使えるので便利ですが、同時更新するとRace Conditionが起きるため危険です。"],
  "1コアでも複数Threadを進められるのはなぜですか。": ["1コアの中に無制限のCPUが隠れているからです。", "全Threadが同じ瞬間に同じ命令を必ず実行するからです。", "OSが実行するThreadを短時間で切り替えるためです。同じ瞬間の実行は基本1つでも、交代により全体を進められます。"],
  "Thread Poolを使う目的は何ですか。": ["requestごとにThreadを無制限に増やすためです。", "Threadが共有するHeapをすべて禁止するためです。", "Threadを毎回作る費用を減らし、同時に動かす数を制御するためです。"],
  "Contextには何が含まれますか。": ["WebページのCSSと画像だけが含まれます。", "CPUの製造番号だけが含まれます。", "次の命令位置やレジスタなど、処理を再開するための状態が含まれます。"],
  "I/O待ちで切り替える利点は何ですか。": ["待っているThreadにCPUを使わせ続けられます。", "I/Oの結果を確認せず削除できます。", "待ち時間に別のThreadを実行できることです。計算する仕事がないThreadからCPUを譲れます。"],
  "Context Switchが多すぎると何が困りますか。": ["保存や復元が不要になり、必ず高速になります。", "各ThreadのStack容量が自動的にゼロになります。", "状態の保存・復元とcacheの入れ替わりが増え、アプリ本来の仕事に使える時間が減ります。"],
  "Thread数の適正値が処理内容で変わるのはなぜですか。": ["Thread数は処理内容に関係なく、常に1000が最適だからです。", "CPU中心の処理ほど、待ち時間が無限に増えるからです。", "CPU中心かI/O待ち中心かで、CPUを譲れる時間が違うためです。多すぎても切り替えの費用が増えます。"],
  "1コアで本当に同時実行していますか。": ["はい。1コアでも無制限のThreadが同じ瞬間に実行されます。", "いいえ。1つのThreadが終わるまで、ほかは一切進みません。", "同じ瞬間に走るのは基本1Threadです。ただし短時間で交代するため、複数の処理が同時に進んでいるように見えます。"],
  "User Modeを作る目的は何ですか。": ["すべてのアプリへKernelと同じ権限を与えるためです。", "CPUを使わず、すべての処理をSSDで行うためです。", "アプリが重要資源を直接操作してOSや他Processを壊すことを防ぐためです。"],
  "System Callとは何ですか。": ["JavaScriptから別のWebサイトを呼ぶHTTP APIの名前です。", "CPUが電源を切るときだけ使う物理ボタンです。", "アプリがKernelの管理するfileやsocketなどの操作を正式に依頼する入口です。"],
  "単純な足し算にSystem Callは必要ですか。": ["常に必要です。加算はKernelだけが実行できます。", "必要です。足し算のたびにnetworkへ問い合わせます。", "通常は不要です。割り当て済みの値を使うCPU命令としてUser Modeで実行できます。"],
  "HTTP response送信は最終的に何へつながりますか。": ["画面のCSSを直接変更するCPU命令だけにつながります。", "相手のブラウザのメモリへ直接書く処理につながります。", "socketへの書き込みを依頼するSystem Callと、Kernelのnetwork処理につながります。"],
  "コンテナが独自Kernelを必ず持つわけではないとは、どういうことですか。": ["Container内ではOS機能を一切使えないという意味です。", "Containerごとに物理マシンを必ず1台用意するという意味です。", "Container内のProcessも基本的にホストKernelへSystem Callを行います。Processを分離してもKernelは共有できます。"]
};
const politeExplanation = (text) => String(text).split(/(「[^」]*」)/g).map((segment, index) => {
  if (index % 2) return segment;
  return segment
    .replace(/ため。/g, "ためです。")
    .replace(/なので。/g, "だからです。")
    .replace(/だから。/g, "だからです。")
    .replace(/ていない。/g, "ていません。")
    .replace(/ている。/g, "ています。")
    .replace(/ではない。/g, "ではありません。")
    .replace(/できない。/g, "できません。")
    .replace(/ならない。/g, "なりません。")
    .replace(/([^。！？]+)。/g, (sentence, body) => /(?:です|ます|ません|でした|ました|ください|でしょう|できます|なります|あります|います)$/.test(body.trim()) ? sentence : `${body}という説明です。`);
}).join("");
const quiz = (items) => `<div class="quiz">${items.map((item,i)=>{
  const bank = Array.isArray(item) ? quizChoiceBank[item[0]] : null;
  const normalized = Array.isArray(item)
    ? { question:item[0], correct:item[1], wrong:[item[2] || bank?.[0],item[3] || bank?.[1]].filter(Boolean), explanation:item[4] || bank?.[2] || item[1] }
    : { question:item.question, correct:item.choices[item.correct], wrong:item.choices.filter((_,index)=>index !== item.correct), explanation:item.explanation };
  if (!normalized.question || !normalized.correct || normalized.wrong.length < 2 || !normalized.explanation) {
    throw new Error(`確認問題の選択肢または解説が不足しています: ${normalized.question || `Q${i + 1}`}`);
  }
  const candidates = [
    { text: normalized.correct, correct: true },
    { text: normalized.wrong[0], correct: false },
    { text: normalized.wrong[1], correct: false }
  ];
  const offset = i % candidates.length;
  const choices = [...candidates.slice(offset), ...candidates.slice(0, offset)];
  return `<fieldset class="quiz-question"><legend><span>Q${i+1}</span>${normalized.question}</legend><div class="quiz-options">${choices.map((choice,j)=>`<label><input type="radio" name="quiz-${i}" value="${j+1}" data-correct="${choice.correct}"><span>${choice.text}</span></label>`).join("")}</div><button class="check-answer" type="button">答え合わせ</button><p class="quiz-feedback"></p><p class="quiz-explanation" hidden>${politeExplanation(normalized.explanation)}</p></fieldset>`;
}).join("")}</div>`;
const misconception = (wrong, right) => `<div class="misconception"><div><strong>よくある誤解</strong><p>${wrong}</p></div><div><strong>実際は</strong><p>${right}</p></div></div>`;
const experiment = (label, code, purpose, focus, result) => `<div class="experiment">${codeBlock(label,code)}<div class="experiment-grid"><div><strong>実験の目的</strong><p>${purpose}</p></div><div><strong>観察する箇所</strong><p>${focus}</p></div><div><strong>結果の読み方</strong><p>${result}</p></div></div></div>`;
const header = (chapter, reading="約15分") => {
  const terms = chapterTerms[chapter.id];
  return `<header class="chapter-header">
  <p class="eyebrow">${chapter.partTitle || "第1部 コンピュータの基礎"} · ${chapter.no}/${chapter.total || 10}</p>
  <h1>${chapter.title}</h1><p class="chapter-deck">${chapter.deck}</p>
  <div class="chapter-meta"><span>${reading}</span><span>実験あり</span><span>理解確認問題つき</span></div>
  ${terms?.length ? `<div class="chapter-terms">
    <h2>この章で使う用語</h2>
    <dl>${terms.map(([term, definition]) => `<div><dt>${term}</dt><dd>${definition}</dd></div>`).join("")}</dl>
  </div>` : ""}
</header>`;
};
const finish = (checks) => `${section(9,"章のまとめ",`<p>次のことを自分の言葉で説明できれば、この章の目的は達成できています。</p><ul>${checks.map(x=>`<li>${x}</li>`).join("")}</ul>`)}<div class="complete-panel"><p>読み終え、確認問題に答えられたら記録します</p><button class="complete-button" type="button"></button></div>`;

const cpu = {
  id: "cpu", no: 1, shortTitle: "CPUとは何か", title: "CPU：命令を実行する装置", deck: "アプリケーションの最下層では、CPUがメモリから命令を読み、値を計算し、結果を書き戻しています。まずは「プログラムが動く」という曖昧な表現を、具体的な機械の動作へ分解します。"
};
cpu.html = header(cpu, "約20分") +
section(1,"この章で分かること",`<ul class="lead-list"><li>CPUがプログラムを実行する中心装置である理由</li><li>fetch・decode・executeという命令実行の基本サイクル</li><li>クロック周波数と実行速度が同じ意味ではない理由</li><li>Web APIの1行の処理が最終的にCPU命令になる流れ</li></ul>`) +
section(2,"なぜCPUを学ぶのか",`<p>Javaで<code>total += price</code>と書けば、計算は終わったように見えます。しかし、負荷が上がると「CPU使用率が高い」「暗号化がCPUを使う」といった現象が現れます。CPUを知らなければ、これらは単なるメトリクスの名前に留まります。</p><p>CPUの役割は、メモリに並んだ<span class="term">命令</span>を読み、その指示どおりにデータを移動・計算・比較することです。命令とは、CPUが直接理解できる小さな操作です。CPUがなければ、ソースコードもOSもデータベースも「保存された数値の列」にすぎず、何も実行されません。</p>${callout("important","重要","CPUはJavaやHTTPを理解していません。足し算、比較、メモリからの読み出し、別の命令位置への移動といった小さな命令だけを実行します。上位の技術は、その組み合わせとして成り立っています。")}`) +
section(3,"具体例で理解する",`<p><code>1 + 2</code>を計算する場面を考えます。概念的には、CPUは「1を作業場所へ読む」「2を別の作業場所へ読む」「二つを加える」「結果3を保存する」という複数の命令を処理します。この作業場所をレジスタと呼び、第3章で詳しく扱います。</p><p>実際の命令はCPUの種類によって異なります。Apple Siliconが使うARM64と、多くのサーバーで使われるx86-64では命令の表現が違います。そのため、同じJavaScriptでも実行環境は対象CPUに合う命令へ変換する必要があります。</p>
    <h3>34ミリ秒の内訳を数える</h3>
    <p>後ろの図に出てくるリクエストAを追ってみましょう。</p>
    <ol><li><strong>0〜2 ms</strong>でCPUがJSONを解析します。</li>
      <li><strong>2〜32 ms</strong>はDBから結果が届くのを待ちます。</li>
      <li><strong>32〜34 ms</strong>でCPUが応答を作ります。AがCPUを使うのは合計4 msで、利用者が待つのは34 msです。</li></ol>
    <p>JSON解析の時間だけが半分になったとすると、全体は33 msになります。DB待ちが30 msから15 msになれば19 msです。「どの処理に何ミリ秒かかったか」を分けてみると、改善の効果を見積もれます。</p>`) +
section(4,"内部で何が起きているか",`<h3>命令実行サイクル</h3><p>単純化すると、CPUは次のサイクルを高速に繰り返します。最初に、次に実行する命令の場所を示す値を使い、メモリから命令を取得します。これをfetchと呼びます。次に、命令のビット列を「加算なのか、読み出しなのか」と解釈します。これがdecodeです。それから演算器などが処理します。これがexecuteです。最後に結果を書き戻し、次の命令へ進みます。</p>${flowDiagram("命令を処理する4段階", [
  ["FETCH", "命令を読む", "input"],
  ["DECODE", "意味を解釈", "process"],
  ["EXECUTE", "演算・移動", "process"],
  ["WRITE", "結果を保存", "store"]
], "結果を書き戻したら、次の命令を取得するFETCHへ戻ります。")}<h3>クロックと並列性</h3><p>クロックはCPU内部の動作を同期させる周期的な信号です。3 GHzは1秒に30億回の周期があるという意味ですが、「1秒に30億命令が必ず完了する」という意味ではありません。1命令に複数周期かかる場合も、逆に複数の命令を同時に進める場合もあります。キャッシュに必要なデータがなくメモリ待ちになれば、CPUは計算できずに待つこともあります。</p>${callout("note","補足","ここではCPUを一つの実行主体として説明しました。現代のCPUは、複数の命令の処理を少しずつ重ねるなどして、同じ時間により多くの仕事を進めます。まず基本サイクルを掴み、後の章で待ち時間や並行性を重ねます。")}`) +
section(5,"実際のWeb開発では",`<p>Web APIがJSONを解析し、認証トークンを検証し、レスポンスを圧縮する処理は、すべて最終的にCPU命令になります。JSON解析のように入力が増えるほど仕事が増える処理は、大きな入力ほどCPU時間を使います。TLSの暗号処理やパスワードハッシュもCPUを意図的に使います。</p><p>一方、データベースや外部APIの応答を待つ間、CPUがそのリクエストの命令を実行し続けているとは限りません。OSは待っている処理を止め、別の処理へCPUを割り当てられます。この切り替えを第9章で扱います。CPU使用率とレスポンスタイムは、同じものではありません。</p>`) +
section(6,"実験してみる",`<p>Python 3を使います。計算だけの処理と待つだけの処理で、経過時間とCPU時間がどう違うか予想してから実行しましょう。</p>
${experiment("macOS / Linux・Python 3", `python3 - <<'PYTHON'
import time

def measure(label, work):
    started = time.perf_counter()
    cpu_started = time.process_time()
    work()
    print(f"{label}: elapsed={time.perf_counter() - started:.3f} s, "
          f"cpu={time.process_time() - cpu_started:.3f} s")

measure("wait", lambda: time.sleep(0.3))
measure("calculate", lambda: sum(range(10_000_000)))
PYTHON`, "待つ仕事と計算する仕事を、それぞれ二つの時計で測ります。", "elapsedは時計で測った経過時間、cpuはPythonがCPUを使った時間です。waitではelapsedが約0.3秒でもcpuはほぼ0秒です。calculateでは二つの値が近くなります。", "sleepは待つだけのモデルです。DBなどから結果が届くまで、利用者が待った時間とアプリがCPUを使った時間が異なる理由を考えられます。")}`) +
section(7,"よくある誤解",`${misconception("CPU使用率が100%なら、コンピュータ全体が完全に限界です。","多くのtopでは、1つの論理コアを使い切ると1プロセスが100%と表示されます。8コアなら、ほかのコアには余力がある場合があります。")}${misconception("クロック周波数が2倍なら、どのプログラムも必ず2倍速くなります。","メモリ待ち、1命令あたりの仕事量、コア数、コンパイラの工夫なども影響します。周波数だけでは実際の速さを比べられません。")}`) +
section(8,"理解確認問題",quiz([
  ["CPUがなければ、メモリ上のプログラムはなぜ動かないのでしょうか。","プログラムは命令とデータを表すビット列でしかありません。CPUが命令を取得・解釈・実行して初めて、状態が変化するからです。"],
  ["fetch・decode・executeを、機械の動作として説明してください。","命令位置からビット列を読み、そのビット列が指示する操作と対象を判定し、演算器やデータ移動回路を動かして結果を保存します。"],
  ["APIの応答が遅いのにCPU使用率が低いとき、何が考えられますか。","DB、外部API、ディスク、ネットワークなどのI/O完了を待っている可能性があります。CPU以外の待ち時間を計測する必要があります。"],
  ["3 GHzのCPUが毎秒30億命令を完了する、と断言できないのはなぜですか。","1命令に必要な周期数は一定ではなく、複数命令の並行実行やメモリ待ちもあるため、クロック周期数と完了命令数は一致しないからです。"],
  ["JavaコードがARM64とx86-64の両方で動くとき、同じCPU命令が使われますか。","同じではありません。JVMのインタプリタやJITが、それぞれのCPUに合う命令を実行・生成します。"]
])) + finish(["CPUが命令を実行する装置であり、ソースコードを直接理解しないこと","命令実行サイクルの各段階","CPU使用時間とI/O待ち時間の違い","クロック周波数だけで性能を判断できない理由"]);
cpu.searchText = "CPU 命令 fetch decode execute クロック コア ARM64 x86-64 CPU使用率 JSON TLS 暗号 I/O待ち";

function flowDiagram(title, nodes, caption, options = {}) {
  return `<figure class="diagram" data-diagram="flow"${options.animate == null ? "" : ` data-animate="${options.animate}"`}>
  <p class="diagram-title">${title}</p>
  <div class="flow-diagram">${nodes.map(([label, detail, role, note], index) => `${index ? '<span class="flow-arrow" aria-hidden="true">→</span>' : ""}
    <div class="flow-node"${role ? ` data-visual-role="${role}"` : ""}${note ? ` data-step-note="${note}"` : ""}><span class="flow-label">${label}</span><small>${detail}</small></div>`).join("")}
  </div><figcaption>${caption}</figcaption></figure>`;
}
const btreeFigure = (title, caption) => `<figure class="concept-figure btree-figure">
  <p class="diagram-title">${title}</p>
  <div class="tree-node tree-root is-search-path" data-visual-role="input"><strong>Root</strong><span>50 | 100</span></div>
  <div class="tree-branches">
    <div class="tree-branch">
      <div class="tree-node"><strong>内部 A</strong><span>50未満</span></div>
      <div class="tree-leaves"><div class="tree-node tree-leaf" data-visual-role="store"><strong>Leaf A</strong><span>20, 35</span></div></div>
    </div>
    <div class="tree-branch tree-branch-split">
      <div class="tree-node is-search-path"><strong>内部 B</strong><span>境界キー 80</span></div>
      <div class="tree-leaves">
        <div class="tree-node tree-leaf is-search-path" data-visual-role="store"><strong>Leaf B</strong><span>70, 77</span></div>
        <div class="tree-node tree-leaf" data-visual-role="store"><strong>Leaf C</strong><span>80, 85</span></div>
      </div>
    </div>
    <div class="tree-branch">
      <div class="tree-node"><strong>内部 C</strong><span>100以上</span></div>
      <div class="tree-leaves"><div class="tree-node tree-leaf" data-visual-role="store"><strong>Leaf D</strong><span>120, 150</span></div></div>
    </div>
  </div>
  <figcaption class="visual-caption">${caption} 図では、検索の説明に使う一部のページを示しています。</figcaption>
</figure>`;
const makeChapter = (chapter, content) => {
  chapter.html = header(chapter, content.reading || "約18分") +
    section(1,"この章で分かること",`<ul class="lead-list">${content.goals.map(x=>`<li>${x}</li>`).join("")}</ul>`) +
    section(2,`なぜ${chapter.shortTitle.replace("とは何か","")}を学ぶのか`,content.why) +
    section(3,"具体例で理解する",content.example) +
    section(4,"内部で何が起きているか",content.internal) +
    section(5,"実際のWeb開発では",content.web) +
    section(6,"実験してみる",content.lab) +
    section(7,"よくある誤解",content.misunderstandings.map(x=>misconception(x[0],x[1])).join("")) +
    section(8,"理解確認問題",quiz(content.questions)) + finish(content.checks);
  chapter.searchText = content.search;
  return chapter;
};

const instructions = makeChapter({
  id:"instructions", no:2, shortTitle:"命令とは何か", title:"命令：CPUに渡す小さな指示", deck:"私たちが書くJavaやJavaScriptの1行は、そのままCPUに届くわけではありません。人が読めるコードから、CPUが読める命令までの階段を下ります。"
},{
  goals:["機械語とアセンブリ言語の違い","高級言語がCPU命令になるまでの流れ","条件分岐やループが小さな命令の組み合わせであること","命令セットがCPUごとに異なる理由"],
  why:`<p>「このコードは重い」と言うとき、本当に実行しているのは多数のCPU命令です。命令まで意識できると、関数呼び出しやループに仕事量があること、JavaのJITが何を最適化しているのかを具体的に考えられます。</p><p>命令が存在しなければ、CPUに「二つの値を足す」「同じ値なら別の場所へ進む」と伝える共通の形式がありません。CPUはソースコードの単語を理解しないため、電気回路が判定できる0と1の並びが必要です。</p>`,
  example:`<p><code>if (age &gt;= 18)</code>は、概念的には「ageを読みます」「18と比較します」「条件を満たさなければ別の命令位置へ移動します」という命令になります。命令位置を変える操作を<span class="term">分岐</span>と呼びます。</p><p>アセンブリ言語は、機械語を人が少し読みやすい記号で書いたものです。たとえば<code>ADD</code>は加算、<code>CMP</code>は比較を表します。実際の名前や使い方はARM64とx86-64で異なります。</p>
    <h3>条件の境目で次の命令を追う</h3>
    <p>未成年の場合だけ「未成年向けの処理」へ飛ぶ形にすると、17を渡した回は比較の後でその位置へ移ります。18を渡した回は条件を満たし、次に並ぶ「成人向けの処理」へ進みます。違いが出るのは比較した直後です。</p>
    <p>この例では、ソースの条件は「18以上」ですが、機械語側では「18未満なら飛ぶ」と組み立てることもできます。分岐命令を読むときは、飛ぶ条件と、飛ばずに次の命令へ進む条件を一組で確認しましょう。</p>`,
  internal:`${flowDiagram("ソースコードから実行まで",[["Javaソース","人が書く"],["Bytecode","JVM用の中間命令"],["機械語","CPUごとの命令"],["CPU","回路が実行"]],"Javaはまずbytecodeへ変換され、実行時にJVMが解釈したり、JITがよく使う部分を機械語へ変換したりします。")}
  <h3>命令の構成：操作と対象</h3><p>命令のビット列には「何をするか」と「どの値を使うか」が含まれます。足し算なら、加える二つの値がどこにあり、結果をどこへ置くかが必要です。値の場所には、次章のレジスタや第4章のメモリアドレスが使われます。</p><h3>ループの実体</h3><p><code>for</code>文は、初期値の準備、条件の比較、本体の命令、値の更新、比較位置へ戻る分岐に分かれます。100万回のループなら、その中の命令もおおむね100万回ずつ実行されます。ただしJITやコンパイラは、不要な処理を消したり複数回分をまとめたりする場合があります。</p>${callout("note","言葉の整理","コンパイルは別の形式へ前もって変換すること、インタプリトは実行しながら読み解くことです。現代の実行環境は両方を組み合わせることがあります。")}`,
  web:`<p>Javaアプリでは<code>javac</code>がソースをbytecodeへ変換し、JVMが実行します。JavaScriptエンジンも、頻繁に通るコードを機械語へ変換して高速化します。JSON解析、正規表現、暗号化のような処理は命令の集まりなので、入力やアルゴリズムによってCPU時間が変わります。</p><p>第7部ではJITを詳しく扱います。この章では「ソースコードとCPUの間に変換段階がある」と説明できれば十分です。</p>`,
  lab:`<p>Javaのクラスファイルに入ったbytecodeを見ます。JDKが入っている環境で試してください。</p>${experiment("Java","cat > Hello.java <<'EOF'\nclass Hello {\n  public static void main(String[] args) {\n    int total = 1 + 2;\n    System.out.println(total);\n  }\n}\nEOF\njavac Hello.java\njavap -c Hello","1行のJavaが複数のbytecode命令になる様子を見ます。","iconst、istore、invokevirtualなど、短い命令が順番に並ぶ点に注目します。","CPU命令そのものではありませんが、JVMも小さな命令列を扱っていることが分かります。")}`,
  misunderstandings:[["JavaやJavaScriptはCPUが直接理解しています。","CPUが直接実行するのは機械語です。JVMやJavaScriptエンジンが間をつなぎます。"],["ソースコード1行は、必ずCPU命令1個になります。","1行が多くの命令になることも、最適化で消えることもあります。1対1ではありません。"]],
  questions:[["条件分岐はCPUの上でどのように表せますか。","値を比較し、その結果に応じて次に読む命令位置を変更します。"],["機械語とアセンブリ言語の違いは何ですか。","機械語はCPUが読むビット列で、アセンブリ言語はそれを人が読みやすい記号で表したものです。"],["同じJavaのclassファイルが異なるCPUで動くのはなぜですか。","JVMが共通のbytecodeを、それぞれのCPUに合う形で実行するからです。"],["ループ回数が増えるとCPU時間が増えやすいのはなぜですか。","ループ内の命令を繰り返し実行するためです。"],["JITの役割を一文で説明してください。","実行中によく使われるコードを、そのCPU向けの機械語へ変換して高速化します。"]],
  checks:["ソースコードからCPU命令までの変換段階","分岐によってifやloopを実現できる理由","命令セットがCPUごとに異なること","JITが機械語を作る目的"], search:"命令 機械語 アセンブリ コンパイル インタプリタ bytecode JIT 分岐 loop ARM64 x86"
});

const registers = makeChapter({
  id:"registers", no:3, shortTitle:"レジスタ", title:"レジスタ：CPUの作業場所", deck:"CPUは計算する値を、まず小さく高速な保存場所へ置きます。レジスタを知ると、計算とメモリ読み出しの違いが見えてきます。"
},{
  goals:["レジスタがCPU内部の高速な保存場所であること","メモリより小さく速い理由","プログラムカウンタとスタックポインタの役割","関数呼び出しでレジスタが使われる流れ"],
  why:`<p>CPUが足し算をするとき、遠くにあるメモリの値を直接混ぜるのではなく、多くの場合は値をレジスタへ読みます。レジスタがなければ、途中の値を置くたびに比較的遅いメモリへ行く必要があり、CPUの速さを生かせません。</p><p>レジスタは数が少ないため、コンパイラは「どの値をレジスタに置くか」を考えます。足りない値はメモリへ一時退避します。この違いが、同じ計算でも実行速度が変わる理由の一つです。</p>`,
  example:`<p><code>int c = a + b;</code>を考えます。概念的には、aをレジスタR1へ読み、bをR2へ読み、R1とR2を足した結果をR3へ置き、最後にcの場所へ保存します。</p>${flowDiagram("足し算でのデータ移動",[["メモリ a","値を保持"],["レジスタ R1 / R2","CPU内へ読む"],["演算器","加算する"],["レジスタ R3","結果を保持"]],"レジスタ名は説明用です。実際の名前と命令はCPUによって異なります。")}
    <h3>値と値の置き場所を分ける</h3>
    <p>aが7、bが5だとします。値がどこにあるかを操作ごとに追いましょう。</p>
    <ol><li><strong>読み出す</strong>と、R1に7、R2に5が入ります。aとbのメモリ上の値はそのままです。</li>
      <li><strong>足す</strong>と、結果の12がR3に入ります。</li>
      <li><strong>保存する</strong>命令を実行して、cの場所に12を書き込みます。</li></ol>
    <p>レジスタを追うときは「どの場所から読んだか」「どの場所に結果を置いたか」を命令ごとに書き出せます。途中の値がレジスタにあると分かれば、後続の計算で同じ値をメモリから読み直す必要があるかも判断できます。</p>`,
  internal:`<h3>汎用レジスタ</h3><p>計算に使う値、途中の結果、データの番地などを一時的に置きます。上の足し算では、R1とR2に計算する値を置き、R3に結果を入れました。どの汎用レジスタを使うかは命令や呼び出し規約に従って決まります。</p>
    <h3>プログラムカウンタ（PC）</h3><p>CPUが命令をどこから読むかを示す番地を持ちます。命令が順番に並んでいれば次の位置へ進み、条件分岐や関数呼び出しでは、処理を続ける先の番地へ移ります。</p>
    <h3>スタックポインタ（SP）</h3><p>メモリ上にあるスタックの現在位置を示します。関数用の作業領域をスタック上に確保すると位置が動き、その領域を片づけると元の位置に戻ります。後ろの図では、<code>main</code>から<code>validate</code>を呼ぶときにSPが移る様子を示しています。</p><h3>レジスタが高速な理由</h3><p>レジスタはCPUコアの内部にあり、命令から直接指定できるよう作られています。ただし面積を使うため、主記憶のように何GBも用意できません。「少ないが速い」レジスタ、「大きいが遠い」メモリという段階があります。その間にはキャッシュという保存場所もあります。</p>${callout("important","重要","レジスタは変数そのものではありません。ソースコード上の変数は、ある瞬間にはレジスタにあり、別の瞬間にはメモリにあり、最適化で存在しなくなることもあります。")}`,
  web:`<p>関数を呼ぶとき、引数の一部はレジスタで渡されます。引数が多い場合や途中の値を保存したい場合はスタックも使います。この決まりを呼び出し規約と呼びます。JavaではJVMがこの違いを隠しますが、JITが作る機械語ではレジスタが使われています。</p><p>暗号化や画像処理では、一つの命令で複数の値を扱える特別なレジスタが使われることもあります。アプリのコードから見えなくても、高速化ライブラリの下では重要です。</p>`,
  lab:`<p>まず次のコマンドで自分の小さなプログラムを作ります。macOSではCommand Line Tools、LinuxではCコンパイラとGDBが必要です。</p>
    ${codeBlock("macOS / Linux・観察するプログラムを用意", `demo=$(mktemp -d)
cat > "$demo/registers.c" <<'C'
int main(void) {
    return 0;
}
C
cc -g -O0 "$demo/registers.c" -o "$demo/registers"`)}
    <p>ファイルを用意したのと同じ端末で、自分のOSに合う方を実行します。デバッガは、実行を一時停止して途中の状態を見られるツールです。</p>
    ${experiment("macOS・LLDB", `lldb --batch -o 'breakpoint set --name main' -o run -o 'register read' "$demo/registers"`, "自分で作ったプログラムをmainで止め、CPUレジスタを表示します。", "ARM64ではpc・sp、x86-64ではrip・rspを探します。数字は実行するたびに変わる場合があります。", "停止中にも命令の位置とスタックの位置が保存されていることを確認できます。")}
    ${experiment("Linux・GDB", `gdb --batch -ex 'break main' -ex run -ex 'info registers' "$demo/registers"`, "自分で作ったプログラムがmainへ入る時点のCPUレジスタを観察します。", "命令位置を表すpcまたはrip、スタックの位置を表すspまたはrspを探します。", "表示名が違っても、命令とスタックの位置をそれぞれ確かめられます。")}`,
  misunderstandings:[["レジスタは小さなRAMで、好きなだけ増やせます。","CPU命令が直接扱う限られた保存場所です。数や用途はCPUの設計で決まります。"],["Javaのローカル変数は常にレジスタに入ります。","JITの判断や実行地点によって、レジスタ、スタック、あるいは最適化で消えた状態になります。"]],
  questions:[["レジスタが必要な理由は何ですか。","CPUが計算中の値や位置情報をすぐ使える場所に置くためです。"],["プログラムカウンタには何が入りますか。","次に実行する命令の位置が入ります。"],["レジスタを主記憶のように大量に用意しないのはなぜですか。","CPU内部の面積を使い、命令で指定する仕組みも複雑になるからです。"],["コンテキストスイッチでレジスタを保存するのはなぜですか。","後で同じ処理を続きから再開するためです。"],["変数とレジスタは1対1ですか。","違います。実行時の割り当てと最適化によって変わります。"]],
  checks:["レジスタとメモリの役割・速度の違い","プログラムカウンタとスタックポインタ","計算で値がレジスタを通る流れ","レジスタ値を保存すれば処理を再開できる理由"], search:"レジスタ register PC program counter stack pointer 汎用レジスタ CPU キャッシュ 呼び出し規約"
});

const memory = makeChapter({
  id:"memory", no:4, shortTitle:"メモリとアドレス", title:"メモリ：番号付きの保存場所", deck:"実行中のコードとデータはメモリに置かれます。アドレスという番号で場所を指定する仕組みを、Webサーバーの変数からたどります。"
},{
  goals:["メモリとストレージの違い","byteとアドレスの関係","値を読む・書くという操作","キャッシュとメモリ待ちが性能へ与える影響"],
  why:`<p>Webサーバーがリクエストを処理するとき、受信したHTTPヘッダー、生成中のJSON、DBから読んだ行などはメモリに置かれます。メモリがなければ、CPUは計算する値を保てません。すべてをSSDへ置く方法では遅すぎます。</p><p>メモリ不足でプロセスが終了する、ヒープが増え続ける、キャッシュを増やすと速くなる、といった実務上の現象は、容量と速度が有限なメモリを複数の処理で分ける問題です。</p>`,
  example:`<p>メモリを、0番から番号が付いた小箱の列だと考えます。これは比喩です。実際には各位置に一定量のビットを保持する電子回路があり、CPUは<span class="term">アドレス</span>という数値を指定して読み書きします。通常、アドレスは1byteごとに割り当てられます。</p><p>整数が4byteなら、1つの値が連続する4個のアドレスを使います。文字列は文字を表すbyte列に加え、長さなどの情報を持つ場合があります。「変数名」は人向けの名前であり、CPUが最終的に使うのは場所を示す数値です。</p>
    <h3>次の要素の番地を求める</h3>
    <p>4 byteの整数が連続して並び、先頭の値が番地1000から始まるとします。先頭が使うのは1000〜1003です。2番目は1004〜1007、3番目は1008〜1011になります。要素の幅が固定なら、先頭から何byte離れているかを計算するだけで目的の番地が分かります。</p>
    <p>同じ場所を文字列として読む場合には、そのbyte列をどの文字コードとして解釈するかも必要です。番地はデータの位置を指定し、型や文字コードはその場所のデータをどう読むかを決めます。</p>`,
  internal:`<figure class="diagram" aria-labelledby="memory-address-title">
    <p class="diagram-title" id="memory-address-title">アドレスで値を指定します</p>
    <p>メモリの一部に文字列「AB」が保存されている例です。各行は1 byte分で、左列に番地、右列にその番地に入っている8ビットの値を示しています。</p>
    <table class="memory-address-table">
      <thead><tr><th scope="col">アドレス</th><th scope="col">1 byteの中身</th></tr></thead>
      <tbody>
        <tr><th scope="row"><code>0x1000</code></th><td><code>01000001</code>（文字 A）</td></tr>
        <tr><th scope="row"><code>0x1001</code></th><td><code>01000010</code>（文字 B）</td></tr>
        <tr><th scope="row"><code>0x1002</code></th><td><code>00000000</code>（終端）</td></tr>
        <tr><th scope="row"><code>0x1003</code></th><td><code>11100101</code>（別データ）</td></tr>
      </tbody>
    </table>
    <figcaption><code>0x1000</code>から番地順に読むと、A、Bの後に終端が来ます。この例では値0を終端にする形式を使っているので、読み取りは <code>0x1002</code> で止まります。番地の <code>0x</code> は16進数を表します。</figcaption>
  </figure><h3>メモリ読み出しの時間</h3><p>CPUの速さに比べると、主記憶からの読み出しは遅い処理です。その差を埋めるため、CPUは最近使ったデータや近くのデータを小さなキャッシュへ置きます。配列を先頭から順に読む処理が速いことが多いのは、近いデータをまとめて運びやすいためです。</p><h3>電源断とメモリ内容</h3><p>一般的な主記憶は、電力がなくなると内容を保てません。SSDは電源を切っても保持できますが、CPUから見ると遅い装置です。そのため、永続データはSSDへ、実行中にすばやく使うデータはメモリへ置きます。</p>${callout("note","次への接続","この章のアドレスは物理メモリの説明に近い単純な姿です。実際のプロセスが見るアドレスは、第2部で扱う仮想メモリによって変換されます。")}`,
  web:`<p>Javaのオブジェクト、Node.jsのBuffer、MySQLのBuffer Poolは、用途は違ってもメモリ領域を使います。DBのBuffer Poolはディスクから読んだpageをメモリに置き、次のSELECTでディスクを読まずに済む可能性を高めます。</p><p>メモリリークとは、もう役に立たないデータをプログラムが参照し続け、解放できない状態です。JavaやJavaScriptにGCがあっても、不要な参照が残れば回収されません。</p>`,
  lab:`${experiment("macOS / Linux","# メモリ総量と使用状況\n# macOS\nvm_stat\n\n# Linux\nfree -h\n\n# 両方でプロセスを確認\nps -o pid,rss,vsz,command -p $$","物理メモリと、今のシェルプロセスのメモリ量を見ます。","RSSは現在物理メモリに載っている量、VSZは仮想アドレス空間の大きさです。","プロセスが見る空間と、実際にRAMへ載る量が同じとは限らないことが分かります。")}`,
  misunderstandings:[["メモリとSSDは、容量が違うだけの同じ保存場所です。","メモリは高速ですが通常は揮発性です。SSDは遅い代わりに電源を切っても保存できます。"],["アドレスには必ず物理RAM上の場所が直接入っています。","アプリが使うのは通常は仮想アドレスで、OSとCPUが物理的な場所へ変換します。"]],
  questions:[["CPUがメモリを必要とするのはなぜですか。","実行する命令と、計算に使うデータを置くためです。"],["アドレスとは何ですか。","メモリ中の位置を指定する数値です。"],["4byteの整数は何個のbyteアドレスを使いますか。","連続する4個を使います。"],["配列を順番に読むと速いことが多いのはなぜですか。","近いデータをキャッシュへまとめて運びやすいからです。"],["GCがあってもメモリリークが起こるのはなぜですか。","不要なオブジェクトへの参照が残ると、GCが使用中だと判断するためです。"]],
  checks:["メモリとSSDの役割の違い","byteとアドレスの関係","CPUがメモリを読み書きする流れ","メモリキャッシュが必要な理由"], search:"メモリ RAM アドレス byte 物理 仮想 RSS VSZ cache SSD memory leak Buffer Pool"
});

const stackHeap = makeChapter({
  id:"stack-heap", no:5, shortTitle:"StackとHeap", title:"StackとHeap：寿命の異なるデータ領域", deck:"関数の途中経過と、関数を越えて生きるオブジェクトでは、管理のしかたが違います。二つの領域を、Javaの実行と結びつけます。"
},{
  goals:["Stack frameが関数呼び出しを管理する仕組み","Heapが大きさや寿命の異なるデータを置く理由","参照がオブジェクトの場所を示すこと","StackOverflowErrorとOutOfMemoryErrorの違い"],
  why:`<p>関数を呼ぶたびに、戻り先やローカル変数を安全に管理する必要があります。一方、関数が終わっても使うオブジェクトは、関数専用の場所には置けません。すべてを同じ方法で管理すると、いつ片づけてよいか分からなくなります。</p><p>StackとHeapを知ると、再帰が深すぎるエラー、JavaのGC、メモリリーク、スレッドごとのメモリと共有データの違いをつなげて理解できます。</p>`,
  example:`<p><code>createUser()</code>が<code>validate()</code>を呼ぶと、StackにはcreateUser用の枠の上にvalidate用の枠が積まれます。この枠をStack frameと呼びます。validateが終わると一番上の枠を外し、createUserの続きへ戻ります。</p><p>newで作ったUserオブジェクトはHeapに置かれ、Stack frameにはその場所を示す参照が置かれます。参照はオブジェクトそのものではなく、たどるための情報です。</p>
    <h3>関数が終わった後も参照が残る場合</h3>
    <p><code>createUser()</code>が作ったUserを呼び出し元が受け取り、ユーザー一覧に追加したとします。関数から戻ると<code>createUser()</code>の実行枠は外れます。ユーザー一覧にはUserへの参照が残っているので、あとから一覧を通してそのUserを読めます。</p>
    <p>今度は一覧から外した場合を考えます。他にも参照が残っていれば、そこから引き続き使えます。オブジェクトがいつ不要になるかは、作った関数の終了時点と、他の場所から参照できる期間を分けて考えます。</p>`,
  internal:`<figure class="diagram"><p class="diagram-title">一つのプロセスから見た単純なメモリ配置</p><div class="memory-map"><div class="memory-row grow"><span>高いアドレス</span><span data-direction="↓">Stack — 関数ごとの枠</span></div><div class="memory-row"><span>空き領域</span><span>必要に応じて利用します</span></div><div class="memory-row grow"><span>低いアドレス</span><span data-direction="↑">Heap — オブジェクト</span></div></div><figcaption>上下は番地の大小を表し、矢印はこの例で各領域が広がる向きを示します。Stackは上から下へ、Heapは下から上へ伸びる配置を描いています。実際の配置や向きは環境によって変わります。</figcaption></figure><h3>Stackの仕組み</h3><p>関数は最後に呼ばれたものから先に終わります。この「最後に入れたものを最初に取り出す」性質をLIFOと呼びます。そのため、Stack pointerを元の位置へ戻すだけで、関数の枠を素早く片づけられます。</p><h3>Heapの管理</h3><p>Heap上のオブジェクトは、作った関数より長く使われる場合があります。どの順番で不要になるか決まっていません。JavaではGCが、どこからも使われなくなったオブジェクトを探して回収します。Cではプログラマが解放を指示します。</p>${callout("important","重要","『primitiveはStack、objectはHeap』という丸暗記は正確ではありません。JITの最適化で置き場所が変わることがあります。まずは関数呼び出しの管理と、動的オブジェクトの管理という役割で理解してください。")}`,
  web:`<p>Webサーバーではリクエスト処理の関数がStackを使い、受信データやEntityなど多くのオブジェクトがHeapを使います。スレッドごとにStackがあり、Heapは同じJVM内のスレッドから共有されます。そのため、共有オブジェクトを書き換えると競合が起こり得ます。</p><p>深い再帰でStackの上限を超えると<code>StackOverflowError</code>になります。Heapにオブジェクトを確保できないと<code>OutOfMemoryError</code>になります。原因も調べ方も異なります。</p>`,
  lab:`${experiment("Java","cat > StackDemo.java <<'EOF'\nclass StackDemo {\n  static void recurse() { recurse(); }\n  public static void main(String[] args) { recurse(); }\n}\nEOF\njavac StackDemo.java\njava StackDemo","関数呼び出しを無限に重ね、Stackの上限を確認します。","最後に表示されるStackOverflowErrorと、繰り返されるrecurseの呼び出しに注目します。","呼び出しごとにStack frameが必要で、容量には上限があると分かります。")}${callout("warning","注意","エラーを意図的に起こす検証です。小さな検証プログラムだけで実行してください。")}`,
  misunderstandings:[["Stackは速く、Heapは遅いので、必ずStackを使うべきです。","用途と寿命が違います。長く共有するオブジェクトを関数終了と同時に消える枠だけでは管理できません。"],["参照変数にはオブジェクト本体が入っています。","参照には、Heap上のオブジェクトへ到達するための情報が入ります。"]],
  questions:[["Stack frameには何が入りますか。","戻り先、引数、ローカル変数、途中の値など、関数実行に必要な情報です。"],["StackがLIFOに向くのはなぜですか。","関数は最後に呼ばれたものから先に終了するためです。"],["Heapの片づけが複雑なのはなぜですか。","オブジェクトが不要になる順番が作成順や関数終了順と一致しないからです。"],["スレッド間で競合しやすいのはどちらのデータですか。","同じプロセスの複数スレッドから共有されるHeap上のデータです。"],["StackOverflowErrorとOutOfMemoryErrorの違いは何ですか。","前者は主に呼び出しStackの不足、後者はオブジェクト用Heapなどの確保失敗です。"]],
  checks:["Stack frameが関数呼び出しを支える仕組み","Heapが必要な理由","参照とオブジェクト本体の違い","二つの代表的なメモリエラーの違い"], search:"Stack Heap stack frame LIFO object reference 参照 GC StackOverflowError OutOfMemoryError Java"
});

const execution = makeChapter({
  id:"execution", no:6, shortTitle:"プログラムの実行", title:"プログラムの実行：ファイルからProcessへ", deck:"SSDに置かれたプログラムは、保存されているだけでは動きません。OSが準備し、CPUが最初の命令を読むまでを追います。"
},{
  goals:["実行ファイルと実行中のプロセスの違い","OSがコードとデータをメモリへ対応付ける流れ","ライブラリと動的リンクの基本","mainより前にも準備があること"],
  why:`<p>デプロイしたJARやNode.jsのファイルは、SSDにあるだけでは仕事をしません。誰かが起動を要求し、OSがメモリや権限を準備し、CPUへ最初の命令位置を渡す必要があります。この流れがなければ、同じプログラムを複数起動することも、安全に停止することもできません。</p><p>起動が遅い、ライブラリが見つからない、実行権限がない、環境変数が違う、といった問題はmain関数より前後の実行準備で起きます。</p>`,
  example:`<p>シェルで<code>curl https://example.com</code>と入力すると、シェルがcurlという実行ファイルを探し、OSへ新しいプログラムを実行するよう依頼します。OSは新しいプロセスを用意し、curlのコードや必要なライブラリを仮想メモリへ対応付けます。そしてCPUが開始位置の命令を実行します。</p>
    <h3>コマンドを入力してから最初の出力まで</h3>
    <p>シェルが<code>curl</code>を見つけられないと、実行ファイルをOSに渡す段階に到達しません。実行ファイルが見つかっても、権限などの理由でOSに起動を拒否される場合があります。起動できた後に名前解決で失敗したなら、それは<code>curl</code>の処理が始まった後の出来事です。</p>
    <p>三つとも端末にエラーが出ます。メッセージを読むときは、コマンドを探していたシェル、起動を担当するOS、起動後のアプリのうち、どこまで進んだかを確かめましょう。</p>`,
  internal:`${flowDiagram("保存されたファイルが動き始めるまで",[["実行要求","シェルなど"],["OSが検査","形式・権限"],["メモリを準備","code / data / stack"],["開始命令へ","CPUが実行"]],"細部はOSと実行形式によって異なりますが、ファイルを読み、実行状態を作る流れは共通します。")}
  <h3>実行ファイルの構造</h3><p>macOSのMach-OやLinuxのELFには、CPU命令だけでなく、どの部分を読み取り専用にするか、どのライブラリが必要か、開始位置はどこかといった情報があります。OSのローダーがこの情報を読みます。</p><h3>RAMへの読み込み</h3><p>OSはファイルと仮想メモリを対応付け、実際に必要になったpageから読み込むことがあります。pageはメモリを一定サイズに区切った単位です。このしくみを第2部の仮想メモリで詳しく扱います。</p><h3>mainまでの初期化</h3><p>言語の実行環境やライブラリの初期化が先に動くことがあります。JavaならOSがJVMを起動し、JVMがclassを読み込み、検査してからmainを呼びます。</p>`,
  web:`<p>コンテナのENTRYPOINTも、最終的にはコンテナ内のプロセスを起動します。KubernetesがPodを作っても、アプリのプロセスが正常に起動しなければリクエストは処理できません。CrashLoopBackOffでは、この起動と終了が繰り返されています。</p><p>共有ライブラリを使うと、暗号や圧縮などの実装を各プログラムへ丸ごと埋め込まずに利用できます。ただし必要な版が見つからないと起動に失敗します。</p>`,
  lab:`${experiment("macOS / Linux","# 実行ファイルの場所\ncommand -v curl\n\n# ファイル形式\nfile \"$(command -v curl)\"\n\n# 利用する共有ライブラリ\n# macOS\notool -L \"$(command -v curl)\"\n# Linux\nldd \"$(command -v curl)\"","curlが保存されたファイルであり、CPU向け形式と依存ライブラリを持つことを見ます。","Mach-OまたはELF、arm64またはx86_64、libsslなどのライブラリ名に注目します。","コマンド名の背後に実行ファイルとライブラリがあり、環境に合う形式が必要だと分かります。")}`,
  misunderstandings:[["実行すると、ファイル全体が必ず一度にRAMへコピーされます。","OSは必要な部分を必要になった時点で読み込むことがあります。"],["main関数が、そのプロセスで最初に実行されるCPU命令です。","ローダーや言語ランタイムの初期化などがmainより前に動く場合があります。"]],
  questions:[["実行ファイルとプロセスの違いは何ですか。","実行ファイルは保存されたコードと情報で、プロセスはOSが管理する実行中の状態です。"],["OSは実行前に何を確認しますか。","ファイル形式、CPUの種類、権限、必要なライブラリなどです。"],["ローダーの役割は何ですか。","実行ファイルを読み、コードやデータをメモリへ対応付け、開始できる状態にします。"],["Javaのmainより前に何が起きますか。","JVMの起動、classの読み込みや検査、ランタイムの初期化などです。"],["CrashLoopBackOffとこの章はどうつながりますか。","コンテナ内のプロセスが起動後に失敗し、再起動を繰り返す状態として理解できます。"]],
  checks:["ファイルとプロセスの違い","実行開始までのOSの仕事","共有ライブラリを使う理由","mainより前にも処理があること"], search:"program execution 実行ファイル process loader ELF Mach-O shared library main JVM ENTRYPOINT"
});

const process = makeChapter({
  id:"process", no:7, shortTitle:"Process", title:"Process：実行中プログラムの単位", deck:"同じサーバーで多数のプログラムを動かしても、通常は互いのメモリを勝手に壊しません。OSが実行状態をProcess単位で分けるからです。"
},{
  goals:["プログラムとProcessの違い","PIDとProcessが持つ資源","別Processのメモリが分離される理由","親子Processと終了状態の基本"],
  why:`<p>1台のコンピュータでは、Webサーバー、MySQL、監視Agentなどが同時に動きます。すべてが同じメモリとファイルの状態を無秩序に使うと、一つのバグが全体を壊します。OSは実行中のプログラムをProcessという単位で管理し、資源と権限の境界を作ります。</p><p>Processを理解すると、PID、環境変数、作業ディレクトリ、終了コード、Signal、コンテナのPID 1が一つの話につながります。</p>`,
  example:`<p>ターミナルを二つ開き、それぞれで同じ<code>python3 -m http.server</code>を起動すると、実行ファイルは同じでも別のProcessになります。それぞれ違うPIDを持ち、独立したメモリを使います。ただし同じportは同時に使えないため、資源をめぐる衝突は起こり得ます。</p>
    <h3>片方のサーバーだけを止める</h3>
    <p>同じPythonの実行ファイルから、片方は8000番、もう片方は8001番で待つサーバーを起動したとします。8000番のProcessが終了すると、そのProcessが持っていた待ち受け用のSocketが閉じます。8001番のProcessは独立しているので、そちらの接続は引き続き受け付けられます。</p>
    <p>両方が同じログファイルへ書いている場合は、終了した側のログもファイルに残ります。実行中のメモリやSocketの寿命と、ファイルに記録したデータの寿命は別々に考えます。</p>`,
  internal:`${flowDiagram("Processが持つ代表的な状態",[["PID","OS内の番号"],["仮想メモリ","code / stack / heap"],["開いた資源","file / socket"],["実行状態","running / waiting"]],"Processは単なるコードではなく、実行を再開・制御するための状態をまとめた単位です。")}
  <h3>仮想メモリによる分離</h3><p>Process AとProcess Bが同じ数値のアドレスを使っても、通常は別の物理メモリへ変換されます。OSとCPUが対応表を切り替えるためです。許可なく別Processのメモリを読むと保護違反になります。</p><h3>Processの状態</h3><p>CPUで命令を実行中の状態、実行できるが順番待ちの状態、I/Oを待つ状態などがあります。OSは状態を見ながら、どのProcessのThreadへCPUを渡すか決めます。</p><h3>親Processと子Process</h3><p>LinuxやmacOSでは、Processが別のProcessを作れます。シェルがコマンドを起動すると、シェルが親、コマンドが子になります。子の終了コードを親が受け取ることで、成功か失敗かを判断できます。</p>${callout("note","言葉の整理","PIDはProcess IDの略で、OS内でProcessを見分ける番号です。再起動後や別の時刻には同じ番号が別Processへ使われるため、永久的な識別子ではありません。")}`,
  web:`<p>一般的なJava Webアプリでは、1つのJVM Processの中に複数Threadを作ってリクエストを処理します。Node.jsも1つのProcessから始まりますが、clusterや複数Podを使えばProcessが増えます。Processが落ちると、その中の全Threadとメモリ上の状態が失われます。</p><p>コンテナはProcessを含む隔離環境です。VMのように必ず別Kernelを持つのではなく、ホストのKernelを共有しながらNamespaceやcgroupsで見え方と資源を制限します。第11部で詳しく扱います。</p>`,
  lab:`${experiment("macOS / Linux","# 自分のシェルのPID\necho $$\n\n# PID、親PID、状態、コマンドを表示\nps -o pid,ppid,state,command -p $$\n\n# シェルから子Processを作る\nsleep 30 &\nps -o pid,ppid,state,command | grep '[s]leep 30'","親のシェルと、そこから起動した子Processの関係を見ます。","PIDとPPID、sleepの状態を示す文字に注目します。","同じユーザーの操作でも、コマンドごとに実行状態が分かれていると分かります。")}`,
  misunderstandings:[["プログラムとProcessは同じものです。","プログラムは保存されたファイル、Processはそれを実行するためのメモリや状態を持つ単位です。"],["Processが違えば、絶対に影響し合いません。","メモリは分離されますが、CPU、ファイル、port、ディスク容量など共有資源を奪い合うことがあります。"]],
  questions:[["同じプログラムから複数Processを作れますか。","作れます。それぞれ別のPIDと実行状態を持ちます。"],["PIDは永久に同じ対象を指しますか。","指しません。終了後に番号が再利用されることがあります。"],["別Processが同じ仮想アドレスを使えるのはなぜですか。","Processごとに物理メモリへの対応表が異なるからです。"],["PPIDは何を示しますか。","そのProcessを作った親ProcessのPIDです。"],["Processが落ちるとThreadはどうなりますか。","そのProcess内のThreadもすべて終了します。"]],
  checks:["実行ファイルとProcessの違い","Processが持つ代表的な状態と資源","PIDとPPIDの意味","Process間の分離と共有資源の両方"], search:"Process プロセス PID PPID parent child state virtual memory process isolation exit code container"
});

const thread = makeChapter({
  id:"thread", no:8, shortTitle:"Thread", title:"Thread：Process内の実行単位", deck:"一つのWebサーバーが同時に複数リクエストを扱えるのは、実行の流れを増やせるからです。共有するものと、Threadごとに分かれるものを整理します。"
},{
  goals:["ProcessとThreadの違い","ThreadごとのStackと共有Heap","複数Threadが必要になる理由","共有データからRace Conditionが起きる入口"],
  why:`<p>Processが資源を入れる箱だとすれば、Threadはその中で命令を進める流れです。これは比喩です。実際にはThreadごとに、次の命令位置、レジスタ状態、Stackがあり、OSのスケジューラが実行機会を与えます。</p><p>Threadが一つだけなら、DBの応答を待つ間にほかのリクエストを処理できない設計もあり得ます。複数Threadを使えば待ち時間を活用できますが、共有データを同時に書く問題が生まれます。</p>`,
  example:`<p>JavaのWebサーバーへリクエストAとBが同時に届いたとします。Thread AはAのStackでControllerを実行し、Thread BはBのStackで別のControllerを実行します。二つが同じSingletonのフィールドを書き換えると、そのオブジェクトはHeapで共有されるため競合します。</p>
    <h3>リクエストごとの値はどこにあるか</h3>
    <p>Thread AのControllerがローカル変数<code>userId</code>へ7を入れ、Thread Bが同じメソッドのローカル変数へ8を入れても、それぞれの呼び出しに属するので混ざりません。両方がSingletonの同じ<code>lastUserId</code>フィールドを書き換えるなら、後から書いた値が共有フィールドに残ります。</p>
    <p>ローカル変数が共有オブジェクトを指す場合もあります。変数を各Threadが持つことと、その参照先を各Threadが独占することを区別すると、安全に共有できる範囲を見つけやすくなります。</p>`,
  internal:`<figure class="diagram"><p class="diagram-title">一つのProcessに複数のThread</p><div class="memory-map"><div class="memory-row"><span>Process共有</span><span>Code / Heap / 開いたFile・Socket</span></div><div class="memory-row"><span>Thread A</span><span>Register / Program Counter / Stack A</span></div><div class="memory-row"><span>Thread B</span><span>Register / Program Counter / Stack B</span></div><div class="memory-row"><span>Thread C</span><span>Register / Program Counter / Stack C</span></div></div><figcaption>共有範囲が大きいので連携はしやすい一方、同時更新には注意が必要です。</figcaption></figure><h3>Threadごとの再開地点</h3><p>Thread Aを止めてBを動かした後、Aを続きから再開するには、Aのプログラムカウンタとレジスタを保存しておく必要があります。関数呼び出しの途中経過はA専用のStackにあります。</p><h3>Heapと資源の共有</h3><p>同じProcessのThreadは同じHeap上のオブジェクトを見られます。データをコピーせず連携できますが、同じ値を同時に更新すると、結果が実行順に依存します。これをRace Conditionと呼び、第9部で詳しく扱います。</p>${callout("important","重要","同時に扱うことと、同じ瞬間に実行することは別です。1コアでも短時間でThreadを切り替えれば複数処理を進められます。複数コアでは本当に同じ時刻に実行されることもあります。")}`,
  web:`<p>JavaのThread Poolは、作成済みの複数Threadへリクエスト処理を割り当てます。毎回Threadを作る費用を減らせますが、Thread数を増やしすぎるとStackのメモリと切り替えの費用が増えます。</p><p>JavaScriptのブラウザやNode.jsでは、JavaScriptコードを主に1つのThreadで実行しながら、I/O完了をEvent Loopで受け取る設計が中心です。「Threadが1つだから何も同時に進まない」という意味ではありません。</p>`,
  lab:`${experiment("Java","cat > Threads.java <<'EOF'\nclass Threads {\n  public static void main(String[] args) throws Exception {\n    for (int i = 0; i < 3; i++) {\n      new Thread(() -> {\n        System.out.println(Thread.currentThread().getName());\n        try { Thread.sleep(10000); } catch (Exception ignored) {}\n      }).start();\n    }\n    Thread.sleep(10000);\n  }\n}\nEOF\njavac Threads.java\njava Threads &\njps\njstack $(jps | awk '/Threads/{print $1}')","一つのJVM Processの中に複数Threadがあることを見ます。","mainとThread-0などの名前、各ThreadのStack traceに注目します。","Process IDが一つでも、複数の命令の流れとStackが存在すると分かります。")}`,
  misunderstandings:[["Threadは軽いProcessなので、メモリも完全に分かれています。","Threadは同じProcessのHeapや開いた資源を共有し、Stackとレジスタ状態は別に持ちます。"],["Thread数を増やせば、Webサーバーは必ず速くなります。","CPUコア、I/O待ち、メモリ、DB connection数などに合わない数では、待ちと切り替えが増えます。"]],
  questions:[["Threadごとに分かれるものは何ですか。","レジスタ状態、プログラムカウンタ、Stackなどです。"],["同じProcessのThreadが共有するものは何ですか。","Heap、コード、開いたfileやsocketなどです。"],["共有Heapはなぜ便利で危険ですか。","コピーなしで連携できますが、同時更新でRace Conditionが起きるためです。"],["1コアでも複数Threadを進められるのはなぜですか。","OSが実行するThreadを短時間で切り替えるからです。"],["Thread Poolを使う目的は何ですか。","Threadを毎回作る費用を減らし、同時実行数を制御するためです。"]],
  checks:["ProcessとThreadの違い","Thread専用とProcess共有のデータ","1コアで複数Threadを進める仕組み","Thread数を増やしすぎる問題"], search:"Thread スレッド stack heap shared Thread Pool Race Condition Java Event Loop concurrent parallel"
});

const contextSwitch = makeChapter({
  id:"context-switch", no:9, shortTitle:"Context Switch", title:"Context Switch：CPU担当の交代", deck:"CPUコアより多くの処理が動けるように見えるのは、OSが実行状態を保存して担当をすばやく交代しているからです。"
},{
  goals:["Contextが処理再開に必要な状態であること","OSがThreadを切り替える流れ","切り替えに費用がある理由","CPU待ちとI/O待ちの違い"],
  why:`<p>1台のPCでは、ブラウザ、エディタ、Docker、音楽アプリが同時に動いて見えます。CPUコア数より多いThreadを進めるには、あるThreadを止めて別のThreadへ交代する必要があります。これがなければ、1つの処理がCPUを使っている間、ほかは長く待つことになります。</p><p>ただし交代は無料ではありません。Threadを増やしすぎたWebサーバーで、仕事より切り替えに時間を使うことがあります。</p>`,
  example:`<p>1コアでThread AとBを動かします。OSはAのレジスタと次の命令位置を保存し、Bの保存済み状態をCPUへ戻します。するとBは以前止まった場所から続けられます。しばらく後に逆の操作をします。</p>
    <h3>「もう一度走れる」と「走り始める」</h3>
    <p>AがSocketのデータ待ちに入り、その間にBが走っているとします。Aにデータが届くと、Aは再びCPUを使える状態になります。この時点でCPUがまだBを実行していれば、Aはスケジューラに選ばれるまで実行待ちです。</p>
    <p>Aが再開したとき、最初から処理をやり直す必要はありません。保存していた位置とレジスタを戻せば、待ちに入った処理の続きが進みます。通信の待ち時間と、実行できるようになってからCPUを待つ時間を区別できます。</p>`,
  internal:`${flowDiagram("AからBへのContext Switch",[["Aを停止","割り込みなど"],["Aを保存","register / PC"],["Bを復元","保存状態を戻す"],["Bを実行","続きから再開"]],"Contextは文脈という意味で、ここでは実行を続けるためのCPU状態を指します。")}
  <h3>切り替えのタイミング</h3><p>一定時間を使ったとき、I/O待ちに入ったとき、より優先度の高い仕事が実行可能になったときなどです。OSのスケジューラが、実行可能なThreadから次を選びます。</p><h3>Context Switchのコスト</h3><p>状態の保存と復元そのものに命令が必要です。さらにCPU cacheにAのデータが入っていても、Bが必要とするデータは入っていないかもしれません。切り替え後にメモリ読み出しが増えることがあります。</p><h3>I/O待ちとCPUの譲渡</h3><p>socketからデータが届くまで待つThreadは、CPUで計算する仕事がありません。OSは待ち状態にし、ほかのThreadを実行できます。これが多数のWebリクエストを進められる基本の一つです。</p>`,
  web:`<p>JavaのThread Poolを極端に大きくすると、Context Switchと各ThreadのStackメモリが増えます。逆に小さすぎると、ThreadがDB待ちの間に新しいリクエストを開始できません。CPU中心かI/O中心かによって適切な数が変わります。</p><p>メトリクスを見るときは、CPU使用率だけでなく、実行待ちの長さ、Context Switch数、I/O待ち、Thread Pool queueも合わせます。原因がCPU計算なのか、外部待ちなのかを分けるためです。</p>`,
  lab:`${experiment("macOS","# 1秒間隔でシステム統計を5回\nvm_stat 1 5\n\n# ProcessとThreadのCPU利用を観察\ntop -stats pid,command,cpu,threads","複数ProcessとThreadがCPU時間を分ける様子を見ます。","CPU列とThread数が同じ意味ではない点に注目します。","Threadが存在しても、常にCPUを使っているわけではないと分かります。")}${experiment("Linux","vmstat 1 5\npidstat -w 1 5","実行待ちとContext Switchの回数を見ます。","vmstatのr、cs、pidstatのcswch/sに注目します。","負荷をかけると切り替え回数や実行待ちが変化することが分かります。")}`,
  misunderstandings:[["Context Switch中もアプリの仕事が進みます。","切り替え自体は必要な管理作業ですが、アプリの計算やリクエスト処理そのものではありません。"],["I/O待ちのThreadはCPUを100%使って待ちます。","Blocking I/OではOSがThreadを待ち状態にし、CPUをほかへ渡せます。busy waitは別です。"]],
  questions:[["Contextには何が含まれますか。","次の命令位置やレジスタなど、実行を再開するための状態です。"],["I/O待ちで切り替える利点は何ですか。","待ち時間にほかのThreadを実行できることです。"],["Context Switchが多すぎると何が困りますか。","保存・復元の仕事とcacheの入れ替わりが増えます。"],["Thread数の適正値が処理内容で変わるのはなぜですか。","CPU中心かI/O待ち中心かで、CPUを譲れる時間が変わるからです。"],["1コアで本当に同時実行していますか。","同じ瞬間に走るのは基本的に1Threadで、短時間の切り替えにより同時に進んで見えます。"]],
  checks:["Context Switchの保存・復元手順","I/O待ちでCPUを譲れる理由","切り替えに費用がある理由","Thread数と性能が単純比例しないこと"], search:"Context Switch コンテキストスイッチ scheduler interrupt I/O wait CPU Thread Pool vmstat pidstat"
});

const modes = makeChapter({
  id:"user-kernel-mode", no:10, shortTitle:"User Mode / Kernel Mode", title:"User Mode / Kernel Mode：権限の境界", deck:"アプリがCPUやメモリを自由に操作できたら、一つのバグでOS全体が壊れます。CPUの権限を分け、必要な仕事だけKernelへ依頼する仕組みを学びます。"
},{
  goals:["User ModeとKernel Modeの権限差","Kernelだけが重要資源を直接管理する理由","System Callが境界を越える正式な入口であること","HTTP送信もKernelの仕事につながること"],
  why:`<p>ブラウザやWebサーバーにバグがあっても、通常はOSのメモリ全体を書き換えたり、ほかのProcessの通信を勝手に読んだりできません。CPUが実行権限を分け、OSの中心であるKernelだけに危険な操作を許すからです。</p><p>この境界がなければ、普通のJavaScriptの間違いでもマシン全体が停止しかねません。安全性だけでなく、複数アプリへ公平に資源を配るためにも必要です。</p>`,
  example:`<p>Javaプログラムがファイルを読みたいとします。User ModeのJavaコードは、ディスク装置へ直接命令しません。JVMと標準ライブラリを通して、Kernelへ「このファイルを開き、データを読んでください」と依頼します。この正式な依頼がSystem Callです。</p>
    <h3>ファイルを読む前に誰が何を調べるか</h3>
    <p>Javaプログラムが設定ファイルを開くと、Kernelはパスをたどり、呼び出したProcessに読み取り権限があるかを調べます。許可されればアプリはファイルを読み進められ、権限がなければエラーを受け取ります。中身のJSONをどう解釈するかは、その後のアプリの仕事です。</p>
    <p>権限エラーが出たときは、入力したファイル名が正しいか、どのユーザーとしてプログラムが動いているかを順に確認できます。JSONの修正が必要になるのは、ファイルを読めた後に解析で失敗した場合です。</p>`,
  internal:`${flowDiagram("アプリから装置まで",[["Javaアプリ","User Mode"],["System Call","境界を越える"],["Kernel","権限と状態を確認"],["Device","disk / NIC"]],"完了後は結果とともにUser Modeへ戻ります。アプリが装置を直接管理するのではありません。")}
  <h3>CPUによる権限検査</h3><p>現在どのmodeで命令を実行しているかをCPUが持っています。装置の制御やメモリ管理に関わる特権命令をUser Modeで実行しようとすると、CPUは拒否してKernelへ制御を移します。</p><h3>System Callという境界</h3><p>通常の関数呼び出しは同じ権限のまま進みます。System Callでは決められたCPU命令を使い、Kernel Modeへ入り、引数を検査し、Kernel内の処理を行い、結果を返します。入力を検査しないと、アプリが不正なアドレスを渡してKernelを壊せるためです。</p><h3>User Modeで完結する処理</h3><p>レジスタ内の足し算や、すでに割り当てられたメモリへの書き込みはUser Modeでできます。file、socket、process、時刻などOSが管理する資源を使うときにSystem Callが必要です。</p>${callout("important","第2部への橋","File Descriptor、Socket、Virtual MemoryはKernelが管理します。次の部ではSystem Callを入口に、OSの内部を詳しく追います。")}`,
  web:`<p>WebサーバーがHTTP requestを受けるとき、NICが受けたpacketをKernelが処理し、socketへデータを置きます。アプリはread系のSystem Callを通して受け取ります。responseを返すときもwrite系のSystem Callを使います。</p><p>コンテナ内のアプリも、基本的にはホストのKernelへSystem Callを行います。そのため、コンテナの隔離には「どのSystem Callを許すか」というsecurity profileが関係します。</p>`,
  lab:`${experiment("macOS","# curlが行うSystem Callを追跡\nsudo dtruss -f curl -s https://example.com","curlの1回の通信が多数のOS機能を使うことを見ます。","open、read、write、connectなどの名前に注目します。","HTTPという上位の操作が、fileやsocketを扱うSystem Callへ分解されると分かります。")}${experiment("Linux","strace -f -e trace=network,read,write curl -s https://example.com","LinuxではstraceでSystem Callを追跡します。","socket、connect、sendto、recvfrom、read、writeと戻り値に注目します。","アプリとKernelの境界を実際の呼び出し列として確認できます。")}${callout("warning","権限について","macOSのdtrussはsudoが必要で、システム設定によって制限されます。内容を理解できる自分の検証環境だけで実行してください。")}`,
  misunderstandings:[["Kernelは、バックグラウンドで動く普通のProcessです。","KernelはCPUの高い権限で動くOSの中心部分で、通常のProcessとは異なります。"],["System Call中は別のCPUへ処理を送っています。","同じCPUコア上で権限modeを切り替えてKernelの命令を実行する場合が一般的です。"]],
  questions:[["User Modeを作る目的は何ですか。","アプリが重要資源を直接操作し、OSや他Processを壊すことを防ぐためです。"],["System Callとは何ですか。","アプリがKernelへ管理対象の操作を正式に依頼する入口です。"],["単純な足し算にSystem Callは必要ですか。","通常は不要です。CPU命令をUser Modeで実行できます。"],["HTTP response送信は最終的に何へつながりますか。","socketへの書き込みを依頼するSystem Callと、Kernelのnetwork処理につながります。"],["コンテナが独自Kernelを必ず持つわけではないとは、どういうことですか。","コンテナ内ProcessもホストKernelへSystem Callを行うため、Kernelを共有するのが基本です。"]],
  checks:["二つのmodeの権限差と目的","System Callの検査と復帰の流れ","User Modeだけでできる処理とKernelへ頼む処理","HTTP通信とSystem Callのつながり"], search:"User Mode Kernel Mode system call syscall privilege file socket NIC strace dtruss container"
});

const chapters = [cpu, instructions, registers, memory, stackHeap, execution, process, thread, contextSwitch, modes];
courseParts[0].chapters = [...chapters];
globalThis.courseKit = { makeChapter, flowDiagram, btreeFigure, section, callout, quiz, misconception, experiment, codeBlock, finish };
globalThis.registerPart = (partId, partChapters) => {
  const part = courseParts.find((item) => item.id === partId);
  if (!part) throw new Error(`Unknown course part: ${partId}`);
  part.chapters = partChapters;
  chapters.push(...partChapters);
};
