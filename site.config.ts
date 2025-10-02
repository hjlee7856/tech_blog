import { siteConfig } from './lib/site-config';

export default siteConfig({
  rootNotionPageId: '21c82666ec1680598597d54bbb0aae92',
  rootNotionSpaceId: null,
  name: 'HJ Tech Blog',
  domain: process.env.VERCEL_DOMAIN || 'localhost:3000',
  author: 'HJ',
  description: 'HJ Tech Blog',
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,
  isPreviewImageSupportEnabled: false,
  isRedisEnabled: false,
  pageUrlOverrides: null,
  navigationStyle: 'custom'
});
