import { Download as DownloadIcon, FileText } from "lucide-react";
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
      {files.map((file) => (
        <a key={file.id} href={file.path} download className="download-card">
          <FileText className="download-file-icon" aria-hidden="true" />
          <div className="download-card-copy">
            <span className="download-format">PDF</span>
            <h3 lang="en">{file.name}</h3>
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
