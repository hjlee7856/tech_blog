'use client';

import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getProfileImagePath } from '../../lib/auth';
import { createNameMap } from '../../lib/characterUtils';
import {
  parseRequestMessage,
  sendChatMessage,
  sendRequestChatMessage,
  subscribeToChatMessages,
  type ChatMessage,
} from '../../lib/game';
import {
  BoastBadge,
  BoastButton,
  ButtonSection,
  ChatInput,
  Container,
  EmptyMessage,
  InputSection,
  MessageContent,
  MessageHeaderContainer,
  MessageItem,
  MessageList,
  MessageListWrapper,
  MessageName,
  MessageProfile,
  MessageText,
  MessageTime,
  NewMessageToast,
  NewMessageToastAvatar,
  NewMessageToastBadge,
  NewMessageToastText,
  RequestButton,
  RequestButtonGroup,
  RequestCharacterItem,
  RequestCharacterLabel,
  RequestCharacterPanel,
  ScrollToBottomFloatingButton,
  SendButton,
  Title,
  TypingAvatar,
  TypingAvatarStack,
  TypingIndicator,
} from './Chat.styles';
import { useChatPresence } from './useChatPresence';

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours % 12 || 12;
  return `${year}-${month}-${day} ${period} ${displayHours}:${minutes}`;
}

function isNearBottom(args: {
  element: HTMLDivElement;
  thresholdPx: number;
}): boolean {
  const { element, thresholdPx } = args;

  const remaining =
    element.scrollHeight - element.scrollTop - element.clientHeight;
  return remaining <= thresholdPx;
}

interface ChatMessageItemProps {
  msg: ChatMessage;
  isMe: boolean;
  isTyping: boolean;
}

