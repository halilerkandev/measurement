import styled from 'styled-components';

export const GradientHeader = styled.h1`
  display: inline-block;
  background-image: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0%, rgba(228, 2, 3, 1)),
    color-stop(100%, rgba(117, 7, 135, 1))
  );
  background-image: linear-gradient(
    90deg,
    rgba(228, 2, 3, 1) 0%,
    rgba(117, 7, 135, 1) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  ${({ size }) =>
    size
      ? `
    font-size: ${size}rem;
    line-height: ${size + 1}rem;
  `
      : `
    font-size: 3rem;
    line-height: 4rem;
  `}

  ${({ bold }) => bold && `font-weight: bold;`}
  ${({ letterSpacing }) => letterSpacing && `letter-spacing: ${letterSpacing};`}

  @media ${({ theme }) => theme.breakpoints.mobile} {
    ${({ size }) =>
      size
        ? `
    font-size: ${size}rem;
    line-height: ${size + 1}rem;
  `
        : `
    font-size: 2rem;
    line-height: 3rem;
  `}
  }
`;
