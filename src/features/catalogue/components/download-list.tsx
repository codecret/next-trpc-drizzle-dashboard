import { Download as DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { downloads } from "../catalogue";
import "./download-list.css";

export function DownloadList({ ids }: { ids?: string[] }) {
  const t = useTranslations("Website.support");
  const files = ids
    ? downloads.filter((file) => ids.includes(file.id))
    : downloads;
  return (
    <div className="download-list">
      {files.map((file, index) => (
        <a key={file.id} href={file.path} download className="download-card">
          <span className="download-number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="download-card-copy">
            <span className="download-format">PDF</span>
            <h3 lang="en" dir="ltr">
              {file.name}
            </h3>
            <p>{t("procedure")}</p>
          </div>
          <span className="download-action">
            <span>{t("download")}</span>
            <DownloadIcon className="size-4" aria-hidden="true" />
          </span>
        </a>
      ))}
    </div>
  );
}
