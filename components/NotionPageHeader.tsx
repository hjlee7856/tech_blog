import cs from 'classnames';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useNotionContext } from 'react-notion-x';

import { useAuthStore } from '@/store/authStore';

import styles from './styles.module.css';

export function NotionPageHeader() {
  const { components } = useNotionContext();
  const { isLoggedIn, logout } = useAuthStore();
  const router = useRouter();
  const isPreviewPath = router.pathname.startsWith('/preview');
  const [isVisible, setIsVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);
  const ticking = React.useRef(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY === 0) {
        setIsVisible(true);
      } else if (currentY > lastScrollY.current) {
        setIsVisible(false);
      } else if (currentY < lastScrollY.current) {
        setIsVisible(true);
      }
      lastScrollY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(handleScroll);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cs('notion-header', 'fade-header', {
        'fade-header--visible': isVisible,
        'fade-header--hidden': !isVisible,
      })}
    >
      <div className="notion-nav-header">
        <div className="notion-nav-header-rhs breadcrumbs">
          {isPreviewPath && isLoggedIn ? (
            <components.Link
              className={cs(styles.navLink, 'breadcrumb', 'button')}
              onClick={async () => {
                await router.push('/');
                logout();
                Cookies.remove('token');
              }}
            >
              로그아웃
            </components.Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
