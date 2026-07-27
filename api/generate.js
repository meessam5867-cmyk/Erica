import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ error: '장소를 입력해주세요.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      사용자가 여름 휴가지 또는 관심 있는 장소로 "${location}"을(를) 입력했습니다.
      이 장소에 어울리는 매력적인 여름 휴가 추천 코스와 상세 여행 일정을 만들어주세요.
      
      응답은 반드시 아래 두 가지 영역으로 나누어 이해하기 쉽게 작성해주세요.
      1. [타임테이블]: 시간대별(예: 09:00, 11:30, 14:00 등) 일정과 간단한 활동명
      2. [텍스트 설명]: 해당 장소의 매력, 추천 이유, 상세 설명 및 팁
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
    });

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'AI 응답을 생성하는 중 오류가 발생했습니다.' });
  }
}
