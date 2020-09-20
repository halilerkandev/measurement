import { Wrapper } from './styled';

export const Main = ({ children, ...restProps }) => {
  return <Wrapper {...restProps}>{children}</Wrapper>;
};
