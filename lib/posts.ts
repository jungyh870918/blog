export type Post = {
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  content: string; // HTML string
};

export type Category = {
  id: string;
  label: string;
  posts: { slug: string; title: string }[];
  comingSoon?: boolean;
};

export const categories: Category[] = [
  {
    id: 'os',
    label: 'OS',
    posts: [
      { slug: 'os-1', title: 'HARDWARE' },
      { slug: 'os-2', title: 'MEMORY' },
      { slug: 'os-3', title: 'SCHEDULING I' },
      { slug: 'os-4', title: 'SCHEDULING II' },
      { slug: 'os-5', title: 'DEADLOCK' },
    ],
  },
  {
    id: 'ts',
    label: 'TS',
    posts: [
      { slug: 'ts-1', title: 'GENERICS' },
      { slug: 'ts-2', title: 'CONDITIONAL' },
    ],
  },
  {
    id: 'node',
    label: 'NODE',
    posts: [],
    comingSoon: true,
  },
  {
    id: 'msa',
    label: 'MSA',
    posts: [],
    comingSoon: true,
  },
];

export const posts: Post[] = [
  {
    slug: 'os-1',
    category: 'os',
    title: 'Operating Systems From Scratch (1)',
    content: `
<p>컴퓨터는 기본적으로 <strong>하드웨어, 소프트웨어, 데이터</strong>를 이용해 인간의 문제를 해결하는 장치입니다. 프로그램은 하드디스크에 존재하다가 램으로 올라오고, CPU가 이를 한 줄씩 읽으며 실행됩니다. 이 단순한 흐름 속에 운영체제의 모든 원리가 숨어 있습니다.</p>

<h2>1. 메모리 계층의 존재 이유: 영구성 vs 속도</h2>
<p>왜 메모리는 하나로 통합되지 않고 하드디스크와 램으로 나뉘어 있을까요? 답은 각 장치의 물리적 한계 때문입니다.</p>
<ul>
  <li><strong>하드디스크(HDD/SSD):</strong> 데이터를 영구 보관하지만 속도가 매우 느립니다.</li>
  <li><strong>램(RAM):</strong> 속도가 백만 배 빠르지만 전원이 꺼지면 데이터가 날아갑니다.</li>
</ul>
<p>우리는 하드디스크의 <strong>영구성</strong>과 램의 <strong>속도</strong>를 모두 얻기 위해, 프로그램을 실행할 때 하드디스크에서 램으로 데이터를 <strong>복사(Copy)</strong>하여 사용합니다. 원본을 보존하면서도 빠른 실행 속도를 얻기 위한 전략입니다.</p>

<div class="example-box">
  <strong>🤖 AI 에이전트 개발자의 시선:</strong><br/>
  대규모 언어 모델(LLM)을 로컬에서 구동할 때, 수십 GB의 가중치 파일을 HDD에서 RAM(또는 VRAM)으로 올리는 과정이 바로 이 '복사' 과정입니다. RAM 용량이 커질수록 더 많은 프로세스를 동시에 올릴 수 있고, 이는 전체 시스템의 처리 성능(Multiprogramming)과 직결됩니다.
</div>

<h2>2. CPU의 한계와 컴파일러</h2>
<p>CPU는 오직 0과 1(기계어)만 이해합니다. 우리가 짠 소스코드를 CPU가 읽을 수 있도록 기계어 프로그램(<code>.exe</code> 등)으로 번역해 주는 것이 바로 <strong>컴파일러</strong>입니다.</p>
<p>중요한 점은 <strong>CPU는 하드디스크에 직접 접근할 권한이 없다</strong>는 것입니다. 하드디스크는 너무 느리고 크기 때문에, CPU가 거기서 특정 프로그램을 직접 찾으려면 모든 공간을 뒤져야 하는 비효율이 발생합니다. 그래서 CPU는 오직 '제한된 크기의 빠른 램'에 올라온 정보만 처리하도록 설계되었습니다.</p>

<h2>3. 운영체제: 자원 관리자(Resource Manager)</h2>
<p>하드디스크에 500개의 프로그램이 있고 램에는 50개만 올라갈 수 있다면, 어떤 50개를 올릴지 결정해야 합니다. 여기서 운영체제가 등장합니다.</p>
<ul>
  <li><strong>Long-term Scheduler (장기 스케줄러):</strong> 어떤 프로그램을 램으로 올릴지(Resource Allocation) 결정합니다.</li>
  <li><strong>Short-term Scheduler (단기 스케줄러):</strong> 램에 올라온 프로그램 중 어떤 것에 CPU 자원을 줄지 결정합니다.</li>
</ul>
<p>이처럼 CPU, 램, 하드디스크라는 <strong>리소스</strong>를 어떤 프로세스에게 배분할지 결정하는 알고리즘의 집합이 운영체제의 핵심입니다.</p>

<h2>4. RAM의 공간 분리: OS Space &amp; User Space</h2>
<p>컴퓨터를 켜는 순간 운영체제는 램에 상주합니다. 이때 운영체제가 차지하는 공간을 <strong>OS SPACE</strong>, 우리가 사용하는 일반 프로그램(워드, 포토샵 등)이 사용하는 공간을 <strong>USER SPACE</strong>라고 부릅니다.</p>

<h2>5. 프로그램의 실행 상태와 Turn Around Time</h2>
<p>모든 프로그램은 실행되는 동안 세 가지 상태를 반복합니다.</p>
<ol>
  <li><strong>Execution (Running):</strong> CPU에 의해 실제로 실행되는 상태.</li>
  <li><strong>I/O Event:</strong> 키보드 입력이나 파일 저장 등 입출력 장치를 기다리는 상태.</li>
  <li><strong>Waiting:</strong> 자원을 할당받기 위해 대기하는 상태.</li>
</ol>

<div class="formula">$$Turn\\ Around\\ Time = Waiting\\ Time + Burst\\ Time + I/O\\ Time$$</div>

<p>프로그램이 램에 올라온 순간부터 완전히 제거될 때까지 걸린 총 시간을 <strong>Turn Around Time(TAT)</strong>이라고 하며, 이 시간 동안 위 세 가지 상태가 어떤 순서로 일어날지는 프로그램의 로직과 OS의 스케줄링에 달려 있습니다.</p>

<div class="example-box">
  <strong>💡 실무 예시 (워드 프로세서):</strong><br/>
  워드 프로그램을 실행하면 프로그램 본체와 데이터(문서)가 함께 램으로 올라갑니다. 이후 프로그램은 사용자의 키보드 인풋(I/O Event)을 기다리고, 인풋이 들어오면 CPU가 이를 계산(Execution)하여 데이터를 수정합니다. 이 과정에서 하드디스크는 저장 장치인 동시에 인풋/아웃풋 장치로서 기능하게 됩니다.
</div>

<div class="reference-section">
  <h2>학습 참고 자료</h2>
  <ul class="reference-list">
    <li><a href="https://en.wikipedia.org/wiki/Memory_hierarchy" target="_blank">📊 Memory Hierarchy (Wikipedia)</a> — 메모리 계층 구조와 속도 차이에 대한 상세 도표</li>
    <li><a href="https://www.geeksforgeeks.org/introduction-of-operating-system/" target="_blank">💻 OS as a Resource Manager</a> — 운영체제의 자원 관리 역할에 대한 기술 문서</li>
    <li><a href="https://en.wikipedia.org/wiki/Process_state" target="_blank">🔄 Process State Transition Diagram</a> — 프로세스 상태 변화 모델링</li>
  </ul>
</div>
    `,
  },
  {
    slug: 'os-2',
    category: 'os',
    title: 'Operating Systems From Scratch (2)',
    content: `
<p>프로그램이 램에 올라올 때, OS는 단순히 "빈자리에 넣어"라고 말하지 않습니다. 메모리 관리의 핵심은 <strong>추상화</strong>에 있으며, 그 정점에는 <strong>페이징(Paging)</strong>이 있습니다.</p>

<h2>1. 주소 바인딩: 논리 주소와 물리 주소</h2>
<p>프로그램 내부의 주소(Logical Address)와 실제 램의 주소(Physical Address)는 다릅니다. 컴파일된 코드는 0번지부터 시작한다고 믿지만, 실제로는 램의 5000번지에 있을 수 있습니다. 이 매핑을 관리하는 것이 OS의 첫 번째 임무입니다.</p>

<h2>2. 연속 할당의 한계: 단편화(Fragmentation)</h2>
<p>메모리를 통째로(Contiguous) 할당하던 시절, 두 가지 골칫거리가 생겼습니다.</p>
<ul>
  <li><strong>고정 파티션:</strong> 방 크기가 정해져 있어 작은 프로그램이 들어가면 남는 공간이 생깁니다. (내부 단편화)</li>
  <li><strong>가변 파티션:</strong> 딱 맞춰 넣었지만 프로그램이 나갔다 들어왔다 하면서 자잘한 빈 공간들이 생깁니다. (외부 단편화)</li>
</ul>

<div class="example-box">
  <strong>🤖 AI 에이전트 개발자의 시선:</strong><br/>
  LLM 인퍼런스 서버를 구축할 때 <strong>KV Cache</strong> 관리는 이 '단편화' 문제와 매우 흡사합니다. 문맥(Context)의 길이가 제각각이기 때문에 메모리를 효율적으로 쓰지 못하면 성능이 급락합니다. 그래서 vLLM 같은 최신 라이브러리는 OS의 페이징 기법을 벤치마킹한 <strong>PagedAttention</strong>을 사용하여 이 문제를 해결합니다.
</div>

<h2>3. 페이징(Paging): 조각내어 정복하라</h2>
<p>외부 단편화를 완벽히 해결하는 방법은 프로그램을 일정한 크기의 <strong>페이지(Page)</strong>로 쪼개는 것입니다. 실제 램도 같은 크기의 <strong>프레임(Frame)</strong>으로 나눕니다.</p>
<p>이제 프로그램은 램의 연속된 공간이 아닌, 여기저기 흩어진 빈 프레임에 들어가도 됩니다. 사용자 눈에만 하나로 보이면 그만이기 때문입니다.</p>

<h2>4. 페이지 테이블과 MMU</h2>
<p>흩어진 조각들을 찾기 위해 <strong>페이지 테이블(Page Table)</strong>이라는 지도가 필요합니다. CPU가 논리 주소를 던지면, 하드웨어 장치인 <strong>MMU</strong>가 지도를 보고 물리 주소로 빛의 속도로 변환합니다.</p>

<div class="formula">$$Physical\\ Address = (Frame\\ Number \\times Page\\ Size) + Offset$$</div>

<div class="example-box">
  <strong>💡 실무적 환기:</strong><br/>
  우리가 짠 코드에서 <code>Segmentation Fault</code>가 발생하는 이유는, 프로세스가 자신에게 할당되지 않은 페이지(주소 공간)를 넘보려 할 때 MMU와 OS가 이를 차단하기 때문입니다. 페이징은 단순한 공간 관리를 넘어 <strong>보호(Protection)</strong>의 기능도 수행합니다.
</div>

<h2>5. 가상 메모리의 기초: Demand Paging</h2>
<p>페이징이 가능해지면 굳이 프로그램 전체를 램에 올릴 필요가 없습니다. 당장 쓸 조각만 올리고 나머지는 하드디스크에 두는 <strong>Demand Paging</strong>이 가능해집니다. 이로써 우리는 8GB 램에서도 16GB짜리 대작 게임을 돌릴 수 있게 되었습니다.</p>

<div class="reference-section">
  <h2>학습 참고 자료</h2>
  <ul class="reference-list">
    <li><a href="https://en.wikipedia.org/wiki/Paging" target="_blank">📄 Paging Concept (Wikipedia)</a> — 페이징의 역사와 페이지 테이블의 하드웨어적 구현</li>
    <li><a href="https://upload.wikimedia.org/wikipedia/commons/3/32/Virtual_address_space_and_physical_address_space_relationship.svg" target="_blank">🔄 Logical to Physical Mapping Diagram</a> — 주소 변환 과정을 보여주는 시각 자료</li>
  </ul>
</div>
    `,
  },
  {
    slug: 'os-3',
    category: 'os',
    title: 'Operating Systems From Scratch (3)',
    content: `
<p>메모리에 여러 프로그램이 올라와 있다면(Multiprogramming), 이제 OS는 <strong>"누구에게 CPU 연산 자원을 먼저 줄 것인가"</strong>를 결정해야 합니다. 이것이 바로 스케줄링의 핵심입니다.</p>

<h2>1. 좋은 스케줄링의 5가지 척도</h2>
<p>알고리즘의 효율성을 판단하기 위해 OS는 다음 5가지 지표를 사용합니다. 시스템의 성격에 따라 최적화 목표가 달라집니다.</p>
<ul>
  <li><strong>CPU Utilization (이용률):</strong> CPU가 얼마나 쉬지 않고 일하는가? (최대화)</li>
  <li><strong>Throughput (처리량):</strong> 단위 시간당 완료된 프로세스의 수 (최대화)</li>
  <li><strong>Turnaround Time (반환 시간):</strong> 실행부터 종료까지 걸린 총 시간 (최소화)</li>
  <li><strong>Waiting Time (대기 시간):</strong> 준비 큐에서 CPU를 기다린 순수 시간 (최소화)</li>
  <li><strong>Response Time (응답 시간):</strong> 첫 번째 응답이 나올 때까지의 시간 (최소화)</li>
</ul>

<div class="formula">$$Turn\\ Around\\ Time = Waiting\\ Time + Burst\\ Time + I/O\\ Time$$</div>

<div class="example-box">
  <strong>🤖 현대 개발자의 시선:</strong><br/>
  클라우드 인프라 아키텍처에서 <strong>Throughput</strong>은 서버 비용 최적화(단위 시간당 최대 처리)와 직결되며, <strong>Response Time</strong>은 사용자 경험(UX)과 직결됩니다. API 성능 지표인 P99 Latency는 사실상 OS의 스케줄링 결과물인 Response Time의 집합체라고 볼 수 있습니다.
</div>

<h2>2. 스케줄링 분석 도구: 간트 차트 (Gantt Chart)</h2>
<p>알고리즘을 시각화할 때 간트 차트를 사용합니다. 특정 시점에 어떤 프로세스가 CPU를 점유하고 있는지 한눈에 파악하여 평균 대기 시간을 계산할 수 있습니다.</p>

<h2>3. FCFS (First-Come, First-Served)</h2>
<p>가장 고전적이고 직관적인 방식입니다. 준비 큐에 도착한 순서대로 CPU를 할당합니다. 하지만 치명적인 문제가 있습니다.</p>
<ul>
  <li><strong>Convoy Effect (호위 효과):</strong> 실행 시간이 매우 긴 프로세스가 앞에 있으면, 뒤에 있는 짧은 프로세스들이 하염없이 기다리게 되어 시스템 전체의 효율이 급격히 떨어지는 현상입니다.</li>
</ul>

<h2>4. SJF (Shortest Job First)</h2>
<p>기다리는 프로세스들 중 <strong>CPU 실행 시간(Burst Time)이 가장 짧은 것</strong>에게 우선순위를 줍니다. 이 방식은 수학적으로 <strong>평균 대기 시간을 최소화</strong>하는 가장 최적(Optimal)의 알고리즘입니다.</p>
<ul>
  <li><strong>한계점:</strong> 현실에서는 프로세스가 CPU를 얼마나 쓸지 미리 알 수 없습니다. 그래서 과거 기록을 바탕으로 예측하는 기법을 사용하곤 합니다.</li>
</ul>

<div class="example-box">
  <strong>💡 실무적 환기:</strong><br/>
  우리가 작성하는 비동기 워커(예: Celery, BullMQ)에서 짧은 태스크와 긴 태스크가 섞여 있을 때, 긴 태스크가 큐를 점령하지 않도록 큐를 분리하거나 우선순위를 조정하는 것은 사실상 SJF의 철학을 애플리케이션 계층에서 재현하는 과정입니다.
</div>

<h2>5. 비선점(Non-preemptive)의 한계</h2>
<p>FCFS와 SJF는 한 번 CPU를 잡으면 스스로 끝내거나 I/O를 만나기 전까지 뺏기지 않는 <strong>비선점</strong> 방식입니다. 응답 속도가 생명인 현대의 대화형 시스템(UI, 웹 서버)에서는 한계가 명확합니다. 이를 해결하는 '선점형' 방식은 다음 챕터에서 이어집니다.</p>

<div class="reference-section">
  <h2>학습 참고 자료</h2>
  <ul class="reference-list">
    <li><a href="https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/" target="_blank">💻 CPU Scheduling Strategies &amp; Criteria</a> — 스케줄링 성능 지표와 기본 알고리즘 가이드</li>
    <li><a href="https://en.wikipedia.org/wiki/Shortest_job_next" target="_blank">📊 Shortest Job First (SJF) Explained</a> — SJF의 최적성과 실제 예측 모델의 한계</li>
  </ul>
</div>
    `,
  },
  {
    slug: 'os-4',
    category: 'os',
    title: 'Operating Systems From Scratch (4)',
    content: `
<p>비선점형 방식은 한 프로세스가 CPU를 독점할 수 있다는 치명적인 약점이 있었습니다. 현대 운영체제는 이를 해결하기 위해 실행 중인 프로세스를 중단시키고 강제로 CPU를 뺏어오는 <strong>선점(Preemptive)</strong> 개념을 도입했습니다.</p>

<h2>1. Round Robin (RR): 현대 멀티태스킹의 정석</h2>
<p>모든 프로세스에게 동일한 시간인 <strong>Time Quantum(타임 슬라이스)</strong>을 부여하고, 시간이 다 되면 다음 프로세스에게 CPU를 넘겨주는 방식입니다. 현대의 모든 시분할 시스템의 기초가 됩니다.</p>
<ul>
  <li><strong>Time Quantum의 딜레마:</strong>
    <ul>
      <li>너무 크면? FCFS와 다를 바 없어지며 호위 효과(Convoy Effect)가 발생합니다.</li>
      <li>너무 작으면? <strong>Context Switching</strong> 오버헤드가 커져서 배보다 배꼽이 더 커집니다.</li>
    </ul>
  </li>
</ul>

<div class="example-box">
  <strong>🤖 에이전틱 개발자의 시선:</strong><br/>
  우리가 사용하는 Node.js의 Event Loop나 Go의 Goroutine 스케줄러가 수천 개의 동시 요청을 매끄럽게 처리하는 원동력이 바로 이 타임 슬라이싱입니다. 특정 작업이 CPU를 독점하지 못하도록 하여 '전체 시스템의 응답성'을 유지하는 것이 현대 비동기 프로그래밍의 핵심입니다.
</div>

<h2>2. 우선순위 스케줄링과 기아 현상</h2>
<p>중요도가 높은 프로세스(예: 시스템 커널 작업)에 높은 우선순위를 주어 먼저 처리하는 방식입니다. 하지만 여기에는 무서운 함정이 있습니다.</p>
<ul>
  <li><strong>Starvation (기아 현상):</strong> 우선순위가 낮은 프로세스가 끊임없이 들어오는 높은 순위 프로세스들에게 밀려 평생 실행되지 못하는 상태입니다.</li>
  <li><strong>Aging (노화):</strong> 대기 시간이 길어질수록 우선순위를 조금씩 높여주어, 언젠가는 반드시 실행되도록 보장하는 해결책입니다.</li>
</ul>

<h2>3. MLQ vs MLFQ: 계급 사회에서 능력 중심 사회로</h2>
<p>프로세스의 성격에 따라 여러 개의 큐를 운영하는 방식입니다.</p>
<ul>
  <li><strong>MLQ (Multi-level Queue):</strong> 큐 사이에 계급이 고정되어 있습니다. 상위 큐가 비어있지 않으면 하위 큐는 영원히 기다려야 합니다.</li>
  <li><strong>MLFQ (Multi-level Feedback Queue):</strong> 프로세스가 실행 중에 큐 사이를 이동할 수 있습니다. CPU를 너무 많이 쓰는 놈은 하위 큐로 쫓아내고, 응답이 중요한 대화형 작업은 상위 큐로 올립니다.</li>
</ul>

<div class="example-box">
  <strong>💡 실무적 환기:</strong><br/>
  쿠버네티스(K8s) 환경에서 특정 파드(Pod)가 CPU 리소스를 과하게 점유하면 Throttling이 걸리는 것은 OS의 MLFQ가 CPU 집중형 프로세스를 하위 단계로 밀어내는 논리와 유사합니다. 전체 시스템의 공평성(Fairness)을 유지하기 위한 필연적인 장치입니다.
</div>

<h2>4. 동기화(Synchronization)의 서막: 경쟁 상태</h2>
<p>스케줄링에 의해 프로세스들이 쉴 새 없이 교체되다 보니 새로운 문제가 발생합니다. 바로 공유 자원에 동시에 접근할 때 발생하는 <strong>Race Condition(경쟁 상태)</strong>입니다.</p>
<ul>
  <li><strong>상황:</strong> 두 프로세스가 같은 변수 <code>count</code>를 동시에 읽고 수정하려 할 때, 실행 순서에 따라 결과값이 달라지는 현상입니다.</li>
  <li><strong>임계 구역 (Critical Section):</strong> 공유 자원에 접근하는 코드 영역으로, 반드시 한 번에 하나의 프로세스만 진입해야 합니다.</li>
</ul>

<div class="example-box">
  <strong>⚠️ 주의점:</strong><br/>
  멀티스레드 코드에서 가끔 데이터가 꼬이는 이유는 논리적 흐름은 맞더라도, 실제 하드웨어 계층에서 일어나는 찰나의 'Context Switch'를 완벽히 통제하지 못하기 때문입니다. 개발자는 반드시 <code>Mutex</code>나 <code>Semaphore</code> 같은 동기화 도구를 통해 이 장벽을 세워야 합니다.
</div>

<div class="reference-section">
  <h2>학습 참고 자료</h2>
  <ul class="reference-list">
    <li><a href="https://en.wikipedia.org/wiki/Round-robin_scheduling" target="_blank">🔄 Round Robin Scheduling - Wikipedia</a> — 타임 퀀텀 설정의 전략과 효율성 분석</li>
    <li><a href="https://www.geeksforgeeks.org/multilevel-feedback-queue-scheduling-mlfq/" target="_blank">📉 Multilevel Feedback Queue (MLFQ)</a> — 현대 OS가 채택한 동적 우선순위 조절 알고리즘 가이드</li>
    <li><a href="https://en.wikipedia.org/wiki/Race_condition" target="_blank">⚡ Race Condition Explained</a> — 데이터 정합성을 해치는 경쟁 상태의 시나리오와 해결책</li>
  </ul>
</div>
    `,
  },
  {
    slug: 'os-5',
    category: 'os',
    title: 'Operating Systems From Scratch (5)',
    content: `
<p>공유 자원을 안전하게 보호하면서도 시스템이 멈추지 않게 관리하는 것은 OS의 가장 어려운 숙제입니다. 이번 장에서는 동기화의 구체적인 해법과, 자원 경쟁의 극단적 부작용인 <strong>데드락(Deadlock)</strong>, 그리고 데이터 저장의 핵심인 <strong>파일 시스템</strong>을 다룹니다.</p>

<h2>1. 임계 구역 문제 해결의 3대 조건</h2>
<p>어떤 동기화 알고리즘이든 다음 세 가지를 반드시 만족해야 합니다.</p>
<ul>
  <li><strong>Mutual Exclusion (상호 배제):</strong> 임계 구역에는 한 번에 한 프로세스만 진입.</li>
  <li><strong>Progress (진행):</strong> 진입하려는 프로세스가 있다면 결정을 무한히 미뤄선 안 됨.</li>
  <li><strong>Bounded Waiting (한정 대기):</strong> 언젠가는 반드시 들어갈 수 있도록 대기 시간이 한정되어야 함.</li>
</ul>

<h2>2. 피터슨 알고리즘 (Peterson's Algorithm)</h2>
<p>소프트웨어적으로 동기화를 구현한 고전적 해법입니다. <code>flag</code>(의사 표시)와 <code>turn</code>(양보) 변수를 사용하여 두 프로세스가 서로의 순서를 조율합니다.</p>

<div class="example-box">
  <strong>🤖 에이전틱 개발자의 시선:</strong><br/>
  현대 멀티코어 환경에서는 CPU의 명령어 재배치(Reordering) 때문에 피터슨 알고리즘이 예상대로 작동하지 않을 수 있습니다. 그래서 현대 언어(Java, Go 등)는 하드웨어 레벨의 <strong>Atomic 연산</strong>이나 <strong>메모리 배리어(Memory Barrier)</strong>를 통해 이 철학을 계승하여 동기화를 보장합니다.
</div>

<h2>3. 세마포어 (Semaphore): 깃발을 이용한 자원 관리</h2>
<p>에츠허르 다익스트라가 고안한 방식으로, 정수형 변수 <code>S</code>를 사용하여 자원의 개수를 관리합니다.</p>
<ul>
  <li><strong>P 연산 (wait):</strong> 자원을 사용하기 위해 값을 감소시킴. 값이 0 이하면 대기.</li>
  <li><strong>V 연산 (signal):</strong> 자원 사용 후 값을 증가시켜 대기 중인 프로세스를 깨움.</li>
</ul>

<h2>4. 데드락 (Deadlock): 영원한 기다림</h2>
<p>데드락은 다음 4가지 조건이 <strong>동시에</strong> 충족될 때 발생합니다.</p>

<table class="data-table">
  <thead>
    <tr><th>조건</th><th>설명</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Mutual Exclusion</strong></td><td>자원은 한 명만 독점 가능</td></tr>
    <tr><td><strong>Hold and Wait</strong></td><td>자원을 가진 상태에서 다른 자원을 기다림</td></tr>
    <tr><td><strong>No Preemption</strong></td><td>남이 가진 자원을 뺏을 수 없음</td></tr>
    <tr><td><strong>Circular Wait</strong></td><td>대기 고리가 원형을 이룸 (A➔B➔A)</td></tr>
  </tbody>
</table>

<div class="example-box">
  <strong>💡 실무 예시 (은행원 알고리즘):</strong><br/>
  OS는 자원을 할당하기 전, 이 할당이 데드락을 유발할지 시뮬레이션하는 <strong>은행원 알고리즘(Banker's Algorithm)</strong>을 사용할 수 있습니다. 안전한 상태(Safe State)일 때만 자원을 줌으로써 데드락을 '회피'하는 보수적인 전략입니다.
</div>

<h2>5. 파일 시스템 (File System)의 탄생</h2>
<p>메모리는 휘발성입니다. 데이터를 영구히 저장하기 위해서는 하드디스크 같은 보조기억장치가 필요하며, 이를 관리하는 논리적 체계가 바로 <strong>파일 시스템</strong>입니다.</p>
<ul>
  <li><strong>정의:</strong> OS가 데이터를 파일 단위로 저장하고 관리하는 방식.</li>
  <li><strong>핵심 임무:</strong> 파일의 생성, 삭제, 수정뿐만 아니라 디렉토리 구조를 통해 사용자가 데이터를 쉽게 찾을 수 있도록 돕습니다.</li>
</ul>

<div class="example-box">
  <strong>⚠️ 주의점:</strong><br/>
  현대 분산 시스템 아키텍처에서는 '분산 파일 시스템(HDFS, S3 등)'이 중요합니다. 하지만 그 근간은 결국 OS의 파일 시스템 레이아웃(Inode, 블록 할당 등)에 기반합니다. 파일 시스템에 대한 이해는 데이터베이스 인덱스 설계나 로그 시스템 구축의 기초 체력이 됩니다.
</div>

<div class="reference-section">
  <h2>학습 참고 자료</h2>
  <ul class="reference-list">
    <li><a href="https://en.wikipedia.org/wiki/Semaphore_(programming)" target="_blank">🚩 Semaphore - Wikipedia</a> — 세마포어의 정수 연산과 프로세스 제어 원리</li>
    <li><a href="https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system-2/" target="_blank">🏦 Banker's Algorithm Simulation</a> — 은행원 알고리즘의 안전 상태 계산 예시</li>
    <li><a href="https://en.wikipedia.org/wiki/File_system" target="_blank">📁 File System Foundations</a> — 다양한 파일 시스템 구조와 할당 방식</li>
  </ul>
</div>
    `,
  },
  {
    slug: 'ts-1',
    category: 'ts',
    title: 'TypeScript Deep Dive: Generics',
    subtitle: '타입의 재사용성을 넘어, 코드의 정합성을 설계하는 프로그래밍 기법',
    content: `
<p>단순히 타입을 선언하는 단계를 넘어, <strong>'타입 간의 관계'</strong>를 정의하는 시점이 오면 우리는 제네릭(Generics)이라는 강력한 도구를 마주하게 됩니다. 이는 현대 웹 아키텍처에서 데이터의 흐름을 안전하게 보장하는 핵심 장치입니다.</p>

<h2>1. 제네릭(Generics): 정적 타입의 유연성</h2>
<p>제네릭은 함수나 클래스를 정의할 때 타입을 확정 짓지 않고, <strong>실행 시점(Invocation)</strong>에 타입을 주입받는 기법입니다. 이는 중복 코드를 제거하면서도 타입 추론(Type Inference)의 이점을 완벽히 누리게 해줍니다.</p>

<h3>왜 <code>any</code>가 아닌 제네릭인가?</h3>
<p><code>any</code>를 사용하면 타입 시스템의 보호를 포기하는 것과 같습니다. 반면 제네릭은 입력받은 타입의 정보를 끝까지 유지합니다.</p>

<pre><code>// Bad: 타입 정보를 잃어버림 (리턴값도 any)
function identityAny(arg: any): any {
  return arg;
}

// Good: 입력 타입 T를 기억하고 그대로 반환함
function identity&lt;T&gt;(arg: T): T {
  return arg;
}

const result = identity("Hello TS"); // result는 명확히 string 타입으로 추론됨</code></pre>

<div class="example-box">
  <strong>🏗️ 실무 응용: 데이터 저장소(Repository) 패턴</strong>
  <p>어떤 데이터가 들어와도 일관된 인터페이스를 제공하는 클래스를 설계할 때 제네릭은 필수입니다.</p>
  <pre><code>interface Entity { id: number; }

class BaseRepository&lt;T extends Entity&gt; {
  private items: T[] = [];

  add(item: T): void { this.items.push(item); }
  getById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }
}

interface User extends Entity { name: string; }
const userRepo = new BaseRepository&lt;User&gt;();
userRepo.add({ id: 1, name: "Jung" }); // 자동 완성 및 타입 체크 지원</code></pre>
</div>

<h2>2. 제네릭 제약 조건 (Generic Constraints)</h2>
<p>제네릭이 너무 자유로우면 내부에서 특정 속성에 접근할 때 에러가 발생합니다. <code>extends</code>를 사용하여 최소한의 자격을 부여해야 합니다.</p>

<h3>keyof 연산자와의 조합</h3>
<p>객체의 특정 키값에 접근할 때, 존재하지 않는 키를 참조하는 실수를 컴파일 타임에 잡아낼 수 있습니다.</p>

<pre><code>function getProperty&lt;T, K extends keyof T&gt;(obj: T, key: K) {
  return obj[key];
}

const car = { brand: "Tesla", model: "Model 3", year: 2024 };

getProperty(car, "brand"); // OK
getProperty(car, "price"); // Error: "price"는 car의 키가 아님!</code></pre>

<h2>3. 유틸리티 타입 마스터하기</h2>
<p>이미 정의된 타입을 변형하여 새로운 비즈니스 로직에 맞게 재가공하는 도구들입니다.</p>

<h3>Partial&lt;T&gt; &amp; Required&lt;T&gt;: 유연한 수정 작업</h3>
<div class="example-box">
  <pre><code>interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

// 일부 필드만 수정하는 함수 (Partial 활용)
function updateProfile(id: string, updates: Partial&lt;UserProfile&gt;) {
  // updates에는 name만 들어올 수도, email만 들어올 수도 있음
}

// 모든 필드가 반드시 채워져야 하는 초기화 로직 (Required 활용)
type StrictProfile = Required&lt;UserProfile&gt;;</code></pre>
</div>

<h3>Pick&lt;T, K&gt; &amp; Omit&lt;T, K&gt;: 뷰 모델(View Model) 설계</h3>
<pre><code>interface LargeProduct {
  id: string;
  internalCode: string; // 내부 노출 금지
  name: string;
  price: number;
}

// 사용자에게 보여줄 요약 정보 (Pick)
type ProductSummary = Pick&lt;LargeProduct, 'name' | 'price'&gt;;

// 내부 코드를 제외한 정보 (Omit)
type PublicProduct = Omit&lt;LargeProduct, 'internalCode'&gt;;</code></pre>

<h2>4. Agentic AI 시대의 타입 설계 전략</h2>
<div class="pro-tip">
  <strong>🤖 Agentic AI 시대의 타입 설계 전략</strong><br/>
  AI 에이전트(GPT, Claude 등)에게 코딩을 시킬 때, 가장 강력한 프롬프트는 다름 아닌 <strong>'정교한 타입 정의'</strong>입니다.
  <ol>
    <li><strong>추론 가이드:</strong> 제네릭을 통해 데이터의 인-아웃 관계를 명확히 하면, AI는 런타임 에러가 없는 코드를 생성할 확률이 높아집니다.</li>
    <li><strong>자동 완성의 힘:</strong> 유틸리티 타입으로 범위를 좁혀주면 AI는 엉뚱한 속성을 참조하지 않습니다.</li>
    <li><strong>Self-Documenting:</strong> 타입 자체가 문서가 되어, 사람이든 AI든 코드의 의도를 즉각적으로 파악하게 합니다.</li>
  </ol>
</div>

<div class="reference-section">
  <h2>📚 더 읽어볼 자료</h2>
  <ul class="reference-list">
    <li><a href="https://www.typescriptlang.org/docs/handbook/2/generics.html" target="_blank">🔗 TypeScript Official: Generics Handbook</a></li>
    <li><a href="https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts" target="_blank">🔗 Utility Types Source Code (GitHub)</a> — 유틸리티 타입이 실제로 어떻게 구현되어 있는지(Mapped Types) 직접 확인해보세요.</li>
  </ul>
</div>
    `,
  },
  {
    slug: 'ts-2',
    category: 'ts',
    title: 'TypeScript Deep Dive: Conditional Types',
    subtitle: '타입 세계의 삼항 연산자, 그리고 타입 추출의 핵심 infer',
    content: `
<p>지난 시간에는 제네릭을 배웠습니다. 이번에는 제네릭에 <strong>'조건'</strong>을 달아봅시다. 입력받은 타입이 무엇이냐에 따라 다른 타입을 뱉어내게 만드는 것, 이것이 타입스크립트 중급 이상의 문턱인 <strong>조건부 타입(Conditional Types)</strong>입니다.</p>

<h2>1. 타입 조건문: T extends U ? X : Y</h2>
<p>조건부 타입은 우리가 흔히 쓰는 삼항 연산자와 똑같이 생겼습니다. <code>T</code>가 <code>U</code>의 하위 타입이면 <code>X</code>가 되고, 아니면 <code>Y</code>가 됩니다.</p>

<div class="example-box">
  <strong>💻 실무 예제: 타입 필터링</strong>
  <pre><code>type IsString&lt;T&gt; = T extends string ? "yes" : "no";

type T1 = IsString&lt;string&gt;; // "yes"
type T2 = IsString&lt;number&gt;; // "no"

// 조금 더 실용적인 예제: null/undefined 제거하기
type NonNullable&lt;T&gt; = T extends null | undefined ? never : T;

type Data = string | null;
type SafeData = NonNullable&lt;Data&gt;; // string</code></pre>
</div>

<h2>2. infer: 타입의 정체를 밝히는 수사관</h2>
<p>조건부 타입 안에서만 쓸 수 있는 마법 같은 키워드가 바로 <code>infer</code>입니다. "이 자리에 어떤 타입이 들어올지 모르겠는데, 들어오는 놈을 일단 <strong>R</strong>이라는 변수에 담아줘!"라고 요청하는 것과 같습니다.</p>

<h3>배열에서 요소 타입 추출하기</h3>
<pre><code>type UnpackArray&lt;T&gt; = T extends (infer R)[] ? R : T;

type Strings = string[];
type OneString = UnpackArray&lt;Strings&gt;; // string
type JustNumber = UnpackArray&lt;number&gt;; // number</code></pre>

<h2>3. 실무의 꽃: ReturnType 직접 구현하기</h2>
<p>우리가 자주 쓰는 유틸리티 타입 <code>ReturnType</code>은 내부적으로 이렇게 생겼습니다. 함수의 반환 타입을 런타임이 아닌 컴파일 타임에 완벽하게 추론해냅니다.</p>

<div class="example-box">
  <pre><code>type MyReturnType&lt;T&gt; = T extends (...args: any[]) => infer R ? R : any;

function getUser() {
  return { id: 1, name: "Jung", role: "admin" as const };
}

// 함수의 실행 결과인 객체 타입을 그대로 추출해냄
type UserResult = MyReturnType&lt;typeof getUser&gt;;
/*
{
  id: number;
  name: string;
  role: "admin";
}
*/</code></pre>
</div>

<h2>4. Agentic Coding 관점에서의 환기</h2>
<div class="example-box" style="border-left-color: #ef4444; background-color: #fff1f2;">
  <strong>🤖 Agentic Coding 관점에서의 환기</strong><br/>
  AI 에이전트와 협업할 때, 우리가 명시한 <code>infer</code> 로직은 에이전트에게 <strong>'역추론의 가이드'</strong>가 됩니다.
  단순히 타입을 선언하는 것을 넘어 "이 함수가 리턴하는 타입에 맞춰서 다음 로직을 짜줘"라고 명령할 때, 조건부 타입이 선언되어 있다면 에이전트는 별도의 설명 없이도 반환값의 구조를 이해하고 버그 없는 코드를 작성합니다. 즉, 타입은 인간과 AI 간의 가장 명확한 <strong>프로토콜</strong>입니다.
</div>

<h2>5. 정리하며</h2>
<ol>
  <li><strong>조건부 타입:</strong> <code>T extends U ? X : Y</code>로 유연한 타입 시스템을 구축합니다.</li>
  <li><strong>infer 키워드:</strong> 복잡한 구조(배열, 함수, 프로미스 등) 내부에서 원하는 타입을 변수처럼 추출합니다.</li>
  <li><strong>결합의 힘:</strong> 제네릭과 결합하면 어떤 라이브러리 환경에서도 대응 가능한 무적의 타입을 설계할 수 있습니다.</li>
</ol>

<div class="reference-section">
  <h2>📚 참고 자료</h2>
  <ul class="reference-list">
    <li><a href="https://www.typescriptlang.org/docs/handbook/2/conditional-types.html" target="_blank">🔗 TS Official Docs: Conditional Types</a></li>
    <li><a href="https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types" target="_blank">🔗 Inferring within Conditional Types</a></li>
  </ul>
</div>
    `,
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
