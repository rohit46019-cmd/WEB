import { useEffect, useState } from "react";
import { notesApi } from "../../api/notes";

export default function NoteEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string>("");

  useEffect(() => {
    const i = setInterval(() => {
      if (title || content) notesApi.create({ title, content, tags: tags.split(",").map(t => t.trim()).filter(Boolean) });
    }, 3000);
    return () => clearInterval(i);
  }, [title, content, tags]);

  return (
    <div className="glass" style={{ padding: 12 }}>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Write..." value={content} onChange={(e) => setContent(e.target.value)} style={{ minHeight: 160 }} />
      <input placeholder="tags comma separated" value={tags} onChange={(e) => setTags(e.target.value)} />
    </div>
  );
}
