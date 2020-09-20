import { ThemeProvider } from 'styled-components';

import { theme, GlobalStyle } from '../themes';
import { Container, Header, Main, Footer } from '../components';
import { MetricsProvider } from '../contexts';

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Header />
        <Main>
          <MetricsProvider>
            <Component {...pageProps} />
          </MetricsProvider>
        </Main>
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

export default MyApp;
