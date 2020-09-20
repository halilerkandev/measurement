import { Wrapper } from './styled';

export const Container = ({ children, ...restProps }) => {
  return <Wrapper {...restProps}>{children}</Wrapper>;
};
