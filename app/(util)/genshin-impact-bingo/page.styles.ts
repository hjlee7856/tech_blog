import { styled } from '@/styled-system/jsx';

export const Page = styled('div', {
  base: {
    position: 'relative',
    backgroundColor: '#1E1F22',
    padding: '40px 20px',
    minHeight: { mdDown: '100vh' },
  },
});

export const Title = styled('h1', {
  base: {
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '24px',
    marginTop: { mdDown: '48px' },
  },
});
