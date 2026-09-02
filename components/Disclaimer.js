export default function Disclaimer() {
  return `
    <div id="disclaimerModal"
      style="
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
      ">
      
      <div style="
        background: #fff;
        padding: 26px;
        border-radius: 16px;
        max-width: 420px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 50px rgba(0,0,0,0.25);
        animation: popup 0.3s ease;
      ">
        
        <div style="font-size:34px; margin-bottom:10px;">ℹ️</div>

        <h2 style="font-size:20px; font-weight:600; margin-bottom:12px;">
          Important Notice / महत्वपूर्ण सूचना
        </h2>

        <!-- English -->
        <p style="color:#444; font-size:14px; line-height:1.6; margin-bottom:12px;">
          Due to the ongoing war, raw material costs have increased, leading to a rise in product prices.  
          However, we are still keeping our prices as affordable as possible.  
          Prices will be normalized once the situation improves.
        </p>

        <hr style="margin: 12px 0; border: none; border-top: 1px solid #eee;" />

        <!-- Hindi -->
        <p style="color:#444; font-size:14px; line-height:1.7; margin-bottom:18px;">
          वर्तमान युद्ध के कारण कच्चे माल के दाम बढ़ गए हैं, जिसके चलते उत्पादों के मूल्यों में वृद्धि हुई है।  
          फिर भी हम अपने दाम यथासंभव किफायती रखने का प्रयास कर रहे हैं।  
          स्थिति सामान्य होने पर मूल्यों को फिर से सामान्य कर दिया जाएगा।
        </p>

        <button id="acceptDisclaimer"
          style="
            background: #2563eb;
            color: white;
            padding: 10px 22px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          ">
          Continue / आगे बढ़ें
        </button>

      </div>
    </div>
  `;
}