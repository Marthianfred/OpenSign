import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector) // Use LanguageDetector directly without creating an instance
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json"
    },
    fallbackLng: "es", // Fallback to Spanish if no other language is detected
    lng: "es", // Force Spanish by default, overridden once the user picks a language (persisted below)
    detection: {
      // Only respect a language the user explicitly chose and had persisted; ignore browser locale.
      order: ["localStorage"],
      // Defines where the detected language should be cached.
      caches: ["localStorage"]
    },
    ns: ["translation"], // default namespace
    defaultNS: "translation", // default namespace
    //Enables debug mode, which outputs detailed logs to the console about the translation process.
    debug: false,
    interpolation: {
      escapeValue: false // Not needed for react as it escapes by default
    },
    whitelist: ["en", "es", "fr", "it", "de", "hi", "kr"] // List of allowed languages
  });

export default i18n;
