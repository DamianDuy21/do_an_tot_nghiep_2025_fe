import { LANGUAGE_TO_FLAG } from "../../constants";

const FriendCard_Func = () => {
  return <div>FriendCard_Func</div>;
};

export function getLanguageFlag(language) {
  if (!language) return null;

  let langLower = language.toLowerCase();
  if (language == "Vietnamese") langLower = "vietnamese";
  else langLower = "english";

  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}

export default FriendCard_Func;
