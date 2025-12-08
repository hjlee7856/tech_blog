'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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
  MessageItem,
  MessageList,
  MessageName,
  MessageProfile,
  MessageText,
  SendButton,
  Title,
} from './Chat.styles';

interface ChatProps {
  userId?: number;
  userName?: string;
  profileImage?: string;
  myRank?: number;
  isGameStarted?: boolean;
}

export function Chat({
  userId,
  userName,
  profileImage,
  myRank,
  isGameStarted,
}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  // 3위권 내인지 확인
  const canBoast =
    isGameStarted && myRank !== undefined && myRank > 0 && myRank <= 3;

  useEffect(() => {
    const subscription = subscribeToChatMessages((newMessages) => {
      setMessages(newMessages);
    });

    return () => {
      void subscription.unsubscribe();
    };
  }, []);

  // 새 메시지가 오면 스크롤 아래로
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
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
  };

  const handleBoast = async () => {
    if (!userId || !userName || !canBoast || isSending) return;

    setIsSending(true);
    const boastMessage =
      myRank === 1 ? '🏆 Bingo!' : myRank === 2 ? '🥈 Bingo!' : '🥉 Bingo!';

    await sendChatMessage(
      userId,
      userName,
      profileImage || 'Arama',
      boastMessage,
      true,
      myRank,
    );
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <Container>
      <Title>💬 채팅</Title>
      <MessageList ref={messageListRef}>
        {messages.length === 0 ? (
          <EmptyMessage>아직 메시지가 없습니다</EmptyMessage>
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg.id}
              isBoast={msg.is_boast}
              isMe={msg.user_id === userId}
            >
              <MessageProfile>
                <Image
                  src={getProfileImagePath(msg.profile_image || 'Arama')}
                  alt={msg.user_name}
                  width={24}
                  height={24}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              </MessageProfile>
              <MessageContent>
                <MessageName>
                  {msg.user_name}
                  {msg.is_boast && msg.rank && (
                    <BoastBadge>{msg.rank}위</BoastBadge>
                  )}
                </MessageName>
                <MessageText>{msg.message}</MessageText>
              </MessageContent>
            </MessageItem>
          ))
        )}
      </MessageList>
      {userId && (
        <InputSection>
          <ChatInput
            type="text"
            placeholder="메시지를 입력하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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
