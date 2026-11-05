import type { CaseExhibit } from "@gamify-surgery/clinical-content";

/** Local authored teaching image; uses the same base path as other public assets. */
export function ClinicalImageExhibit({ exhibit }: { exhibit: Extract<CaseExhibit, { kind: "image" }> }) {
  return <>
    <h4>{exhibit.caption}</h4>
    <img src={`${import.meta.env.BASE_URL}${exhibit.assetPath}`} alt={exhibit.description}
      width={exhibit.width} height={exhibit.height} loading="lazy"
      style={{ display: "block", maxWidth: "100%", height: "auto" }} />
    <details><summary>Image description</summary><p>{exhibit.description}</p></details>
  </>;
}
