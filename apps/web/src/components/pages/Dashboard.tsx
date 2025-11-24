import UploadDropzone from "../components/files/UploadDropzone";
import FolderGrid from "../components/folders/FolderGrid";
import FileList from "../components/files/FileList";
import StorageBar from "../components/files/StorageBar";

export default function Dashboard() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <StorageBar />
      <UploadDropzone />
      <FolderGrid />
      <FileList />
    </div>
  );
}
