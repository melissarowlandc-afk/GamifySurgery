import type { VariantSpec } from "./family-builder";
export type VariantRow = {
 slug:string; complaint:string; presentation:string; stem:string;
 correct:[string,string]; wrong:[[string,string,{timingProfileId:string;serviceId?:string}?],[string,string,{timingProfileId:string;serviceId?:string}?],[string,string,{timingProfileId:string;serviceId?:string}?]];
 explanation:string; claims:string[]; acuity?:"stable"|"urgent";
 ageYears?:readonly number[]; sexLabels?:readonly ("Female"|"Male"|"Not specified")[];
 prototypeVitalSigns?:{heartRateBpm:number;systolicBloodPressureMmHg:number;diastolicBloodPressureMmHg:number;temperatureF:number;oxygenSaturationPercent:number};
 test?:{timingProfileId:string;serviceId?:string;gate?:{serviceId:string;pendingLabel:string;resultNarrative:string;routeIds:string[]}};
};
export const variants=(rows:[VariantRow,VariantRow,VariantRow,VariantRow]):[VariantSpec,VariantSpec,VariantSpec,VariantSpec]=>rows.map((r,i)=>({
 slug:r.slug,complaint:r.complaint,presentation:r.presentation,stem:r.stem,
 correct:{id:`correct_${i+1}`,label:r.correct[0],rationale:r.correct[1],...(r.test?{test:{timingProfileId:r.test.timingProfileId,...(r.test.serviceId?{serviceId:r.test.serviceId}:{})}}:{})},
 distractors:r.wrong.map((w,j)=>({id:`d${j+1}_${i+1}`,label:w[0],rationale:w[1],...(w[2]?{test:w[2]}:{})})) as VariantSpec["distractors"],
 explanation:r.explanation,claimIds:r.claims,...(r.acuity?{acuity:r.acuity}:{}),...(r.ageYears?{ageYears:r.ageYears}:{}),...(r.sexLabels?{sexLabels:r.sexLabels}:{}),...(r.prototypeVitalSigns?{prototypeVitalSigns:r.prototypeVitalSigns}:r.acuity==="urgent"?{prototypeVitalSigns:{heartRateBpm:108,systolicBloodPressureMmHg:108,diastolicBloodPressureMmHg:68,temperatureF:99.1,oxygenSaturationPercent:97}}:{}),
 ...(r.test?.gate?{gate:{id:`gate.gs028d.${r.slug}`,serviceId:r.test.gate.serviceId,pendingLabel:r.test.gate.pendingLabel,resultNarrative:r.test.gate.resultNarrative,routeIds:r.test.gate.routeIds}}:{})
})) as [VariantSpec,VariantSpec,VariantSpec,VariantSpec];
