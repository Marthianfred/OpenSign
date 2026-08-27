import i18next from "i18next";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function SelectLanguage(props) {
  const { i18n } = useTranslation();
  const languages = [
    { value: "es", text: "Español" }, //spanish
    { value: "en", text: "English" }, //english
    { value: "fr", text: "Français" }, //french
    { value: "it", text: "Italiano" }, //italian
    { value: "de", text: "Deutsch" }, //german
    { value: "hi", text: "हिन्दी" }, //hindi
    { value: "kr", text: "한국어" } //korean
  ];
  const defaultLanguage = i18next.language || "es";
  const [lang, setLang] = useState(defaultLanguage);
  // This function put query that helps to change the language
  const handleChangeLang = (e) => {
    setLang(e.target.value);
    i18n.changeLanguage(e.target.value);
    props?.updateExtUser && props.updateExtUser({ language: e.target.value });
  };
  return (
    <div
      className={`${
        !props.isProfile && " mt-[9px] pb-2 md:pb-0 "
      } flex justify-center items-center text-base-content`}
    >
      <select
        value={lang}
        onChange={handleChangeLang}
        style={{ width: "180px" }}
        className={`op-select op-select-bordered op-select-sm`}
      >
        <option disabled>select</option>
        {languages.map((item) => {
          return (
            <option key={item.value} value={item.value}>
              {item.text}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default SelectLanguage;
