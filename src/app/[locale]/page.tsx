import { Faq } from "@/features/landing/Faq";
import { Feature } from "@/features/landing/Feature";
import { Footer } from "@/features/landing/Footer";
import { Hero } from "@/features/landing/Hero";
import { Navbar } from "@/features/landing/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <Feature />
      <Faq />
      <Footer />
    </main>
  );
}
