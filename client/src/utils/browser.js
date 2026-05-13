export function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    /FBAN|FBAV|FB_IAB|MessengerForAndroid/i.test(ua) || // Facebook / Messenger
    /Instagram/i.test(ua) ||
    /Twitter/i.test(ua) ||
    /TikTok|musical_ly/i.test(ua) ||
    /MicroMessenger/i.test(ua) || // WeChat
    /WhatsApp/i.test(ua) ||
    /Snapchat/i.test(ua) ||
    /LinkedInApp/i.test(ua) ||
    /Line\//i.test(ua) ||
    // Android WebView: Chrome UA contains "wv" flag
    /\bwv\b/.test(ua)
  );
}
