import React from 'react';
import Link from 'next/link';

import { Wrapper } from './styled';
import { GradientHeader } from '../../styled';

export const Header = () => {
  return (
    <Wrapper>
      <nav>
        <ul>
          <li>
            <GradientHeader letterSpacing='0.3rem' as='h1'>
              <Link href='/'>PerfAnalitics</Link>
            </GradientHeader>
          </li>
        </ul>
      </nav>
    </Wrapper>
  );
};
