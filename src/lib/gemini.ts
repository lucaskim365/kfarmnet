import { Message } from "../types";

export async function chatWithGemini(messages: Message[]): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "응답이 없습니다.";
  } catch (error: any) {
    console.error("Gemini API Client Error:", error);
    
    const errorMsg = error.message || "";
    if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("spending cap")) {
      return "현재 프로젝트의 지출 한도(Spending Cap)를 초과하여 서비스를 이용할 수 없습니다. AI Studio(https://aistudio.google.com/app/settings/billing)에서 한도 설정을 확인해 주세요.";
    }
    
    return `API 호출 실패: ${errorMsg || "알 수 없는 오류"}`;
  }
}

