interface RightBarConversationProps {
  isOpenRightBar: boolean;
}

function RightBarConversation({ isOpenRightBar }: RightBarConversationProps) {
  return (
    <div
      className={`${isOpenRightBar ? "" : "hidden"} border-l border-base-300`}
    >
      RightBarConversation
    </div>
  );
}

export default RightBarConversation;
