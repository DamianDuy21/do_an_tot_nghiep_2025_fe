import { useEffect, useRef, useState } from "react";
import Message from "./Message";

const MockConversation = ({ user, conversation, pendingFile }) => {
  console.log(conversation);
  const [openedMessages, setOpenedMessages] = useState(-1);
  const messagesRefs = useRef([]);
  const scrollRef = useRef();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [user, conversation, pendingFile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideAnyMessage = messagesRefs.current.some(
        (ref) => ref && ref.contains(event.target)
      );

      if (!clickedInsideAnyMessage) {
        setOpenedMessages(-1);
      }
      console.log("Clicked outside of messages, closing all messages");
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 mt-1">
        {/* {conversation &&
          conversation.length > 0 &&
          conversation.map((msg, index) => (
            <Message
              key={index}
              side={
                msg.senderId === "68947326c8a2e0e2c3d1720e" ? "right" : "left"
              }
              sender={msg.sender || {}}
              content={msg.content || msg.text}
              files={msg.files || []}
              timestamp={msg.timestamp || ""}
            />
          ))} */}
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start justify-${
              index % 2 === 0 ? "start" : "end"
            } h-full gap-3`}
          >
            <Message
              ref={(el) => (messagesRefs.current[index] = el)}
              side={index % 2 === 0 ? "left" : "right"}
              sender={conversation[index].sender}
              content={conversation[index].content}
              files={conversation[index].files}
              timestamp={conversation[index].timestamp}
              isOpen={openedMessages === index}
              onToggle={() =>
                setOpenedMessages((prev) => (prev === index ? -1 : index))
              }
            />
          </div>
        ))}
      </div>
      <div ref={scrollRef} className=""></div>
    </>
  );
};

export default MockConversation;
