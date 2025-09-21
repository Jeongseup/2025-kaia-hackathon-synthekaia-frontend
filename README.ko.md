# SyntheKaia 프론트엔드: LINE 미니 앱

이 저장소는 SyntheKaia 프론트엔드의 소스 코드를 포함하고 있으며, LINE 미니 앱으로 실행되도록 설계된 Next.js 애플리케이션입니다. Kaia 네트워크의 SyntheKaia 델타-중립 볼트와 상호 작용할 수 있는 사용자 친화적인 인터페이스를 제공합니다.

## SyntheKaia 정보

SyntheKaia는 Kaia 네트워크의 탈중앙화 금융(DeFi) 볼트로, 델타-중립 투자 전략을 구현합니다. USDT 예금을 받아 전략적 헤징을 통해 시장 중립성을 유지하면서 안정적인 수익을 창출하기 위해 이중 전략 접근 방식을 자동으로 실행합니다.

### 핵심 전략
- **유동성 스테이킹 (50%)**: 예치된 USDT의 절반은 스테이킹 보상을 생성하기 위해 **stKAIA**로 스왑됩니다.
- **영구 숏 포지션 (50%)**: 나머지 절반은 **KAIA**에 대한 2배 레버리지 숏 포지션의 증거금으로 사용되어 가격 변동성에 대한 헤징을 합니다.

이를 통해 사용자, 특히 LINE 앱을 통한 일반 사용자는 간단한 예금 계좌를 사용하는 것처럼 안정적인 DeFi 수익에 접근할 수 있습니다.

