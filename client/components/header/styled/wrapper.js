import styled from 'styled-components';

export const Wrapper = styled.header`
  grid-column: 2 / span 12;
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  justify-content: center;

  & li {
    list-style: none;

    a {
      text-decoration: none;
      cursor: pointer;
    }
  }
`;
