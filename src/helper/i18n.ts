/** @format */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ja from "locales/ja.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: "ja",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ja: { translation: ja },
    },
  });
