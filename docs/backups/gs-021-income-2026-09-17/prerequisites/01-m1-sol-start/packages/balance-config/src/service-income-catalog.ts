export type ServiceIncomeLine = { id: string; kind: "clinical" | "retail" | "remote"; minimumFacilityLevel: 1 | 2 | 3 | 4 | 5; fee: number; requiredCapabilityIds: readonly string[]; eligibleRouteIds: readonly string[]; paymentStage: "resource_completion" | "episode_completion" | "dispense" };

/** Product balance rows; clinical route/provider approval remains authoritative. */
export const SERVICE_INCOME_CATALOG: readonly ServiceIncomeLine[] = [
  { id: "income.ultrasound", kind: "clinical", minimumFacilityLevel: 1, fee: 120, requiredCapabilityIds: ["capability.ultrasound_machine", "capability.staff.imaging_technician"], eligibleRouteIds: ["route.ultrasound.in_house"], paymentStage: "resource_completion" },
  { id: "income.xray", kind: "clinical", minimumFacilityLevel: 2, fee: 90, requiredCapabilityIds: ["capability.xray_machine", "capability.staff.imaging_technician"], eligibleRouteIds: ["route.xray.in_house"], paymentStage: "resource_completion" },
  { id: "income.ct", kind: "clinical", minimumFacilityLevel: 2, fee: 180, requiredCapabilityIds: ["capability.ct_scanner", "capability.staff.imaging_technician"], eligibleRouteIds: ["route.ct.in_house"], paymentStage: "resource_completion" },
  { id: "income.collection", kind: "clinical", minimumFacilityLevel: 2, fee: 50, requiredCapabilityIds: ["capability.phlebotomy_collection", "capability.staff.phlebotomist"], eligibleRouteIds: ["route.basic_labs.phlebotomy_sendout"], paymentStage: "resource_completion" },
  { id: "income.bladder_scan", kind: "clinical", minimumFacilityLevel: 1, fee: 20, requiredCapabilityIds: ["capability.ultrasound_machine"], eligibleRouteIds: ["route.bladder_scan.ultrasound_room"], paymentStage: "resource_completion" },
  { id: "income.endoscopy", kind: "clinical", minimumFacilityLevel: 2, fee: 400, requiredCapabilityIds: ["capability.endoscopy", "capability.periop_recovery"], eligibleRouteIds: ["route.endoscopy.in_house"], paymentStage: "episode_completion" },
  { id: "income.advanced_endoscopy", kind: "clinical", minimumFacilityLevel: 2, fee: 550, requiredCapabilityIds: ["capability.endoscopy", "capability.periop_recovery"], eligibleRouteIds: ["route.endoscopy.eus-ercp-sampling.in_house"], paymentStage: "episode_completion" },
  { id: "income.glp1_telehealth", kind: "remote", minimumFacilityLevel: 2, fee: 50, requiredCapabilityIds: ["capability.glp1_telehealth", "capability.staff.glp1_np"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.laboratory_processing", kind: "clinical", minimumFacilityLevel: 3, fee: 80, requiredCapabilityIds: ["capability.in_house_laboratory", "capability.staff.laboratory_technician"], eligibleRouteIds: [], paymentStage: "resource_completion" },
  { id: "income.ambulatory_operation", kind: "clinical", minimumFacilityLevel: 3, fee: 900, requiredCapabilityIds: ["capability.ambulatory_or", "capability.staff.or_nurse"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.ambulatory_operation_extended", kind: "clinical", minimumFacilityLevel: 3, fee: 1300, requiredCapabilityIds: ["capability.ambulatory_or", "capability.staff.or_nurse"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.pharmacy_pickup", kind: "retail", minimumFacilityLevel: 3, fee: 25, requiredCapabilityIds: ["capability.pharmacy", "capability.staff.pharmacist"], eligibleRouteIds: [], paymentStage: "dispense" },
  { id: "income.mri", kind: "clinical", minimumFacilityLevel: 4, fee: 240, requiredCapabilityIds: ["capability.mri_machine", "capability.staff.imaging_technician"], eligibleRouteIds: [], paymentStage: "resource_completion" },
  { id: "income.image_read", kind: "remote", minimumFacilityLevel: 4, fee: 40, requiredCapabilityIds: ["capability.radiology_reading", "capability.staff.radiologist"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.app_consult", kind: "clinical", minimumFacilityLevel: 4, fee: 80, requiredCapabilityIds: ["capability.staff.app"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.pediatric_consult", kind: "clinical", minimumFacilityLevel: 4, fee: 80, requiredCapabilityIds: ["capability.pediatric_examination", "capability.staff.app"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.wound_care", kind: "clinical", minimumFacilityLevel: 4, fee: 60, requiredCapabilityIds: ["capability.wound_ostomy_clinic"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.wound_procedure", kind: "clinical", minimumFacilityLevel: 4, fee: 120, requiredCapabilityIds: ["capability.wound_ostomy_clinic"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.ostomy_support", kind: "clinical", minimumFacilityLevel: 4, fee: 75, requiredCapabilityIds: ["capability.wound_ostomy_clinic"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.followup_independent", kind: "clinical", minimumFacilityLevel: 1, fee: 40, requiredCapabilityIds: ["capability.examination"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.minor_procedure_simple", kind: "clinical", minimumFacilityLevel: 1, fee: 100, requiredCapabilityIds: ["capability.minor_procedure"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.minor_procedure_sampling", kind: "clinical", minimumFacilityLevel: 1, fee: 150, requiredCapabilityIds: ["capability.minor_procedure"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.minor_procedure_complex", kind: "clinical", minimumFacilityLevel: 1, fee: 200, requiredCapabilityIds: ["capability.minor_procedure"], eligibleRouteIds: [], paymentStage: "episode_completion" },
  { id: "income.coffee", kind: "retail", minimumFacilityLevel: 2, fee: 5, requiredCapabilityIds: ["capability.coffee_kiosk"], eligibleRouteIds: [], paymentStage: "dispense" },
  { id: "income.kiosk_drink", kind: "retail", minimumFacilityLevel: 2, fee: 3, requiredCapabilityIds: ["capability.coffee_kiosk"], eligibleRouteIds: [], paymentStage: "dispense" },
  { id: "income.kiosk_snack", kind: "retail", minimumFacilityLevel: 2, fee: 4, requiredCapabilityIds: ["capability.coffee_kiosk"], eligibleRouteIds: [], paymentStage: "dispense" },
  { id: "income.vending_drink", kind: "retail", minimumFacilityLevel: 3, fee: 3, requiredCapabilityIds: ["capability.vending"], eligibleRouteIds: [], paymentStage: "dispense" },
  { id: "income.vending_snack", kind: "retail", minimumFacilityLevel: 3, fee: 4, requiredCapabilityIds: ["capability.vending"], eligibleRouteIds: [], paymentStage: "dispense" },
  { id: "income.gift_shop", kind: "retail", minimumFacilityLevel: 5, fee: 15, requiredCapabilityIds: ["capability.gift_shop"], eligibleRouteIds: [], paymentStage: "dispense" },
  { id: "income.gift_shop_premium", kind: "retail", minimumFacilityLevel: 5, fee: 25, requiredCapabilityIds: ["capability.gift_shop"], eligibleRouteIds: [], paymentStage: "dispense" },
  { id: "income.otc_supply", kind: "retail", minimumFacilityLevel: 3, fee: 12, requiredCapabilityIds: ["capability.pharmacy"], eligibleRouteIds: [], paymentStage: "dispense" },
  { id: "income.wound_supply", kind: "retail", minimumFacilityLevel: 4, fee: 20, requiredCapabilityIds: ["capability.wound_ostomy_clinic"], eligibleRouteIds: [], paymentStage: "dispense" },
];

export function getServiceIncomeForRoute(routeId: string): ServiceIncomeLine | null { return SERVICE_INCOME_CATALOG.find((line) => line.eligibleRouteIds.includes(routeId)) ?? null; }
