import { Check, ClockIcon, Forward, LoaderIcon, Undo2, X } from "lucide-react";
import { getIncomingFriendRequestsAPI } from "../lib/api.js";

import { useEffect, useState } from "react";
import CommonRoundedButton from "../components/buttons/CommonRoundedButton.jsx";
import CountBadge from "../components/buttons/CountBadge.jsx";
import FriendCard_NotificationsPage_IncomingRequest from "../components/cards/FriendCard_NotificationsPage_IncomingRequest.jsx";
import { showToast } from "../components/costumed/CostumedToast.jsx";
import NoDataCommon from "../components/noFounds/NoDataCommon.jsx";

const NotificationsPage = () => {
  const [isShowMoreFriendRequests, setIsShowMoreFriendRequests] =
    useState(false);
  const [isShowMoreNotifications, setIsShowMoreNotifications] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notificationsQuantity, setNotificationsQuantity] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const [incomingFriendRequests, setIncomingFriendRequests] = useState([]);
  const [incomingFriendRequestsQuantity, setIncomingFriendRequestsQuantity] =
    useState(0);
  const [isLoadingIncomingFriendRequests, setIsLoadingIncomingFriendRequests] =
    useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const handleOnSuccessFriendRequest = () => {
    if (
      incomingFriendRequestsQuantity == (currentPage - 1) * pageSize + 1 &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
      if (!isShowMoreFriendRequests) {
        fetchIncomingFriendRequests({ currentPage: currentPage - 2 });
      }
    } else {
      fetchIncomingFriendRequests({ currentPage: currentPage - 1 });
    }
  };

  const handleOnErrorFriendRequest = () => {
    if (
      incomingFriendRequestsQuantity == (currentPage - 1) * pageSize + 1 &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
      if (!isShowMoreFriendRequests) {
        fetchIncomingFriendRequests({ currentPage: currentPage - 2 });
      }
      fetchNotifications({ currentPage: 0 });
    } else {
      fetchIncomingFriendRequests({ currentPage: currentPage - 1 });
      fetchNotifications({ currentPage: 0 });
    }
  };

  const handleOnSuccessAcceptNotification = (notification) => {
    if (notificationsQuantity == (currentPage - 1) * pageSize + 1) {
      setCurrentPage(currentPage - 1);
      if (!isShowMoreNotifications) {
        fetchNotifications({ currentPage: currentPage - 2 });
      }
    } else {
      fetchNotifications({ currentPage: currentPage - 1 });
    }
    // setNotifications((prev) =>
    //   prev.map((n) => {
    //     if (n.notification._id === notification.notification._id) {
    //       return {
    //         ...n,
    //         notification: { ...n.notification, status: "accepted" },
    //       };
    //     }
    //     return n;
    //   })
    // );
  };

  const handleOnSuccessDeleteNotification = () => {
    if (notificationsQuantity == (currentPage - 1) * pageSize + 1) {
      setCurrentPage(currentPage - 1);
      if (!isShowMoreNotifications) {
        fetchNotifications({ currentPage: currentPage - 2 });
      }
    } else {
      fetchNotifications({ currentPage: currentPage - 1 });
    }
  };

  const handleOnErrorNotification = () => {
    if (
      notificationsQuantity == (currentPage - 1) * pageSize + 1 &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
      if (!isShowMoreNotifications) {
        fetchNotifications({ currentPage: currentPage - 2 });
      }
    } else {
      fetchNotifications({ currentPage: currentPage - 1 });
    }
  };

  const handleClickShowMoreIncomingFriendRequests = () => {
    setIsShowMoreFriendRequests(true);
    setCurrentPage(1);
    setTotalPages(Math.ceil(incomingFriendRequestsQuantity / pageSize));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickShowLessIncomingFriendRequests = () => {
    setIsShowMoreFriendRequests(false);
    setCurrentPage(1);
    if (currentPage !== 1) {
      fetchIncomingFriendRequests({
        currentPage: 0,
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickShowMoreNotifications = () => {
    setIsShowMoreNotifications(true);
    setCurrentPage(1);
    setTotalPages(Math.ceil(notificationsQuantity / pageSize));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickShowLessNotifications = () => {
    setIsShowMoreNotifications(false);
    setCurrentPage(1);
    if (currentPage !== 1) {
      fetchNotifications({
        currentPage: 0,
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchIncomingFriendRequests = async (args = {}) => {
    setIsLoadingIncomingFriendRequests(true);
    try {
      const { data } = await getIncomingFriendRequestsAPI(args);
      console.log("Incoming friend requests data:", data);
      setIncomingFriendRequests(data.records || []);
      setIncomingFriendRequestsQuantity(data.pagination.totalItems || 0);
    } catch (error) {
      showToast({
        message: error?.message,
        type: "error",
      });
    } finally {
      setIsLoadingIncomingFriendRequests(false);
    }
  };

  const fetchNotifications = async (args = {}) => {
    setIsLoadingNotifications(true);
    try {
      const data = { records: [], pagination: { totalItems: 0 } };
      // const { data } = await getNotificationsAPI(args);
      setNotifications(data.records || []);
      setNotificationsQuantity(data.pagination.totalItems || 0);
    } catch (error) {
      showToast({
        message: error?.message,
        type: "error",
      });
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchIncomingFriendRequests();
  }, []);

  useEffect(() => {
    if (isShowMoreFriendRequests) {
      fetchIncomingFriendRequests({
        currentPage: currentPage - 1,
      });
    }
  }, [currentPage]);

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-6 min-h-[calc(100vh - 64px)] ">
        <div className="w-full space-y-4 sm:space-y-4">
          {/* FRIEND REQUESTS NOTIFICATIONS */}
          {!isShowMoreNotifications && (
            <>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4 sm:mb-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl sm:text-2xl font-bold">
                    Lời mời kết bạn
                  </h1>

                  <CountBadge
                    count={incomingFriendRequestsQuantity}
                  ></CountBadge>
                </div>

                <>
                  {!isShowMoreFriendRequests ? (
                    <div
                      className="btn btn-outline btn-sm"
                      onClick={handleClickShowMoreIncomingFriendRequests}
                    >
                      <Forward className="size-4" />
                      <span className="">Xem thêm</span>
                    </div>
                  ) : (
                    <div
                      className="btn btn-outline btn-sm"
                      onClick={handleClickShowLessIncomingFriendRequests}
                    >
                      <Undo2 className="size-4" />
                      <span className="">Thu gọn</span>
                    </div>
                  )}
                </>
              </div>
              {isLoadingIncomingFriendRequests ? (
                <div className="flex justify-center h-[100px] items-center">
                  <LoaderIcon className="animate-spin size-8" />
                </div>
              ) : (
                <>
                  {incomingFriendRequestsQuantity > 0 ? (
                    <section className="space-y-4">
                      <div className="space-y-3">
                        {incomingFriendRequests.map((request, idx) => {
                          if (idx >= 6 && !isShowMoreFriendRequests) {
                            return null;
                          }
                          return (
                            <div key={request.id}>
                              <FriendCard_NotificationsPage_IncomingRequest
                                friend={request.sender}
                                request={request}
                                onSuccess={handleOnSuccessFriendRequest}
                                onError={handleOnErrorFriendRequest}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ) : (
                    <NoDataCommon
                      title={"Không có lời mời kết bạn"}
                      content={
                        "Bạn sẽ nhận được thông báo khi có lời mời kết bạn mới."
                      }
                    />
                  )}
                </>
              )}
            </>
          )}
          {/* NOTIFICATIONS */}
          {/* {!isShowMoreFriendRequests ? (
            <section
              className={`space-y-4 ${!isShowMoreNotifications ? "!mt-6" : ""}`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4 sm:mb-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl sm:text-2xl font-bold">Thông báo</h1>

                  <CountBadge
                    count={notifications.filter((item) => !item.isRead).length}
                  ></CountBadge>
                </div>

                {notifications.length > 3 && (
                  <>
                    {!isShowMoreNotifications ? (
                      <div
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setIsShowMoreNotifications(true);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Forward className="size-4 " />
                        <span className="">Xem thêm</span>
                      </div>
                    ) : (
                      <div
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setIsShowMoreNotifications(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Undo2 className="size-4 " />
                        <span className="">Thu gọn</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification, idx) => {
                    if (idx >= 3 && !isShowMoreNotifications) {
                      return null;
                    }
                    return (
                      <div
                        key={notification._id}
                        className="card bg-base-200 shadow-sm"
                      >
                        <div className={`card-body p-4 pr-[106px]`}>
                          <div className="flex items-start gap-3">
                            <div className="avatar mt-1 size-10 rounded-full">
                              <img
                                src={notification.recipient.profilePic}
                                alt={""}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">
                                {notification.recipient.fullName}
                              </h3>
                              <p className="text-sm mb-2">
                                {notification.recipient.fullName} accepted your
                                friend request
                              </p>
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                <span className="relative -top-[0.5px]">
                                  Recently
                                </span>
                              </p>
                            </div>

                            {!notification.isRead && (
                              <CommonRoundedButton
                                className="absolute top-4 right-14"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Check className="size-4" />
                              </CommonRoundedButton>
                            )}

                            <CommonRoundedButton
                              className="absolute top-4 right-4"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <X className="size-4" />
                            </CommonRoundedButton>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <NoDataCommon
                    title={"Không có thông báo"}
                    content={
                      "Kết bạn và trò chuyện với bạn bè để nhận thông báo mới."
                    }
                  />
                </>
              )}
            </section>
          ) : null} */}
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
