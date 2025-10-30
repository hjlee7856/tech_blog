import * as React from 'react'

import { CopyrightSection, FooterContent, FooterWrapper } from './Footer.styles'

// TODO: merge the data and icons from PageSocial with the social links in Footer

function FooterImpl() {
  const currentYear = new Date().getFullYear()

  return (
    <FooterWrapper>
      <FooterContent>
        <CopyrightSection>
          <p>© {currentYear} HJ All rights reserved.</p>
        </CopyrightSection>
      </FooterContent>
    </FooterWrapper>
  )
}

export const Footer = React.memo(FooterImpl)
