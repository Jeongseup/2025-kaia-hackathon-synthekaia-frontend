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

프로젝트 루트에 `.env.local` 파일을 생성하고 필요한 환경 변수를 추가합니다. 아래 예제를 복사할 수 있습니다.

```dotenv
# .env.local

# LINE 미니 앱의 LIFF ID
NEXT_PUBLIC_LIFF_ID="YOUR_LIFF_ID"

# Kaia 네트워크 설정
NEXT_PUBLIC_KAIYA_RPC_URL="https://your-kaia-rpc-provider.com"
NEXT_PUBLIC_MOCK_USDT_CONTRACT_ADDRESS="0x..."
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS="0x..."

```

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
