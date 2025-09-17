import { idToLocale } from "../../lib/utils";

import { useMutation } from "@tanstack/react-query";
import { LoaderIcon, MapPinIcon, UserRoundPlus } from "lucide-react";
import { sendFriendRequestAPI } from "../../lib/api";
import CommonRoundedButton from "../buttons/CommonRoundedButton";
import { showToast } from "../costumed/CostumedToast";
import { getFlagLanguage, getLanguageFlag } from "./FriendCard_Func";

const RecommendedUserCard_HomePage = ({ user, onSuccess, onError }) => {
  const {
    mutate: sendFriendRequestMutation,
    isPending: isSendingFriendRequest,
  } = useMutation({
    mutationFn: sendFriendRequestAPI,
    onSuccess: (data) => {
      onSuccess();
      showToast({
        message: data?.message || "Friend request sent successfully!",
        type: "success",
      });
    },
    onError: (error) => {
      onError();
      showToast({
        message:
          error?.response?.data?.message || "Failed to send friend request",
        type: "error",
      });
    },
  });
  return (
    <div
      key={user.id}
      className="card bg-base-200 hover:shadow-lg transition-all duration-300 relative h-full"
    >
      <div className="card-body p-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={user.profilePic} alt={user.fullName} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm">{user.fullName}</h3>
            {user.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {user.location}
              </div>
            )}
          </div>
        </div>

        {user.bio && <p className="text-sm line-clamp-2">{user.bio}</p>}

        {/* Languages with flags */}
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-secondary h-8 px-4 flex items-center gap-1 relative -top-[1px]">
            {getLanguageFlag(idToLocale(user.nativeLanguage.id))}
            Native: {getFlagLanguage(idToLocale(user.nativeLanguage.id))}
          </span>
          <span className="badge badge-outline h-8 px-4 flex items-center gap-1 relative -top-[1px]">
            {getLanguageFlag(idToLocale(user.learningLanguage.id))}
            Learning: {getFlagLanguage(idToLocale(user.learningLanguage.id))}
          </span>
        </div>

        {/* Action button */}

        <CommonRoundedButton
          className={`absolute top-2 right-4 ${
            isSendingFriendRequest ? "pointer-events-none opacity-70" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();

            sendFriendRequestMutation(user.id);
          }}
        >
          {isSendingFriendRequest ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : (
            <UserRoundPlus className="size-4" />
          )}
        </CommonRoundedButton>
      </div>
    </div>
  );
};

export default RecommendedUserCard_HomePage;
