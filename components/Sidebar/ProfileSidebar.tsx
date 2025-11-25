'use client';

import { NotionCategoryFilter } from 'app/(blog)/components/Category/NotionCategoryFilter';
import { FaGithub } from 'react-icons/fa';
import {
  Bio,
  CategoryList,
  CategoryTitle,
  Divider,
  Email,
  GithubLink,
  Name,
  ProfileImage,
  Sidebar,
  SidebarOverlay,
} from './ProfileSidebar.styles';

interface ProfileSidebarProps {
  profileImage?: string;
  name: string;
  email: string;
  bio: string;
  githubUrl?: string;
  categories?: { category: string; order: number; count: number }[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  isOpen?: boolean;
}

export function ProfileSidebar({
  profileImage,
  name,
  email,
  bio,
  githubUrl,
  categories = [],
  activeCategory = '',
  onCategoryChange,
  isOpen = false,
}: ProfileSidebarProps) {
  return (
    <>
      {isOpen && <SidebarOverlay />}
      <Sidebar isOpen={isOpen}>
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          {profileImage && <ProfileImage src={profileImage} alt={name} />}
          <svg
            className="hidden"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius: '50%',
              backgroundColor: '#e5e7eb',
              border: '3px solid #fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            }}
          >
            <circle cx="50" cy="35" r="18" fill="#9ca3af" />
            <path
              d="M 20 70 Q 20 55 50 55 Q 80 55 80 70 L 80 100 Q 80 100 50 100 Q 20 100 20 100 Z"
              fill="#9ca3af"
            />
          </svg>
        </div>
        <Name>{name}</Name>
        <Email href={`mailto:${email}`}>{email}</Email>
        <Bio>{bio}</Bio>
        {githubUrl && (
          <GithubLink
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={16} />
            GitHub
          </GithubLink>
        )}
        {categories.length > 0 && (
          <>
            <Divider />
            <CategoryTitle>카테고리</CategoryTitle>
            <CategoryList>
              <NotionCategoryFilter
                activeCategory={activeCategory}
                categories={categories}
                onCategoryChange={onCategoryChange || (() => {})}
              />
            </CategoryList>
          </>
        )}
      </Sidebar>
    </>
  );
}
