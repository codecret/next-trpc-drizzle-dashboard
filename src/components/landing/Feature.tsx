"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const Feature = () => {
  interface FeatureItem {
    id: number;
    title: string;
    image: string;
    description: string;
  }

  const defaultFeatures: FeatureItem[] = [
    {
      id: 1,
      title: "Ready-to-Use Dashboard",
      image: "https://shadcnblocks.com/images/block/placeholder-1.svg",
      description:
        "Browse through our dashboard for great blocks designed with shadcn/ui. Each block is carefully crafted to be responsive, accessible, and easily customizable. Simply copy and paste the code into your project.",
    },
    {
      id: 2,
      title: "Tailwind CSS & TypeScript",
      image: "https://shadcnblocks.com/images/block/placeholder-2.svg",
      description:
        "Built with Tailwind CSS for rapid styling and TypeScript for type safety. Our blocks leverage the full power of Tailwind's utility classes while maintaining clean, type-safe code that integrates seamlessly with your Next.js projects.",
    },
    {
      id: 3,
      title: "Dark Mode & Customization",
      image: "https://shadcnblocks.com/images/block/placeholder-3.svg",
      description:
        "Every block supports dark mode out of the box and can be customized to match your brand. Modify colors, spacing, and typography using Tailwind's configuration. The shadcn/ui theming system makes it easy to maintain consistency across your site.",
    },
    {
      id: 4,
      title: "Accessibility First",
      image: "https://shadcnblocks.com/images/block/placeholder-4.svg",
      description:
        "All blocks are built with accessibility in mind, following WCAG guidelines. They include proper ARIA labels, keyboard navigation support, and semantic HTML structure. Ensure your website is usable by everyone without extra effort.",
    },
    {
      id: 5,
      title: "Modern Development Stack",
      image: "https://shadcnblocks.com/images/block/placeholder-5.svg",
      description:
        "Built for modern web development with React 18, Next.js 14, and the latest shadcn/ui components. Take advantage of React Server Components, TypeScript strict mode, and other cutting-edge features while maintaining excellent performance.",
    },
  ];
  const [activeTabId, setActiveTabId] = useState<number | null>(1);
  const [activeImage, setActiveImage] = useState(defaultFeatures[0].image);

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="mb-12 flex w-full items-start justify-between gap-12">
          <div className="w-full md:w-1/2">
            <Accordion type="single" className="w-full" defaultValue="item-1">
              {defaultFeatures.map((tab) => (
                <AccordionItem key={tab.id} value={`item-${tab.id}`}>
                  <AccordionTrigger
                    onClick={() => {
                      setActiveImage(tab.image);
                      setActiveTabId(tab.id);
                    }}
                    className="cursor-pointer py-5 !no-underline transition"
                  >
                    <h6
                      className={`text-xl font-semibold ${
                        tab.id === activeTabId
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {tab.title}
                    </h6>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mt-3 text-muted-foreground">
                      {tab.description}
                    </p>
                    <div className="mt-4 md:hidden">
                      <Image
                        src={tab.image}
                        alt={tab.title}
                        className="h-full max-h-80 w-full rounded-md object-cover"
                        width={40}
                        height={40}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className=" m-auto hidden w-1/2 overflow-hidden rounded-xl bg-muted md:block">
            <Image
              src={activeImage}
              alt="Feature preview"
              className="aspect-[4/3] rounded-md object-cover pl-4"
              width={800}
              height={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature };
