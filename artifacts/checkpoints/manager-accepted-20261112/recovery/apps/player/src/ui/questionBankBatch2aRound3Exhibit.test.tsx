import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QUESTION_BANK_BATCH2A_ROUND3_REVISIONS } from "@gamify-surgery/clinical-content";
import { ClinicalImageExhibit } from "./ClinicalImageExhibit";
import { ChartPanel } from "./ChartPanel";
import { MobileChart } from "../mobile/MobileChart";
import type { ChartView } from "./types";
const exhibit=QUESTION_BANK_BATCH2A_ROUND3_REVISIONS.find(r=>r.auditId==='B2A04')!.question.exhibit!;
if(exhibit.kind!=='image')throw new Error('Round-three image required');
const callbacks={onClose:()=>{},onSubmitAnswer:()=>{},onFlagQuestion:()=>{},onAcknowledgeTerminalFeedback:()=>{},onToggleSummary:()=>{},onFileChart:()=>{}};
afterEach(()=>vi.unstubAllEnvs());
describe('round-three pressure exhibit',()=>{
  it('uses the actual portrait asset with equivalent observations and safe deployment path',()=>{
    vi.stubEnv('BASE_URL','/GamifySurgery/');
    const markup=renderToStaticMarkup(<ClinicalImageExhibit exhibit={exhibit}/>);
    expect(markup).toContain('src="/GamifySurgery/clinical-exhibits/batch2a-r3-b04-pressure.png"');
    expect(markup).toContain('Image description');expect(markup).toContain('software DCI bars');
    expect(markup).not.toMatch(/reduced reserve|preserved junction|KEY:|correct answer|peak height cannot/i);
    const bytes=readFileSync(new URL('../../public/'+exhibit.assetPath,import.meta.url));
    expect(bytes.readUInt32BE(16)).toBe(760);expect(bytes.readUInt32BE(20)).toBe(1220);
  });
  it.each(['desktop','phone'])('places the new picture before the report task on %s',surface=>{
    const chart:ChartView={id:'r3-picture',patientName:'Jamie Taylor',patientDetails:'34 Female',statusLabel:'Decision required',presentation:'Pressure-study review.',answerChoices:[],terminalFeedbackNeedsAcknowledgment:false,summaryAvailable:false,summaryVisible:false,canFile:false,readOnly:false,decisionSteps:[{id:'report',heading:'Decision',current:true,complete:false,questionPrompt:'Choose the pressure-study report.',answerChoices:[],exhibit}]};
    const markup=renderToStaticMarkup(surface==='desktop'?<ChartPanel chart={chart} {...callbacks}/>:<MobileChart chart={chart} {...callbacks}/>);
    expect(markup.match(/<img /g)).toHaveLength(1);expect(markup.indexOf(exhibit.assetPath)).toBeLessThan(markup.indexOf('Choose the pressure-study report.'));expect(markup).toContain('max-width:100%');
  });
});
