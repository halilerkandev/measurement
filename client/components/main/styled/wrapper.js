import styled from 'styled-components';

export const Wrapper = styled.main`
  grid-column: 2 / span 12;
  grid-row: 2 / 3;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem 1rem;
  min-height: calc(100vh - 14.8rem);

  @media ${({ theme }) => theme.breakpoints.laptop} {
    grid-template-columns: repeat(3, 1fr);
  }

  @media ${({ theme }) => theme.breakpoints.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    grid-template-columns: repeat(1, 1fr);
  }
`;