const ChatMessageItem = memo(function ChatMessageItem({
  msg,
  isMe,
  isTyping,
}: ChatMessageItemProps) {
  const formattedTime = useMemo(
    () => formatTime(msg.created_at),
    [msg.created_at],
  );

  const parsed = useMemo(() => parseRequestMessage(msg.message), [msg.message]);

  const profileImageKey = msg.profile_image || 'Arama';

  const displayMessage = parsed.isRequest ? parsed.text : msg.message;

  return (
    <MessageItem
      isBoast={msg.is_boast}
      isMe={isMe}
      isRequest={parsed.isRequest}
    >
      <MessageProfile isTyping={isTyping}>
        <Image
          src={getProfileImagePath(profileImageKey)}
          alt={msg.user_name}
          width={32}
          height={32}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
      </MessageProfile>
      <MessageContent>
        <MessageHeaderContainer>
          <MessageName>
            {msg.user_name}
            {isMe && '(나)'}
            {msg.is_boast && msg.rank && <BoastBadge>{msg.rank}위</BoastBadge>}
          </MessageName>
          <MessageTime>{formattedTime}</MessageTime>
        </MessageHeaderContainer>
        <MessageText>
          {parsed.isRequest && parsed.characterKey && (
            <Image
              src={getProfileImagePath(parsed.characterKey)}
              alt={parsed.characterKey}
              width={20}
              height={20}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          {displayMessage}
        </MessageText>
      </MessageContent>
    </MessageItem>
  );
});

interface ChatProps {
  userId?: number;
  userName?: string;
  profileImage?: string;
  myScore?: number;
  myRank?: number;
  isGameStarted?: boolean;
  myBoard?: (string | null)[];
  characterNames?: string[];
  characterEnNames?: string[];
  isSpectator?: boolean;
}

export function Chat({
  userId,
  userName,
  profileImage,
  myScore,
  myRank,
  isGameStarted,
  myBoard,
  characterNames,
  characterEnNames,
  isSpectator,
}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRequestPanelOpen, setIsRequestPanelOpen] = useState(false);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const messageListRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);
  const isPinnedToBottomRef = useRef(true);

  const { typingUsers, typingText, onLocalInputActivity, stopTyping } =
    useChatPresence({
      userId,
      userName,
      profileImage,
    });

  const nameMap = useMemo(() => {
    if (!characterNames || !characterEnNames) return new Map<string, string>();
    return createNameMap(characterNames, characterEnNames);
  }, [characterNames, characterEnNames]);

  const myBoardCharacterNames = useMemo(() => {
    if (!myBoard) return [];

    const unique = new Set<string>();
    for (const name of myBoard) {
      if (!name) continue;
      if (!name.trim()) continue;
      unique.add(name);
    }
    return [...unique];
  }, [myBoard]);

  const canBoast = useMemo(
    () =>
      !isSpectator &&
      isGameStarted &&
      myScore !== undefined &&
      myScore >= 1 &&
      myRank !== undefined &&
      myRank <= 3,
    [isSpectator, isGameStarted, myScore, myRank],
  );

  useEffect(() => {
    const subscription = subscribeToChatMessages(
      (initialMessages) => {
        setMessages(initialMessages);
      },
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      },
    );

    return () => {
      void subscription.unsubscribe();
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    const element = messageListRef.current;
    if (!element) return;

    element.scrollTop = element.scrollHeight;
    setIsAutoScrollEnabled(true);
    setUnreadCount(0);
    isPinnedToBottomRef.current = true;
  }, []);

  const handleMessageListScroll = useCallback(() => {
    const element = messageListRef.current;
    if (!element) return;

    const thresholdPx = 24;
    const nextIsEnabled = isNearBottom({ element, thresholdPx });

    isPinnedToBottomRef.current = nextIsEnabled;

    setIsAutoScrollEnabled((prev) => {
      if (prev === nextIsEnabled) return prev;
      return nextIsEnabled;
    });
  }, []);

  useEffect(() => {
    const element = messageListRef.current;
    const nextCount = messages.length;
    const prevCount = prevMessageCountRef.current;

    if (!element) {
      prevMessageCountRef.current = nextCount;
      return;
    }

    const latest = messages.at(-1);
    const isFromMe = !!userId && latest?.user_id === userId;
    const shouldStickToBottom = isPinnedToBottomRef.current || isFromMe;

    if (nextCount > prevCount && shouldStickToBottom) {
      scrollToBottom();
      prevMessageCountRef.current = messages.length;
      return;
    }

    const thresholdPx = 24;
    const isNear = isNearBottom({ element, thresholdPx });

    setIsAutoScrollEnabled(isNear);
    isPinnedToBottomRef.current = isNear;

    if (nextCount > prevCount && !isNear)
      setUnreadCount((prev) => prev + (nextCount - prevCount));

    prevMessageCountRef.current = messages.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    messages.length,
    isAutoScrollEnabled,
    scrollToBottom,
    handleMessageListScroll,
    userId,
  ]);

  useEffect(() => {
    if (!isAutoScrollEnabled) return;
    if (unreadCount === 0) return;
    setUnreadCount(0);
  }, [isAutoScrollEnabled, unreadCount]);

  const latestUnreadPreview = useMemo(() => {
    if (unreadCount === 0) return '';
    if (messages.length === 0) return '';

    const latest = messages.at(-1);
    if (!latest) return '';

    const text = latest.message?.trim() ?? '';
    if (!text) return `${latest.user_name}님의 새 메시지`;
    return `${latest.user_name}: ${text}`;
  }, [messages, unreadCount]);

  const latestUnreadProfileImageKey = useMemo(() => {
    if (unreadCount === 0) return null;
    const latest = messages.at(-1);
    if (!latest) return null;
    return latest.profile_image || 'Arama';
  }, [messages, unreadCount]);

  const handleSend = useCallback(async () => {
    if (!userId || !userName || !inputValue.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendChatMessage(
        userId,
        userName,
        profileImage || 'Arama',
        inputValue.trim(),
      );
      setInputValue('');
      setIsRequestPanelOpen(false);
      scrollToBottom();
    } finally {
      stopTyping();
      setIsSending(false);
    }
  }, [
    userId,
    userName,
    profileImage,
    inputValue,
    isSending,
    stopTyping,
    scrollToBottom,
  ]);

  const handleBoast = useCallback(async () => {
    if (!userId || !userName || !canBoast || isSending || !myScore || !myRank)
      return;

    setIsSending(true);
    const boastMessage = `🎉 ${myScore}빙고!`;

    await sendChatMessage(
      userId,
      userName,
      profileImage || 'Arama',
      boastMessage,
      true,
      myRank,
    );
    setIsSending(false);
    scrollToBottom();
  }, [
    userId,
    userName,
    profileImage,
    canBoast,
    isSending,
    myScore,
    myRank,
    scrollToBottom,
  ]);

  const handleToggleRequestPanel = useCallback(() => {
    if (!userId || !userName) return;
    if (!isGameStarted) return;
    setIsRequestPanelOpen((prev) => !prev);
  }, [userId, userName, isGameStarted]);

  const handleSendRequest = useCallback(
    async ({ characterName }: { characterName: string }) => {
      if (!userId || !userName || isSending) return;

      const characterKey = nameMap.get(characterName) ?? 'Aino';
      const requestText = `${characterName} 뽑아주세요 🙏`;

      setIsSending(true);
      await sendRequestChatMessage({
        userId,
        userName,
        profileImage: profileImage || 'Arama',
        characterKey,
        text: requestText,
      });
      setInputValue('');
      setIsSending(false);
      setIsRequestPanelOpen(false);
      scrollToBottom();
    },
    [userId, userName, profileImage, isSending, nameMap, scrollToBottom],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);

      onLocalInputActivity();
    },
    [onLocalInputActivity],
  );

  return (
    <Container isSpectator={isSpectator}>
      <Title>원직쉼 빙고 채팅방</Title>
      <MessageListWrapper>
        <MessageList ref={messageListRef} onScroll={handleMessageListScroll}>
          {messages.length === 0 ? (
            <EmptyMessage>아직 메시지가 없습니다</EmptyMessage>
          ) : (
            messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                msg={msg}
                isMe={msg.user_id === userId}
                isTyping={typingUsers.some((u) => u.id === msg.user_id)}
              />
            ))
          )}
        </MessageList>

        {unreadCount > 0 && !isAutoScrollEnabled && (
          <NewMessageToast type="button" onClick={scrollToBottom}>
            {latestUnreadProfileImageKey && (
              <NewMessageToastAvatar>
                <Image
                  src={getProfileImagePath(latestUnreadProfileImageKey)}
                  alt={latestUnreadProfileImageKey}
                  width={24}
                  height={24}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              </NewMessageToastAvatar>
            )}
            <NewMessageToastText>{latestUnreadPreview}</NewMessageToastText>
            <NewMessageToastBadge>{unreadCount}</NewMessageToastBadge>
          </NewMessageToast>
        )}

        {unreadCount === 0 && !isAutoScrollEnabled && (
          <ScrollToBottomFloatingButton type="button" onClick={scrollToBottom}>
            ↓
          </ScrollToBottomFloatingButton>
        )}
      </MessageListWrapper>
      {userId && (
        <InputSection>
          <TypingIndicator>
            {typingUsers.length > 0 && (
              <TypingAvatarStack>
                {typingUsers.slice(0, 3).map((u) => {
                  const profileImageKey = u.profileImage || 'Arama';
                  return (
                    <TypingAvatar key={u.id}>
                      <Image
                        src={getProfileImagePath(profileImageKey)}
                        alt={profileImageKey}
                        width={18}
                        height={18}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </TypingAvatar>
                  );
                })}
              </TypingAvatarStack>
            )}
            {typingText}
          </TypingIndicator>
          <ChatInput
            type="text"
            placeholder="메시지를 입력하세요..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isSending}
          />
          <ButtonSection>
            <RequestButtonGroup>
              {!isSpectator && canBoast && (
                <BoastButton
                  onClick={() => void handleBoast()}
                  disabled={isSending}
                >
                  자랑하기
                </BoastButton>
              )}
            </RequestButtonGroup>
            <SendButton
              onClick={() => void handleSend()}
              disabled={isSending || !inputValue.trim()}
            >
              전송
            </SendButton>
          </ButtonSection>
          {!isSpectator && isGameStarted && isRequestPanelOpen && (
            <RequestCharacterPanel>
              {myBoardCharacterNames.length === 0 && (
                <RequestCharacterLabel>
                  보드에 캐릭터가 없어서 요청할 수 없습니다
                </RequestCharacterLabel>
              )}
              {myBoardCharacterNames.map((characterName) => {
                const characterKey = nameMap.get(characterName) ?? 'Aino';
                return (
                  <RequestCharacterItem
                    key={characterName}
                    type="button"
                    onClick={() => void handleSendRequest({ characterName })}
                  >
                    <Image
                      src={getProfileImagePath(characterKey)}
                      alt={characterName}
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <RequestCharacterLabel>
                      {characterName}
                    </RequestCharacterLabel>
                  </RequestCharacterItem>
                );
              })}
            </RequestCharacterPanel>
          )}
        </InputSection>
      )}
    </Container>
  );
}
