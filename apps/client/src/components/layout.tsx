import { Oswald } from 'next/font/google';
import clsx from 'clsx';
import { ThemeProvider } from 'next-themes';
import { Menu } from './menu';
import { useRouter } from 'next/router';
const oswald = Oswald({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { asPath } = useRouter();
  const overlay = asPath !== '/';
  return (
    <ThemeProvider enableSystem attribute="class">
      <main
        className={clsx(
          oswald.className,
          'animated-gradient bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] to-background via-background/25 from-primary'
        )}
      >
        <Stars />
        <div
          className={clsx(
            'h-dvh overflow-hidden',
            overlay && 'bg-background/50  backdrop-blur'
          )}
        >
          <Menu />
          {children}
        </div>
      </main>
    </ThemeProvider>
  );
};

const Stars = () => {
  return (
    <div className="fixed top-0 left-0 w-full -rotate-[22.5deg] lg:ml-[640px] lg:-translate-x-72 z-0">
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
      <div className="star" />
    </div>
  );
};
