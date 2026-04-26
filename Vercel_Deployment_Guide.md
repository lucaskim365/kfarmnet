# Vercel Deployment Guide for kfarmnet

이 앱은 Vercel에 배포하기 위해 최적화되었습니다. 아래 단계를 따라 배포해 주세요.

## 1. 사전 준비
1. **GitHub 계정**: 코드를 업로드할 GitHub 저장소가 필요합니다.
2. **Vercel 계정**: [vercel.com](https://vercel.com)에서 계정을 생성하세요.

## 2. 배포 단계
1. **코드 다운로드**: AI Studio 설정 메뉴에서 프로젝트를 ZIP 파일로 다운로드합니다.
2. **GitHub 업로드**: ZIP 파일의 압축을 풀고 GitHub 저장소에 코드를 Push합니다.
3. **Vercel 프로젝트 생성**:
   - Vercel 대시보드에서 **Add New > Project**를 선택합니다.
   - GitHub 저장소를 연결합니다.
4. **환경 변수 설정**: **Environment Variables** 섹션에 다음을 추가합니다:
   - `GEMINI_API_KEY`: Google AI Studio에서 발급받은 API 키
5. **배포 실행**: **Deploy** 버튼을 클릭합니다.

## 3. 주요 구성 파일
- `vercel.json`: Vercel 배포를 위한 라우팅 및 빌드 설정입니다.
- `api/index.ts`: Vercel Serverless Function을 위한 서버 로직입니다.
- `src/lib/gemini.ts`: 보안을 위해 API 호출을 서버 사이드로 우회하도록 수정되었습니다.

## 4. 참고 사항
- Firebase 설정 (`firebase-applet-config.json`)은 자동으로 포함되어 클라이언트 사이드에서 작동합니다.
- Gemini API는 서버 사이드 API(`/api/chat`)를 통해 호출되므로 브라우저에 API 키가 노출되지 않습니다.
