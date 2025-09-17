import { FLAG_TO_LANGUAGE, LANGUAGE_TO_FLAG } from "../../constants";

const FriendCard_Func = () => {
  return <div>FriendCard_Func</div>;
};

export function getLanguageFlag(locale) {
  if (!locale) return null;

  if (locale) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${locale}.png`}
        alt={`${locale} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}

export function getFlagLanguage(locale) {
  if (!locale) return null;

  const lang = FLAG_TO_LANGUAGE[locale];

  return lang;
}

export default FriendCard_Func;
