import { styled } from '@/styled-system/jsx';

export const Sidebar = styled('aside', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '32px 24px',
    borderRadius: '12px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    height: 'fit-content',
    width: '280px',
    minWidth: '280px',
    maxWidth: '280px',
    flexShrink: 0,
    position: 'sticky',
    top: '0px',
    '@media (max-width: 1024px)': {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      borderRadius: 0,
      zIndex: 101,
      transform: 'translateX(-100%)',
      transition: 'transform 0.3s ease',
    },
  },
  variants: {
    isOpen: {
      true: {
        '@media (max-width: 1024px)': {
          transform: 'translateX(0)',
        },
      },
    },
  },
});

export const ProfileImage = styled('img', {
  base: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    backgroundColor: '#e5e7eb',
  },
});

export const Name = styled('h3', {
  base: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: '8px 0 0 0',
    textAlign: 'center',
    letterSpacing: '-0.5px',
  },
});

export const Email = styled('a', {
  base: {
    fontSize: '13px',
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    _hover: {
      color: '#3b82f6',
    },
  },
});

export const Bio = styled('p', {
  base: {
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.5',
    margin: '0',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export const GithubLink = styled('a', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: '#111827',
    color: '#fff !important',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
});

export const Divider = styled('div', {
  base: {
    width: '100%',
    height: '1px',
    backgroundColor: '#d1d5db',
    margin: '12px 0',
  },
});

export const CategoryTitle = styled('h4', {
  base: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 12px 0',
    textAlign: 'center',
    width: '100%',
    letterSpacing: '-0.3px',
  },
});

export const CategoryList = styled('div', {
  base: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
});

export const SidebarToggle = styled('button', {
  base: {
    display: 'none',
    position: 'fixed',
    top: '16px',
    left: '16px',
    zIndex: 999,
    backgroundColor: '#1f2937',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '20px',
    cursor: 'pointer',
    '@media (max-width: 1024px)': {
      display: 'block',
    },
  },
});

export const SidebarOverlay = styled('div', {
  base: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
    '@media (max-width: 1024px)': {
      display: 'block',
    },
  },
});
