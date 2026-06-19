export const DISPLAY_ID_CARD_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .display-id-card {
    width: 800px;
    height: 400px;
    background: #fcfcfa;
    border: 1px solid #111111;
    border-radius: 4px;
    display: flex;
    overflow: hidden;
  }
  .display-id-card__brand {
    width: 250px;
    flex: none;
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 22px;
  }
  .display-id-card__brand img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .display-id-card__message {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 30px 28px;
    gap: 14px;
  }
  .display-id-card__title {
    font-size: 27px;
    font-weight: 700;
    line-height: 1.12;
    color: #111111;
    letter-spacing: -0.01em;
  }
  .display-id-card__subtitle {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.45;
    color: #4a4a4a;
    max-width: 320px;
  }
  .display-id-card__qr {
    width: 268px;
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 24px 28px 24px 0;
  }
  .display-id-card__qr-box {
    width: 200px;
    height: 200px;
    background: #fafafa;
    border: 1px solid #d4d4cf;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }
  .display-id-card__qr-box svg {
    width: 100% !important;
    height: 100% !important;
  }
  .display-id-card__scan {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #111111;
  }
  .display-id-card__scan span {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  @page {
    margin: 12mm;
  }
  @media print {
    body { padding: 0; }
  }
`;
