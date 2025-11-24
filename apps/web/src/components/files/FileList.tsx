import { useEffect, useState } from "react";
import { filesApi } from "../../api/files";
import FileCard from "./FileCard";
import Filters from "../search/Filters";

export default function FileList() {
  const [files, setFiles] = useState<any[]>([]);
  const [params, setParams] = useState({ sort: "createdAt-desc" });

  useEffect(() => {
    filesApi.list(params).then(setFiles);
  }, [params]);

  return (
    <div>
      <Filters onChange={setParams} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {files.map((f) => <FileCard key={f._id} file={f} />)}
      </div>
    </div>
  );
}
