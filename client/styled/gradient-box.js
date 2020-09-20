import styled from 'styled-components';

export const GradientBox = styled.div`
  padding: ${({ borderWidth }) => (borderWidth ? borderWidth : '2px')};
  background-image: -webkit-gradient(
    linear,
    left bottom,
    right top,
    color-stop(0%, rgba(228, 2, 3, 1)),
    color-stop(100%, rgba(117, 7, 135, 1))
  );
  background-image: linear-gradient(
    to top right,
    rgba(228, 2, 3, 1) 0%,
    rgba(117, 7, 135, 1) 100%
  );
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : '2px')};
`;
