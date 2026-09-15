import { DownloadBookButton } from "./DownloadBookButton";
export function TitleCard({ finale = false }: { finale?: boolean }) {
  return <div className={finale ? "title-card finale-title" : "title-card opening-title"}>
    <p className="title-ornament" aria-hidden="true">✦</p>
    <h1>Hayati</h1>
    <p>A Fairytale of the Two Kingdoms</p>
    <DownloadBookButton />
  </div>;
}
