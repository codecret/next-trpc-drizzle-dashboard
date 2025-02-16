import { Faq } from "@/components/landing/Faq";
import { Feature } from "@/components/landing/Feature";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Hero />
      <Feature />
      <Faq />
      <Footer />
    </div>
  );
}
