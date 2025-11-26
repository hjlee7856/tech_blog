'use client';

import { useState } from 'react';
import {
  ButtonGroup,
  Container,
  FeatureIcon,
  FeatureItem,
  FeatureList,
  GoldText,
  GreenText,
  Header,
  HighlightText,
  NavButton,
  Overlay,
  SkipButton,
  StepContent,
  StepDescription,
  StepDot,
  StepIcon,
  StepIndicator,
  StepTitle,
  Subtitle,
  Title,
} from './OnboardingOverlay.styles';

const ONBOARDING_KEY = 'genshin-bingo-onboarding-seen';

interface OnboardingStep {
  icon: string;
  title: string;
  description: React.ReactNode;
}

const steps: OnboardingStep[] = [
  {
    icon: '🎮',
    title: '원신 캐릭터 빙고에 오신 것을 환영합니다!',
    description: (
      <>
        친구들과 함께 <GoldText>원신 캐릭터 빙고</GoldText>를 즐겨보세요!
        <br />
        간단한 규칙으로 누구나 쉽게 참여할 수 있습니다.
      </>
    ),
  },
  {
    icon: '📝',
    title: '1단계: 보드 만들기',
    description: (
      <>
        <HighlightText>25칸의 빙고 보드</HighlightText>에 원하는 원신 캐릭터를
        배치하세요.
        <FeatureList>
          <FeatureItem>
            <FeatureIcon>✨</FeatureIcon>빈 칸을 클릭하면 캐릭터 선택 창이
            열립니다
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>🔄</FeatureIcon>
            이미 배치된 캐릭터를 클릭하면 변경할 수 있습니다
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>🎲</FeatureIcon>
            랜덤 버튼으로 자동 배치도 가능합니다
          </FeatureItem>
        </FeatureList>
      </>
    ),
  },
  {
    icon: '✅',
    title: '2단계: 준비 완료',
    description: (
      <>
        25칸을 모두 채우면 <GreenText>준비하기</GreenText> 버튼이 활성화됩니다.
        <FeatureList>
          <FeatureItem>
            <FeatureIcon>👥</FeatureIcon>
            모든 참가자가 준비 완료하면 게임이 시작됩니다
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>⏱️</FeatureIcon>
            3초 카운트다운 후 게임이 시작됩니다
          </FeatureItem>
        </FeatureList>
      </>
    ),
  },
  {
    icon: '🎯',
    title: '3단계: 이름 뽑기',
    description: (
      <>
        자신의 차례가 되면 <HighlightText>이름 뽑기</HighlightText> 버튼을
        눌러주세요.
        <FeatureList>
          <FeatureItem>
            <FeatureIcon>🎰</FeatureIcon>
            랜덤으로 캐릭터 이름이 뽑힙니다
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>⭐</FeatureIcon>
            뽑힌 캐릭터가 내 보드에 있으면 자동으로 체크됩니다
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>🔄</FeatureIcon>
            순서대로 돌아가며 이름을 뽑습니다
          </FeatureItem>
        </FeatureList>
      </>
    ),
  },
  {
    icon: '🏆',
    title: '4단계: 빙고 완성!',
    description: (
      <>
        가로, 세로, 대각선으로 <GoldText>5줄</GoldText>을 완성하세요!
        <FeatureList>
          <FeatureItem>
            <FeatureIcon>📊</FeatureIcon>
            실시간으로 순위가 업데이트됩니다
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>🥇</FeatureIcon>
            가장 먼저 많은 줄을 완성한 사람이 승리!
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>🎉</FeatureIcon>
            게임 종료 후 최종 순위를 확인하세요
          </FeatureItem>
        </FeatureList>
      </>
    ),
  },
  {
    icon: '💡',
    title: '추가 팁',
    description: (
      <>
        <FeatureList>
          <FeatureItem>
            <FeatureIcon>👤</FeatureIcon>
            프로필 사진을 클릭하면 변경할 수 있습니다
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>📱</FeatureIcon>
            모바일에서도 플레이 가능합니다
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>🔗</FeatureIcon>
            링크를 공유해서 친구를 초대하세요
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>⚡</FeatureIcon>
            게임 중 나가면 자동으로 오프라인 처리됩니다
          </FeatureItem>
        </FeatureList>
      </>
    ),
  },
];

interface OnboardingOverlayProps {
  onComplete: () => void;
}

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem(ONBOARDING_KEY);
  });

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  if (!step) return null;

  return (
    <Overlay>
      <Container style={{ position: 'relative' }}>
        <SkipButton onClick={handleSkip}>건너뛰기</SkipButton>

        <Header>
          <Title>🎲 게임 가이드</Title>
          <Subtitle>처음이신가요? 간단한 설명을 확인해보세요!</Subtitle>
        </Header>

        <StepIndicator>
          {steps.map((_, index) => (
            <StepDot
              key={index}
              isActive={index === currentStep}
              onClick={() => setCurrentStep(index)}
              aria-label={`${index + 1}단계로 이동`}
            />
          ))}
        </StepIndicator>

        <StepContent>
          <StepIcon>{step.icon}</StepIcon>
          <StepTitle>{step.title}</StepTitle>
          <StepDescription>{step.description}</StepDescription>
        </StepContent>

        <ButtonGroup>
          {currentStep > 0 && (
            <NavButton variant="secondary" onClick={handlePrev}>
              이전
            </NavButton>
          )}
          <NavButton
            variant={isLastStep ? 'start' : 'primary'}
            onClick={handleNext}
          >
            {isLastStep ? '시작하기!' : '다음'}
          </NavButton>
        </ButtonGroup>
      </Container>
    </Overlay>
  );
}
