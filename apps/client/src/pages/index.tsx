import { Button } from 'ui/core/components/button';
import Link from 'next/link';
import { SignupCard } from '../components/signup-card';

const Home = () => {
  return (
    <section className="flex flex-col items-center justify-center space-y-4 text-center h-dvh relative px-4 py-2">
      <div className="space-y-2 w-full max-w-xs lg:max-w-xl ">
        <div className="text-3xl text-center font-semibold sm:text-4xl md:text-5xl lg:text-6xl w-full justify-between inline-flex">
          <span className='mx-auto'>greentea.coffee
            </span>
        </div>
        {/* <p className="mx-auto md:text-xl">. . .</p> */}
      </div>
      <div className="h-[2px] bg-primary w-full max-w-[300px] lg:max-w-[650px]" />
      <SignupCard />
      <p className="text-foreground">
        Already have an account?
        <Link href="/login" className="ml-2 text-primary tracking-widest">
          Login
        </Link>
      </p>
    </section>
  );
};
export default Home;