## 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/)
- **언어**: [TypeScript](https://www.typescriptlang.org/)
- **LINE 통합**: [LIFF (LINE Front-end Framework)](https://developers.line.biz/en/docs/liff/)
- **스타일링**: [CSS Modules](https://github.com/css-modules/css-modules)
- **상태 관리**: [React Query](https://tanstack.com/query/latest)
- **배포**: [Vercel](https://vercel.com/)

## 기능

- **원활한 LINE 통합**: LINE 앱 내에서 직접 서비스를 인증하고 상호 작용합니다.
- **지갑 연결**: Kaia 생태계 지갑에 연결합니다.
- **USDT 예치**: SyntheKaia 볼트에 USDT를 쉽게 예치합니다.
- **포트폴리오 관리**: 볼트 잔액, 공유 토큰 및 성과 지표를 봅니다.
- **파우셋**: 테스트 목적으로 테스트넷 USDT를 얻을 수 있는 개발자 중심의 파우셋입니다.

## 데모 컨트랙트 주소

빠른 테스트를 위해 Baobab 테스트넷에 배포된 다음 컨트랙트 주소를 사용할 수 있습니다.

| 이름                                              | 주소                                       |
| ------------------------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_MOCK_USDT_ADDRESS`                   | `0xeEB3432dc5bB3b6a774b97a125A498Cb528A640b` |
| `NEXT_PUBLIC_MOCK_STAKED_KAIA_ADDRESS`            | `0xcEB9f9Be9ceE2704b4999fA512031125bC15F7ff` |
| `NEXT_PUBLIC_STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS`  | `0x1A2e956C4E342708688b878f07b469680487a3Ba` |

## 시작하기

프로젝트를 로컬에서 설정하고 실행하려면 다음 지침을 따르십시오.

### 전제 조건

- [Node.js](https://nodejs.org/en) (`.nvmrc`에 명시된 버전)
- [pnpm](https://pnpm.io/installation)

### 설치

1.  저장소를 클론합니다:
    ```bash
    git clone https://github.com/Jeongseup/2025-kaia-hackathon-synthekaia-frontend.git
    cd 2025-kaia-hackathon-synthekaia-frontend
    ```

2.  의존성을 설치합니다:
    ```bash
    pnpm install
    ```

### 설정

`.env.sample` 파일을 복사하여 `.env.local` 파일을 생성합니다. 이 파일은 애플리케이션 실행에 필요한 환경 변수를 포함합니다.

```bash
cp .env.sample .env.local
```

각 변수에 대한 설명은 다음과 같습니다:

- `NODE_ENV`: 애플리케이션 환경 (예: `local`, `development`, `production`).
- `BASE_API_URL`: 백엔드 API의 기본 URL. 로컬 개발의 경우 `https://localhost:3000`입니다.
- `FAUCETER_PRIVATE_KEY`: 파우셋에서 테스트넷 USDT를 배포하는 데 사용되는 계정의 비공개 키입니다. **이 변수는 로컬 또는 테스트 환경에서만 사용해야 합니다.**
- `NEXT_PUBLIC_CLIENT_ID`: Kaia DApp Portal SDK의 클라이언트 ID입니다.
- `NEXT_PUBLIC_CHAIN_ID`: Kaia 네트워크의 체인 ID (예: Baobab 테스트넷의 경우 `1001`).
- `NEXT_PUBLIC_LIFF_ID`: LINE 미니 앱의 LIFF ID입니다.
- `NEXT_PUBLIC_MOCK_USDT_ADDRESS`: 모의 USDT 토큰의 컨트랙트 주소입니다.
- `NEXT_PUBLIC_MOCK_STAKED_KAIA_ADDRESS`: 모의 stKAIA 토큰의 컨트랙트 주소입니다.
- `NEXT_PUBLIC_STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS`: 메인 볼트 컨트랙트의 주소입니다.

#### 테스트 컨트랙트 배포

로컬 개발 및 테스트를 위해 SyntheKaia 스마트 컨트랙트를 배포해야 합니다. 배포된 컨트랙트 주소는 `.env.local` 파일에 추가해야 합니다.

1.  **컨트랙트 저장소 클론**:
    ```bash
    git clone https://github.com/Jeongseup/2025-kaia-hackathon-synthekaia-contract.git
    cd 2025-kaia-hackathon-synthekaia-contract
    ```

2.  **설정 및 배포**:
    해당 저장소의 `README.md` 파일에 있는 지침에 따라 Foundry를 설치하고, 환경을 구성한 후 `make deploy` 명령어를 사용하여 컨트랙트를 배포합니다.

3.  **환경 변수 업데이트**:
    배포 후, 컨트랙트 프로젝트의 터미널 출력에서 결과로 나온 컨트랙트 주소들(`USDT_ADDRESS`, `ST_KAIA_ADDRESS`, `STKAIA_DELTA_NEUTRAL_VAULT_ADDRESS`)을 이 프론트엔드 프로젝트의 `.env.local` 파일에 있는 해당 변수들에 복사하여 붙여넣습니다.

자세한 지침은 [컨트랙트 저장소](https://github.com/Jeongseup/2025-kaia-hackathon-synthekaia-contract)를 참조하세요.

### 개발 서버 실행

의존성이 설치되고 설정이 완료되면 개발 서버를 실행할 수 있습니다:

```bash
pnpm dev
```

애플리케이션은 `http://localhost:3000`에서 사용할 수 있습니다. 전체 LIFF 통합을 테스트하려면 LINE 앱 내에서 실행하거나 LIFF 브라우저 시뮬레이터를 사용해야 합니다.

## 배포

이 프로젝트는 [Vercel](https://vercel.com/)에 쉽게 배포할 수 있도록 구성되어 있습니다. Vercel 계정을 Git 저장소에 연결하기만 하면 Vercel이 자동으로 애플리케이션을 빌드하고 배포합니다.

`vercel.json` 파일에는 서버리스 함수 및 라우팅에 필요한 구성이 포함되어 있습니다.

## 프로젝트 구조

```
.
├── src/
│   ├── app/                # Next.js 앱 라우터 페이지 및 API 라우트
│   │   ├── api/            # 파우셋, 결제 등을 위한 백엔드 API 라우트
│   │   └── page.tsx        # 메인 애플리케이션 진입점
│   ├── components/         # 재사용 가능한 React 컴포넌트
│   │   ├── MainApp/        # 핵심 애플리케이션 UI (탭, 헤더)
│   │   ├── SignIn/         # 로그인 페이지 컴포넌트
│   │   └── Wallet/         # 지갑 연결 및 관리 컴포넌트
│   ├── constants/          # 스마트 컨트랙트를 위한 ABI 정의
│   └── utils/              # 유틸리티 함수 (LIFF SDK, 포맷팅)
├── public/                 # 정적 자산 (이미지, 로고)
├── next.config.ts          # Next.js 설정
├── vercel.json             # Vercel 배포 설정
└── package.json            # 프로젝트 의존성 및 스크립트
```
