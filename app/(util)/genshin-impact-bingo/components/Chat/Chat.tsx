'use client';

import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getProfileImagePath } from '../../lib/auth';
import {
  sendChatMessage,
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
  MessageName,
  MessageProfile,
  MessageText,
  MessageTime,
  SendButton,
  Title,
} from './Chat.styles';

// 시간 포맷 함수
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

// 메모이제이션된 메시지 아이템
interface ChatMessageItemProps {
  msg: ChatMessage;
  isMe: boolean;
}

const ChatMessageItem = memo(function ChatMessageItem({
  msg,
  isMe,
}: ChatMessageItemProps) {
  const formattedTime = useMemo(
    () => formatTime(msg.created_at),
    [msg.created_at],
  );

  return (
    <MessageItem isBoast={msg.is_boast} isMe={isMe}>
      <MessageProfile>
        <Image
          src={getProfileImagePath(msg.profile_image || 'Arama')}
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
            {msg.is_boast && msg.rank && <BoastBadge>{msg.rank}위</BoastBadge>}
          </MessageName>
          <MessageTime>{formattedTime}</MessageTime>
        </MessageHeaderContainer>
        <MessageText>{msg.message}</MessageText>
      </MessageContent>
    </MessageItem>
  );
});

interface ChatProps {
  userId?: number;
  userName?: string;
  profileImage?: string;
  myScore?: number; // 빙고 줄 수
  myRank?: number; // 순위
  isGameStarted?: boolean;
}

export function Chat({
  userId,
  userName,
  profileImage,
  myScore,
  myRank,
  isGameStarted,
}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  // 3위권 + 1빙고 이상일 때만 자랑 가능
  const canBoast = useMemo(
    () =>
      isGameStarted &&
      myScore !== undefined &&
      myScore >= 1 &&
      myRank !== undefined &&
      myRank <= 3,
    [isGameStarted, myScore, myRank],
  );

  useEffect(() => {
    const subscription = subscribeToChatMessages(
      // 초기 로드
      (initialMessages) => {
        setMessages(initialMessages);
      },
      // 새 메시지 추가
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      },
    );

    return () => {
      void subscription.unsubscribe();
    };
  }, []);

  // 새 메시지가 추가될 때만 스크롤
  useEffect(() => {
    if (
      messages.length > prevMessageCountRef.current &&
      messageListRef.current
    ) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    if (!userId || !userName || !inputValue.trim() || isSending) return;

    setIsSending(true);
    await sendChatMessage(
      userId,
      userName,
      profileImage || 'Arama',
      inputValue.trim(),
    );
    setInputValue('');
    setIsSending(false);
  }, [userId, userName, profileImage, inputValue, isSending]);

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
  }, [userId, userName, profileImage, canBoast, isSending, myScore, myRank]);

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
    },
    [],
  );

  return (
    <Container>
      <Title>원직쉼 빙고 채팅방</Title>
      <MessageList ref={messageListRef}>
        {messages.length === 0 ? (
          <EmptyMessage>아직 메시지가 없습니다</EmptyMessage>
        ) : (
          messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              msg={msg}
              isMe={msg.user_id === userId}
            />
          ))
        )}
      </MessageList>
      {userId && (
        <InputSection>
          <ChatInput
            type="text"
            placeholder="메시지를 입력하세요..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isSending}
          />
          <ButtonSection>
            {canBoast && (
              <BoastButton
                onClick={() => void handleBoast()}
                disabled={isSending}
              >
                🎉 자랑하기
              </BoastButton>
            )}
            <SendButton
              onClick={() => void handleSend()}
              disabled={isSending || !inputValue.trim()}
            >
              전송
            </SendButton>
          </ButtonSection>
        </InputSection>
      )}
    </Container>
  );
}
