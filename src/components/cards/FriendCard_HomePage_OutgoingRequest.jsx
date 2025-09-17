import { useMutation } from "@tanstack/react-query";
import { LoaderIcon, MapPinIcon, Undo2 } from "lucide-react";
import { useRef } from "react";
import { cancelFriendRequestAPI } from "../../lib/api";
import { idToLocale } from "../../lib/utils";
import CommonRoundedButton from "../buttons/CommonRoundedButton";
import CostumedModal from "../costumed/CostumedModal";
import { showToast } from "../costumed/CostumedToast";
import { getFlagLanguage, getLanguageFlag } from "./FriendCard_Func";

const FriendCard_HomePage_OutgoingRequest = ({
  friend,
  request,
  onSuccess,
  onError,
}) => {
  const closeRef = useRef(null);
  const {
    mutate: cancelFriendRequestMutation,
    isPending: isCancellingFriendRequest,
  } = useMutation({
    mutationFn: cancelFriendRequestAPI,
    onSuccess: (data) => {
      onSuccess();
      if (closeRef.current) closeRef.current();
      showToast({
        message: data?.message || "Friend request cancelled successfully!",
        type: "success",
      });
    },
    onError: (error) => {
      onError();
      showToast({
        message:
          error?.response?.data?.message || "Failed to cancel friend request",
        type: "error",
      });
    },
  });
  return (
    <div
      key={friend.id}
      className="card bg-base-200 hover:shadow-lg transition-all duration-300 relative"
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
            {friend.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {friend.location}
              </div>
            )}
          </div>
        </div>

        {/* {friend.bio && <p className="text-sm line-clamp-2">{friend.bio}</p>} */}

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

        <CostumedModal
          trigger={
            <CommonRoundedButton
              className={`absolute top-2 right-4 ${
                isCancellingFriendRequest
                  ? "pointer-events-none opacity-70"
                  : ""
              }`}
            >
              <Undo2 className="size-4" />
            </CommonRoundedButton>
          }
          title="Thông báo"
        >
          {({ close }) => {
            closeRef.current = close;
            return (
              <div>
                <div className={`pb-6 text-sm `}>
                  Bạn có chắc muốn hủy lời mời kết bạn với{" "}
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
                      cancelFriendRequestMutation(request.id);
                      close();
                    }}
                  >
                    {isCancellingFriendRequest ? (
                      <LoaderIcon className="size-4 animate-spin" />
                    ) : null}
                    Hủy lời mời
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

export default FriendCard_HomePage_OutgoingRequest;
