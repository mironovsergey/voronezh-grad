import StoreProvider from './store-provider';
import Header from '@/components/elements/header';
import Footer from '@/components/elements/footer';

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <div className="root">
            <Header />
            {children}
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
};

export default RootLayout;
