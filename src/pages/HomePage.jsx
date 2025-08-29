import {
  Forward,
  Funnel,
  LoaderIcon,
  ShuffleIcon,
  Undo2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonRoundedButton from "../components/buttons/CommonRoundedButton.jsx";
import CountBadge from "../components/buttons/CountBadge.jsx";
import FriendCard_HomePage_OutgoingRequest from "../components/cards/FriendCard_HomePage_OutgoingRequest.jsx";
import RecommendedUserCard_HomePage from "../components/cards/RecommendedUserCard_HomePage.jsx";
import CommonPagination from "../components/costumed/CostumedPagination.jsx";
import { showToast } from "../components/costumed/CostumedToast.jsx";
import NoDataCommon from "../components/noFounds/NoDataCommon.jsx";
import FriendFilterInput from "../components/others/FriendFilterInput.jsx";
import {
  getOutgoingFriendRequestsAPI,
  getRecommendedUsersAPI,
} from "../lib/api.js";

const HomePage = () => {
  const { t } = useTranslation("homePage");

  const [isShowMoreRecommendedUsers, setIsShowMoreRecommendedUsers] =
    useState(false);
  const [isShowMoreFriendRequests, setIsShowMoreFriendRequests] =
    useState(false);

  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [recommendedUserQuantity, setRecommendedUserQuantity] = useState(0);
  const [isLoadingGetRecommendedUsers, setIsLoadingGetRecommendedUsers] =
    useState(false);

  const [outgoingFriendRequests, setOutgoingFriendRequests] = useState([]);
  const [outgoingFriendRequestsQuantity, setOutgoingFriendRequestsQuantity] =
    useState(0);
  const [isLoadingOutgoingFriendRequests, setIsLoadingOutgoingFriendRequests] =
    useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [filterData, setFilterData] = useState({
    fullName: "",
    nativeLanguage: "",
    learningLanguage: "",
  });

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const { fullName, nativeLanguage, learningLanguage } = filterData;
    if (currentPage == 1) {
      fetchRecommendedUsers({
        fullName: fullName.trim() || null,
        nativeLanguageId: nativeLanguage?.id,
        learningLanguageId: learningLanguage?.id,
        currentPage: currentPage - 1,
      });
    } else {
      setCurrentPage(1);
    }
  };

  const handleOnSuccessSendFriendRequest = () => {
    const { fullName, nativeLanguage, learningLanguage } = filterData;
    if (
      recommendedUserQuantity == (currentPage - 1) * pageSize + 1 &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
      fetchOutgoingFriendRequests({ currentPage: 0 });
      if (!isShowMoreRecommendedUsers) {
        fetchRecommendedUsers({
          fullName,
          nativeLanguageId: nativeLanguage.id,
          learningLanguageId: learningLanguage.id,
          currentPage: currentPage - 2,
        });
      }
    } else {
      fetchRecommendedUsers({
        fullName,
        nativeLanguageId: nativeLanguage.id,
        learningLanguageId: learningLanguage.id,
        currentPage: currentPage - 1,
      });
      fetchOutgoingFriendRequests({ currentPage: 0 });
    }
  };

  const handleOnErrorSendFriendRequest = () => {
    const { fullName, nativeLanguage, learningLanguage } = filterData;
    if (
      recommendedUserQuantity == (currentPage - 1) * pageSize + 1 &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
      fetchOutgoingFriendRequests({ currentPage: 0 });
      if (!isShowMoreRecommendedUsers) {
        fetchRecommendedUsers({
          fullName,
          nativeLanguageId: nativeLanguage.id,
          learningLanguageId: learningLanguage.id,
          currentPage: currentPage - 2,
        });
      }
    } else {
      fetchRecommendedUsers({
        fullName,
        nativeLanguageId: nativeLanguage.id,
        learningLanguageId: learningLanguage.id,
        currentPage: currentPage - 1,
      });
      fetchOutgoingFriendRequests({ currentPage: 0 });
    }
  };

  const handleOnSuccessCancelFriendRequest = () => {
    const { fullName, nativeLanguage, learningLanguage } = filterData;
    if (
      outgoingFriendRequestsQuantity == (currentPage - 1) * pageSize + 1 &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
      if (!isShowMoreFriendRequests) {
        fetchOutgoingFriendRequests({ currentPage: currentPage - 2 });
      }

      fetchRecommendedUsers({
        fullName,
        nativeLanguageId: nativeLanguage.id,
        learningLanguageId: learningLanguage.id,
        currentPage: 0,
      });
    } else {
      fetchRecommendedUsers({
        fullName,
        nativeLanguageId: nativeLanguage.id,
        learningLanguageId: learningLanguage.id,
        currentPage: 0,
      });
      fetchOutgoingFriendRequests({ currentPage: currentPage - 1 });
    }
  };

  const handleOnErrorCancelFriendRequest = () => {
    const { fullName, nativeLanguage, learningLanguage } = filterData;
    if (
      outgoingFriendRequestsQuantity == (currentPage - 1) * pageSize + 1 &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
      if (!isShowMoreFriendRequests) {
        fetchOutgoingFriendRequests({ currentPage: currentPage - 2 });
      }

      fetchRecommendedUsers({
        fullName,
        nativeLanguageId: nativeLanguage.id,
        learningLanguageId: learningLanguage.id,
        currentPage: 0,
      });
    } else {
      fetchRecommendedUsers({
        fullName,
        nativeLanguageId: nativeLanguage.id,
        learningLanguageId: learningLanguage.id,
        currentPage: 0,
      });
      fetchOutgoingFriendRequests({ currentPage: currentPage - 1 });
    }
  };

  const fetchRecommendedUsers = async (args = {}) => {
    try {
      setIsLoadingGetRecommendedUsers(true);
      const { data } = await getRecommendedUsersAPI(args);
      setRecommendedUsers(data?.records || []);
      setRecommendedUserQuantity(data?.pagination?.totalItems || 0);
    } catch (error) {
      console.log("Error fetching recommended users:", error);
      showToast({
        message:
          error?.response?.data?.message || "Failed to fetch recommended users",
        type: "error",
      });
    } finally {
      setIsLoadingGetRecommendedUsers(false);
    }
  };

  const fetchOutgoingFriendRequests = async (args = {}) => {
    try {
      setIsLoadingOutgoingFriendRequests(true);
      const { data } = await getOutgoingFriendRequestsAPI(args);
      setOutgoingFriendRequests(data.records || []);
      setOutgoingFriendRequestsQuantity(data.pagination.totalItems || 0);
    } catch (error) {
      console.log("Error fetching outgoing friend requests:", error);
      showToast({
        message:
          error?.response?.data?.message ||
          "Failed to fetch outgoing friend requests",
        type: "error",
      });
    } finally {
      setIsLoadingOutgoingFriendRequests(false);
    }
  };

  const handleClickShuffleButton = () => {
    setFilterData({
      fullName: "",
      nativeLanguage: "",
      learningLanguage: "",
    });
    setIsOpenFilter(false);
    setCurrentPage(1);
    if (!isShowMoreRecommendedUsers) {
      fetchRecommendedUsers();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickFilterOnButton = () => {
    setFilterData({
      fullName: "",
      nativeLanguage: "",
      learningLanguage: "",
    });
    setIsOpenFilter(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickFilterOffButton = () => {
    if (
      !(
        filterData.fullName === "" &&
        filterData.nativeLanguage === "" &&
        filterData.learningLanguage === ""
      )
      // || currentPage == 1
    ) {
      setFilterData({
        fullName: "",
        nativeLanguage: "",
        learningLanguage: "",
      });
      setIsOpenFilter(false);
      fetchRecommendedUsers();
    } else {
      setFilterData({
        fullName: "",
        nativeLanguage: "",
        learningLanguage: "",
      });
      setIsOpenFilter(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickSeeMoreRecommendedUsersButton = () => {
    setIsShowMoreRecommendedUsers(true);
    setCurrentPage(1);
    setTotalPages(Math.ceil(recommendedUserQuantity / pageSize));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleClickSeeLessRecommendedUsersButton = () => {
    setIsShowMoreRecommendedUsers(false);
    setCurrentPage(1);
    const { fullName, nativeLanguage, learningLanguage } = filterData;
    if (currentPage !== 1) {
      fetchRecommendedUsers({
        fullName,
        nativeLanguageId: nativeLanguage.id,
        learningLanguageId: learningLanguage.id,
        currentPage: 0,
      });
    }
    fetchOutgoingFriendRequests();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleClickSeeMoreOutGoingFriendRequests = () => {
    setFilterData({
      fullName: "",
      nativeLanguage: "",
      learningLanguage: "",
    });
    setIsOpenFilter(false);
    setIsShowMoreFriendRequests(true);
    setCurrentPage(1);
    setTotalPages(Math.ceil(outgoingFriendRequestsQuantity / pageSize));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickSeeLessOutGoingFriendRequests = () => {
    setIsShowMoreFriendRequests(false);
    setCurrentPage(1);
    fetchRecommendedUsers();

    if (currentPage !== 1) {
      fetchOutgoingFriendRequests({
        currentPage: 0,
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchRecommendedUsers();
    fetchOutgoingFriendRequests();
  }, []);

  useEffect(() => {
    if (isShowMoreRecommendedUsers) {
      const { fullName, nativeLanguage, learningLanguage } = filterData;
      fetchRecommendedUsers({
        fullName,
        nativeLanguageId: nativeLanguage.id,
        learningLanguageId: learningLanguage.id,
        currentPage: currentPage - 1,
      });
    }
    if (isShowMoreFriendRequests) {
      fetchOutgoingFriendRequests({
        currentPage: currentPage - 1,
      });
    }
  }, [currentPage]);

  return (
    <>
      <div
        className={`p-4 sm:p-6 lg:p-6 !min-h-[calc(100vh - 64px)] ${
          isShowMoreRecommendedUsers || isShowMoreFriendRequests
            ? "h-full flex flex-col justify-between"
            : ""
        } `}
      >
        {/* MEET NEW LEARNERS */}
        {!isShowMoreFriendRequests && (
          <div>
            <section>
              <div className="mb-4 sm:mb-4">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl sm:text-2xl font-bold">
                      {t("recommendedUsers.title")}
                    </h2>
                    <CountBadge count={recommendedUserQuantity}></CountBadge>
                  </div>

                  <>
                    <div className="flex gap-2">
                      <CommonRoundedButton
                        onClick={handleClickShuffleButton}
                        type="primary"
                      >
                        <ShuffleIcon className="size-4" />
                      </CommonRoundedButton>

                      {!isOpenFilter ? (
                        <CommonRoundedButton
                          onClick={handleClickFilterOnButton}
                          type="primary"
                        >
                          <Funnel className="size-4" />
                        </CommonRoundedButton>
                      ) : (
                        <CommonRoundedButton
                          onClick={handleClickFilterOffButton}
                          type="primary"
                        >
                          <X className="size-4" />
                        </CommonRoundedButton>
                      )}

                      {!isShowMoreRecommendedUsers ? (
                        <div
                          className="btn btn-outline btn-sm ml-2"
                          onClick={handleClickSeeMoreRecommendedUsersButton}
                        >
                          <Forward className="size-4" />
                          <span className="">Xem thêm</span>
                        </div>
                      ) : (
                        <div
                          className="btn btn-outline btn-sm ml-2"
                          onClick={handleClickSeeLessRecommendedUsersButton}
                        >
                          <Undo2 className="size-4" />
                          <span className="">Thu gọn</span>
                        </div>
                      )}
                    </div>
                  </>
                </div>
              </div>

              {isOpenFilter && (
                <FriendFilterInput
                  data={filterData}
                  onChange={setFilterData}
                  onSubmit={(e) => handleFilterSubmit(e)}
                />
              )}

              {isLoadingGetRecommendedUsers ? (
                <div className="flex justify-center h-[100px] items-center">
                  <LoaderIcon className="animate-spin size-8" />
                </div>
              ) : recommendedUserQuantity === 0 ? (
                filterData.fullName === "" &&
                filterData.nativeLanguage === "" &&
                filterData.learningLanguage === "" ? (
                  <NoDataCommon
                    title={"Chưa có người học mới"}
                    content={"Hãy mời bạn bè tham gia hoặc thử lại sau."}
                  />
                ) : (
                  <NoDataCommon
                    title={"Không có người dùng nào phù hợp"}
                    content={"Hãy thử điều chỉnh bộ lọc và thử lại."}
                  />
                )
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {recommendedUsers &&
                      recommendedUsers.map((user, idx) => {
                        if (idx >= 6 && !isShowMoreRecommendedUsers) {
                          return null;
                        }

                        return (
                          <div key={user.id || idx}>
                            <RecommendedUserCard_HomePage
                              user={user}
                              onSuccess={() => {
                                handleOnSuccessSendFriendRequest();
                              }}
                              onError={() => handleOnErrorSendFriendRequest()}
                            />
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </section>
          </div>
        )}

        {/* FRIEND REQUESTS NOTIFICATIONS */}
        {!isShowMoreRecommendedUsers && (
          <div className={`${isShowMoreFriendRequests ? "!mt-0" : "mt-6"}`}>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4 sm:mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl sm:text-2xl font-bold">
                  Lời mời kết bạn đã gửi
                </h1>
                <CountBadge count={outgoingFriendRequestsQuantity}></CountBadge>
              </div>

              <>
                {!isShowMoreFriendRequests ? (
                  <div
                    className="btn btn-outline btn-sm"
                    onClick={handleClickSeeMoreOutGoingFriendRequests}
                  >
                    <Forward className="size-4" />
                    <span className="">Xem thêm</span>
                  </div>
                ) : (
                  <div
                    className="btn btn-outline btn-sm"
                    onClick={handleClickSeeLessOutGoingFriendRequests}
                  >
                    <Undo2 className="size-4" />
                    <span className="">Thu gọn</span>
                  </div>
                )}
              </>
            </div>
            {isLoadingOutgoingFriendRequests ? (
              <div className="flex justify-center h-[100px] items-center">
                <LoaderIcon className="animate-spin size-8" />
              </div>
            ) : (
              <>
                {outgoingFriendRequestsQuantity > 0 ? (
                  <section className="space-y-4">
                    <div className="space-y-3">
                      {outgoingFriendRequests.map((request, idx) => {
                        if (idx >= 3 && !isShowMoreFriendRequests) {
                          return null;
                        }
                        return (
                          <div key={request.id}>
                            <FriendCard_HomePage_OutgoingRequest
                              friend={request.receiver}
                              request={request}
                              onSuccess={() =>
                                handleOnSuccessCancelFriendRequest()
                              }
                              onError={() => handleOnErrorCancelFriendRequest()}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ) : (
                  <NoDataCommon
                    title={"Chưa có lời mời kết bạn nào đã gửi"}
                    content={
                      "Hãy gửi lời mời kết bạn đến người dùng khác để bắt đầu kết nối."
                    }
                  />
                )}
              </>
            )}
          </div>
        )}

        {((isShowMoreRecommendedUsers && recommendedUserQuantity > pageSize) ||
          (isShowMoreFriendRequests &&
            outgoingFriendRequestsQuantity > pageSize)) && (
          <CommonPagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
