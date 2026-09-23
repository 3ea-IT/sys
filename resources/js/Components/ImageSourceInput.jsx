import { useEffect, useState } from "react";

/**
 * Lets the admin either paste an image URL or upload an image file.
 * The URL is stored in `data[urlField]`, the file in `data[fileField]`.
 */
export default function ImageSourceInput({
  data,
  setData,
  errors = {},
  urlField = "image",
  fileField = "image_file",
  label = "Image",
}) {
  const [mode, setMode] = useState("url");
  const [filePreview, setFilePreview] = useState(null);
  const [previewFailed, setPreviewFailed] = useState(false);

  const file = data[fileField];
  const url = (data[urlField] || "").trim();

  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const preview = mode === "upload" ? filePreview : url;

  useEffect(() => setPreviewFailed(false), [preview]);

  const switchMode = (next) => {
    setMode(next);
    // Only one source is sent: clear the pending upload when going back to URL
    if (next === "url") setData(fileField, null);
  };

  const tabClass = (active) =>
    `px-3 py-1.5 text-sm rounded-md font-medium transition ${
      active
        ? "bg-brand-primary text-white"
        : "text-brand-primary dark:text-gray-300 hover:bg-brand-background dark:hover:bg-gray-700"
    }`;

  return (
    <div className="md:col-span-2">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-brand-primary dark:text-gray-200">{label}</label>
        <div className="inline-flex gap-1 p-1 border border-brand-border dark:border-gray-600 rounded-lg">
          <button type="button" onClick={() => switchMode("url")} className={tabClass(mode === "url")}>
            Image URL
          </button>
          <button type="button" onClick={() => switchMode("upload")} className={tabClass(mode === "upload")}>
            Upload Image
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          {mode === "url" ? (
            <>
              <input
                type="text"
                value={data[urlField]}
                onChange={(e) => setData(urlField, e.target.value)}
                placeholder="https://example.com/temple.jpg or /banner/temple.jpg"
                className="w-full px-4 py-2 border border-brand-border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-brand-secondary dark:text-gray-400">
                Paste the full link including https://
              </p>
            </>
          ) : (
            <>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => setData(fileField, e.target.files[0] || null)}
                className="w-full text-sm text-brand-primary dark:text-gray-300 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-brand-primary file:text-white hover:file:opacity-90"
              />
              <p className="mt-1 text-xs text-brand-secondary dark:text-gray-400">
                JPG, PNG, GIF or WEBP, up to 5MB
              </p>
            </>
          )}
          {errors[urlField] && <p className="mt-1 text-red-600 text-sm">{errors[urlField]}</p>}
          {errors[fileField] && <p className="mt-1 text-red-600 text-sm">{errors[fileField]}</p>}
        </div>

        {preview && (
          <div className="w-full sm:w-40 h-28 rounded-lg overflow-hidden border border-brand-border dark:border-gray-600 bg-brand-background dark:bg-gray-700 flex items-center justify-center">
            {previewFailed ? (
              <span className="text-xs text-red-600 px-2 text-center">Image could not be loaded</span>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setPreviewFailed(true)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
