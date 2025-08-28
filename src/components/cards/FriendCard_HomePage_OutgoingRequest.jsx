import { LoaderIcon, MapPinIcon, Undo2 } from "lucide-react";
import { capitalize } from "../../lib/utils";
import CommonRoundedButton from "../buttons/CommonRoundedButton";
import CostumedModal from "../costumed/CostumedModal";
import { getLanguageFlag } from "./FriendCard_Func";
import { useRef } from "react";
import { cancelFriendRequestAPI } from "../../lib/api";
import { showToast } from "../costumed/CostumedToast";
import { useMutation } from "@tanstack/react-query";

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
          <div className="avatar size-10 rounded-full">
            <img src={friend.profilePic} alt={friend.fullName} />
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
            {getLanguageFlag(friend.nativeLanguage.name)}
            Native: {capitalize(friend.nativeLanguage.name)}
          </span>
          <span className="badge badge-outline h-8 px-4 flex items-center gap-1 relative -top-[1px]">
            {getLanguageFlag(friend.learningLanguage.name)}
            Learning: {capitalize(friend.learningLanguage.name)}
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
