import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QUESTION_BANK_BATCH2A_REVISIONS } from "@gamify-surgery/clinical-content";
import type { CaseExhibit } from "@gamify-surgery/clinical-content";
import type { ChartView } from "./types";
import { ClinicalImageExhibit } from "./ClinicalImageExhibit";
import { ChartPanel } from "./ChartPanel";
import { MobileChart } from "../mobile/MobileChart";
const images=QUESTION_BANK_BATCH2A_REVISIONS.map(r=>r.question.exhibit).filter((e):e is Extract<CaseExhibit,{kind:"image"}>=>e?.kind==="image");
const callbacks={onClose:()=>{},onSubmitAnswer:()=>{},onFlagQuestion:()=>{},onAcknowledgeTerminalFeedback:()=>{},onToggleSummary:()=>{},onFileChart:()=>{}};
afterEach(()=>vi.unstubAllEnvs());
describe("local clinical image exhibits",()=>{
  it("uses the deployment base and an accessible raw description without displaying the key",()=>{
    vi.stubEnv("BASE_URL","/GamifySurgery/");
    for(const exhibit of images){const markup=renderToStaticMarkup(<ClinicalImageExhibit exhibit={exhibit}/>);
      expect(markup).toContain(`src="/GamifySurgery/${exhibit.assetPath}"`);expect(markup).toContain("alt=");expect(markup).toContain("Image description");
      expect(markup).toContain("max-width:100%");expect(markup).not.toMatch(/achalasia|KEY:|correct answer|javascript:|https?:\/\//i);
      const png=readFileSync(new URL(`../../public/${exhibit.assetPath}`,import.meta.url));
      expect(png.subarray(0,8).toString("hex")).toBe("89504e470d0a1a0a");expect(png.readUInt32BE(16)).toBe(exhibit.width);expect(png.readUInt32BE(20)).toBe(exhibit.height);
    }
  });
  it.each(["desktop","phone"])("renders the same exhibit before the current task on %s",surface=>{
    const exhibit=images[0]!,chart:ChartView={id:"image-chart",patientName:"Fixture Person",patientDetails:"41 Female",statusLabel:"Decision required",presentation:"Fixture presentation.",answerChoices:[],terminalFeedbackNeedsAcknowledgment:false,summaryAvailable:false,summaryVisible:false,canFile:false,readOnly:false,
      decisionSteps:[{id:"step",heading:"Decision",current:true,complete:false,questionPrompt:"Interpret this displayed recording.",answerChoices:[],exhibit}]};
    const markup=renderToStaticMarkup(surface==="desktop"?<ChartPanel chart={chart} {...callbacks}/>:<MobileChart chart={chart} {...callbacks}/>);
    expect(markup.match(/<img /g)).toHaveLength(1);expect(markup.indexOf(exhibit.assetPath)).toBeLessThan(markup.indexOf("Interpret this displayed recording."));
    expect(markup).toContain("Constructed pressure-study schematic");
  });
});
