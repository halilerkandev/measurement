import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: ${({ theme }) =>
    `1fr repeat(12, minmax(auto, ${theme.spacings.xxlarge})) 1fr`};
  grid-template-rows: 7.8rem 1fr 5rem;
  gap: ${({ theme }) => `${theme.spacings.small} ${theme.spacings.small}`};

  @media ${({ theme }) => theme.breakpoints.tablet} {
    grid-template-columns: 1rem repeat(12, 1fr) 1rem;
  }
`;
