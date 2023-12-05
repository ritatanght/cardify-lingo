/* language id
1('Spanish'),
2('French'),
3('Mandarin'),
4('Italian'),
5('Portuguese'),
6('Japanese'),
7('Korean'),
8('Cantonese');
*/

export const language_voice_lang: { [key: string]: string} = {
  Spanish: "es-ES",
  French: "fr-FR",
  Italian: "it-IT",
  Portuguese: "pt-BR",
  Mandarin: "zh-CN",
  Japanese: "ja-JP",
  Korean: "ko-KR",
  Cantonese: "zh-HK",
};

export const waitForVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voicesChanged = () => {
      window.speechSynthesis.onvoiceschanged = null; // Remove the listener after it fires
      resolve(window.speechSynthesis.getVoices());
    };

    // Check if voices are already available
    if (window.speechSynthesis.getVoices().length > 0) {
      resolve(window.speechSynthesis.getVoices());
    } else {
      window.speechSynthesis.onvoiceschanged = voicesChanged;
    }
  });
};

/*
0Microsoft David - English (United States)
1Microsoft Mark - English (United States)
2Microsoft Zira - English (United States)
3Microsoft Hanhan - Chinese (Traditional, Taiwan)
4Microsoft Yating - Chinese (Traditional, Taiwan)
5Microsoft Zhiwei - Chinese (Traditional, Taiwan)
6Google Deutsch
7Google US English
8Google UK English Female
9Google UK English Male
10Google español
11Google español de Estados Unidos
12Google français
13Google हिन्दी
14Google Bahasa Indonesia
15Google italiano
16Google 日本語
17Google 한국의
18Google Nederlands
19Google polski
20Google português do Brasil
21Google русский
22Google 普通话（中国大陆）
23Google 粤語（香港）
24Google 國語（臺灣）
*/
