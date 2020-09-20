import React from 'react';

import { Wrapper } from './styled';
import { GradientHeader } from '../../styled';

export const Footer = () => {
  return (
    <Wrapper>
      <GradientHeader
        href='https://github.com/h3rk4nd'
        rel='noopener noreferrer'
        target='_blank'
        size={1}
        letterSpacing='0.2rem'
        as='a'
      >
        h3rk4nd
      </GradientHeader>
    </Wrapper>
  );
};
