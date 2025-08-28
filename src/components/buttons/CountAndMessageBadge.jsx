import { MessageCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

const CountAndMessageBadge = ({ count, id, className }) => {
  const displayCount = count > 99 ? "9+" : count;

  const navigate = useNavigate();

  return (
    <div
      className={`${className} group w-fit h-fit`}
      onClick={() => navigate(`/chats`)}
    >
      <div
        className={`btn btn-primary size-8 p-0 min-w-0 min-h-0 rounded-card cursor-pointer text-sm items-center justify-center ${
          count == 0 ? "" : "hidden"
        } group-hover:flex`}
      >
        <MessageCircle className="size-4" />
      </div>

      <div
        className={`btn btn-primary size-8 p-0 min-w-0 min-h-0 rounded-card cursor-pointer flex text-sm items-center justify-center ${
          count == 0 ? "hidden" : ""
        } group-hover:hidden`}
      >
        {displayCount}
      </div>
    </div>
  );
};

export default CountAndMessageBadge;
