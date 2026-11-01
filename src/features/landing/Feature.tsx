"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Feature = () => {
  const t = useTranslations("HomePage");
  interface FeatureItem {
    id: number;
    title: string;
    image: string;
    description: string;
  }

  const defaultFeatures: FeatureItem[] = [
    {
      id: 1,
      title: t("features.readyDashboard.title"),
      image: "https://shadcnblocks.com/images/block/placeholder-1.svg",
      description: t("features.readyDashboard.description"),
    },
    {
      id: 2,
      title: t("features.tailwindTypescript.title"),
      image: "https://shadcnblocks.com/images/block/placeholder-2.svg",
      description: t("features.tailwindTypescript.description"),
    },
    {
      id: 3,
      title: t("features.darkMode.title"),
      image: "https://shadcnblocks.com/images/block/placeholder-3.svg",
      description: t("features.darkMode.description"),
    },
    {
      id: 4,
      title: t("features.accessibility.title"),
      image: "https://shadcnblocks.com/images/block/placeholder-4.svg",
      description: t("features.accessibility.description"),
    },
    {
      id: 5,
      title: t("features.modernStack.title"),
      image: "https://shadcnblocks.com/images/block/placeholder-5.svg",
      description: t("features.modernStack.description"),
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
                        alt={t("features.imageAlt", { title: tab.title })}
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
              alt={t("features.previewImageAlt")}
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
