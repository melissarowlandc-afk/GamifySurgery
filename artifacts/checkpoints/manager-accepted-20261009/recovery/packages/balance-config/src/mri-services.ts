/** M0's ordinary adult scanner scope. Exact service IDs, never label matching.
 * Timings and fees are editorial game values pending review, not clinical facts.
 * Specialized, repeat, combined, pediatric and sedation protocols stay external.
 */
export const MRI_SERVICE_CONTRACTS = [
  { serviceId: "service.mri", onsite: "route.mri.in_house", outsourced: "route.mri.outsourced", displayName: "MRI" },
  { serviceId: "service.mrcp", onsite: "route.mrcp.in_house", outsourced: "route.mrcp.outsourced", displayName: "MRI/MRCP" },
  { serviceId: "service.extremity_mri", onsite: "route.extremity_mri.in_house", outsourced: "route.extremity_mri.outsourced", displayName: "Extremity MRI" },
] as const;

export const MRI_ACQUISITION_MINUTES = 60;

export function mriServiceContract(serviceId: string) {
  return MRI_SERVICE_CONTRACTS.find(contract => contract.serviceId === serviceId);
}

export function mriOnsiteRoute(serviceId: typeof MRI_SERVICE_CONTRACTS[number]["serviceId"]) {
  const contract = mriServiceContract(serviceId)!;
  return {
    id: contract.onsite, displayName: `Onsite ${contract.displayName}`,
    durationTicks: MRI_ACQUISITION_MINUTES + 30,
    requiredCapabilityId: "capability.mri_machine", requiredCapabilityIds: ["capability.staff.imaging_technician"],
    resourceRequirements: [{ roomDefinitionId: "room.mri", staffRoleDefinitionId: "staff.imaging_technician" }],
    timingPhases: [
      { id: "phase.mri.acquisition", durationTicks: MRI_ACQUISITION_MINUTES, resourceBound: true },
      { id: "phase.mri.external_interpretation", durationTicks: 30, resourceBound: false },
    ],
    preference: 0,
    patientTravel: { originRoomDefinitionId: "room.examination", destinationRoomDefinitionId: "room.mri", roundTrip: true as const },
  };
}
