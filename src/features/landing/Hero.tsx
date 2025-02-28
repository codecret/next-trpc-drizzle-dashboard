import { ExternalLink } from "lucide-react";
import { cn } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Hero = () => {
  const t = useTranslations("HomePage");

  return (
    <section className="relative overflow-hidden py-32">
      <div className="container m-auto">
        <div className="magicpattern absolute inset-x-0 top-0 -z-10 flex h-full w-full items-center justify-center opacity-100" />
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="z-10 flex flex-col items-center gap-6 text-center">
            <Image
              src="/freelogo.png"
              alt={t("hero.logoAlt")}
              className="h-16"
              width={64}
              height={64}
            />
            <Badge variant="outline">{t("hero.badge")}</Badge>
            <div>
              <h1 className="mb-6 text-pretty text-2xl font-bold lg:text-5xl">
                {t("hero.title")}
              </h1>
              <p className="text-muted-foreground lg:text-xl">
                {t("hero.description")}
              </p>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button>{t("hero.getStarted")}</Button>
              <Button variant="outline">
                {t("hero.learnMore")} <ExternalLink className="ml-2 h-4" />
              </Button>
            </div>
            <div className="mt-20 flex flex-col items-center gap-4">
              <p className="text-center: text-muted-foreground lg:text-left">
                {t("hero.builtWith")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3"
                  )}
                >
                  <Image
                    src="https://shadcnblocks.com/images/block/logos/shadcn-ui-small.svg"
                    alt={t("hero.techLogos.shadcn")}
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                    width={24}
                    height={24}
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3"
                  )}
                >
                  <Image
                    src="https://shadcnblocks.com/images/block/logos/typescript-small.svg"
                    alt={t("hero.techLogos.typescript")}
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                    width={24}
                    height={24}
                  />
                </a>

                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3"
                  )}
                >
                  <Image
                    src="https://shadcnblocks.com/images/block/logos/react-icon.svg"
                    alt={t("hero.techLogos.react")}
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                    width={24}
                    height={24}
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group px-3"
                  )}
                >
                  <Image
                    src="https://shadcnblocks.com/images/block/logos/tailwind-small.svg"
                    alt={t("hero.techLogos.tailwind")}
                    className="h-4 saturate-0 transition-all group-hover:saturate-100"
                    width={16}
                    height={16}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
