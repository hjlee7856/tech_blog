import { siteConfig } from './lib/site-config';

export default siteConfig({
  rootNotionPageId: '28082666ec16801b81f6f9a3e6417905',
  rootNotionSpaceId: '91d2994b944c4f20966778124aafcd9e',
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
  navigationStyle: 'custom',
});
