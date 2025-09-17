import { useMutation } from "@tanstack/react-query";
import { LoaderIcon, X } from "lucide-react";
import { useRef } from "react";
import { deleteFriendAPI } from "../../lib/api.js";
import { idToLocale } from "../../lib/utils.js";
import CommonRoundedButton from "../buttons/CommonRoundedButton.jsx";
import CountAndMessageBadge from "../buttons/CountAndMessageBadge.jsx";
import CostumedModal from "../costumed/CostumedModal.jsx";
import { showToast } from "../costumed/CostumedToast.jsx";
import { getFlagLanguage, getLanguageFlag } from "./FriendCard_Func.jsx";

const FriendCard_v2_FriendsPage = ({ data, onSuccess, onError = () => {} }) => {
  const friend = data.user;
  const friendshipId = data.id;
  const closeRef = useRef(null);
  const { mutate: deleteFriendMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteFriendAPI,
    onSuccess: (data) => {
      onSuccess();
      if (closeRef.current) closeRef.current();
      showToast({
        message: data?.message || "Friend deleted successfully!",
        type: "success",
      });
    },
    onError: (error) => {
      onError();
      showToast({
        message: error?.response?.data?.message || "Failed to delete friend",
        type: "error",
      });
    },
  });
  return (
    <div
      key={friend.id}
      className="card bg-base-200 hover:shadow-lg transition-all duration-300 relative h-full"
    >
      <div className="card-body p-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm">{friend.fullName}</h3>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>

        {friend.bio && <p className="text-sm line-clamp-2">{friend.bio}</p>}

        {/* Languages with flags */}

        <div className="flex flex-wrap gap-2">
          <span className="badge badge-secondary h-8 px-4 flex items-center gap-1 relative -top-[1px]">
            {getLanguageFlag(idToLocale(friend.nativeLanguage.id))}
            Native: {getFlagLanguage(idToLocale(friend.nativeLanguage.id))}
          </span>
          <span className="badge badge-outline h-8 px-4 flex items-center gap-1 relative -top-[1px]">
            {getLanguageFlag(idToLocale(friend.learningLanguage.id))}
            Learning: {getFlagLanguage(idToLocale(friend.learningLanguage.id))}
          </span>
        </div>

        <CountAndMessageBadge
          count={friend.unReadMessages || 0}
          className={"absolute top-2 right-14"}
        ></CountAndMessageBadge>

        <CostumedModal
          trigger={
            <CommonRoundedButton
              className={`absolute top-2 right-4 ${
                isDeleting ? "pointer-events-none opacity-70" : ""
              }`}
            >
              <X className="size-4" />
            </CommonRoundedButton>
          }
          title="Thông báo"
        >
          {({ close }) => {
            closeRef.current = close;

            return (
              <div>
                <div
                  className={`pb-6 text-sm ${
                    isDeleting ? "pointer-events-none" : ""
                  }`}
                >
                  Bạn có chắc muốn hủy kết bạn với{" "}
                  <span className="font-semibold">{friend.fullName}</span>{" "}
                  không?
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="btn btn-outlined w-full"
                    onClick={() => {
                      close();
                    }}
                  >
                    Để sau
                  </button>
                  <button
                    className="btn btn-primary w-full hover:btn-primary"
                    onClick={() => {
                      deleteFriendMutation(friendshipId);
                    }}
                  >
                    {isDeleting ? (
                      <LoaderIcon className="size-4 animate-spin" />
                    ) : null}
                    Hủy kết bạn
                  </button>
                </div>
              </div>
            );
          }}
        </CostumedModal>
      </div>
    </div>
  );
};

export default FriendCard_v2_FriendsPage;
