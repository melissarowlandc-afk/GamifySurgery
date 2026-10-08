"""Append meaningful selection/render contracts and update existing pool counts."""
import json
from pathlib import Path

tool = Path(__file__).resolve().parent
repo = tool.parents[2]
batch = tool.name
patient = batch == "patient-gapfill-v6c"
roster = json.loads((tool / "roster.json").read_text(encoding="utf-8"))["identities"]
catalog_path = repo / "packages/game-domain/src/characterStillCatalog.test.ts"
registry_path = repo / "apps/player/src/art/characterStillRegistry.test.ts"
catalog = catalog_path.read_bytes().decode("utf-8")
registry = registry_path.read_bytes().decode("utf-8")

def once(text, old, new):
    assert text.count(old) == 1, old
    return text.replace(old, new)

prior, after = (285, 304) if patient else (304, 318)
old_assets, new_assets = (2310, 2462) if patient else (2462, 2574)
old_cardinals, new_cardinals = (2280, 2432) if patient else (2432, 2544)
catalog = once(catalog, f"covers all {prior} packaged identities", f"covers all {after} packaged identities")
catalog = once(catalog, f"expect(CHARACTER_STILL_CATALOG).toHaveLength({prior});", f"expect(CHARACTER_STILL_CATALOG).toHaveLength({after});")
catalog = once(catalog, f"expect(new Set(CHARACTER_STILL_CATALOG.map((entry) => entry.stillId)).size).toBe({prior});", f"expect(new Set(CHARACTER_STILL_CATALOG.map((entry) => entry.stillId)).size).toBe({after});")
if patient:
    catalog = once(catalog, "expect(PATIENT_CHARACTER_STILLS).toHaveLength(160);", "expect(PATIENT_CHARACTER_STILLS).toHaveLength(179);")
    assert catalog.count("total: 28,") == 2 and catalog.count("total: 22,") == 2
    catalog = catalog.replace("total: 28,", "total: 30,").replace("total: 22,", "total: 24,")
    rows = "\n".join(f'      ["{entry["stableId"]}", "{entry["compatibleSexLabel"]}", {entry["intendedAge"]}],' for entry in roster)
    tests = '''  it("admits the nineteen corrected manager-approved v6c patients only to their exact adult pools", () => {
    const additions = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "patient-gapfill-v6c");
    expect(additions.map(entry => [entry.stillId, entry.compatibleSexLabel, entry.intendedAge])).toEqual([
ROWS
    ]);
    for (const entry of additions) {
      for (const sexLabel of ["Female", "Male"] as const) for (const [ageYears, ageBand] of [
        [18, "young_adult"], [29, "young_adult"], [30, "adult"], [44, "adult"],
        [45, "middle_aged"], [64, "middle_aged"], [65, "older_adult"], [90, "older_adult"],
      ] as const) expect(patientStillEligibleEntries(sexLabel, ageYears).includes(entry)).toBe(entry.compatibleSexLabel === sexLabel && entry.ageBand === ageBand);
      expect(patientStillEligibleEntries(entry.compatibleSexLabel, 17)).not.toContainEqual(entry);
      expect(STAFF_CHARACTER_STILLS.some(staff => staff.stillId === entry.stillId)).toBe(false);
    }
  });

  it("reaches every v6c patient before reuse and preserves occupied, free, LRU and compatible saved IDs", () => {
    for (const profile of [
      { sexLabel: "Female", ageYears: 38, total: 30, added: 2 },
      { sexLabel: "Male", ageYears: 38, total: 24, added: 2 },
      { sexLabel: "Female", ageYears: 70, total: 20, added: 7 },
      { sexLabel: "Male", ageYears: 70, total: 20, added: 8 },
    ] as const) {
      const pool = patientStillEligibleEntries(profile.sexLabel, profile.ageYears);
      expect(pool).toHaveLength(profile.total);
      expect(pool.filter(entry => entry.sourceCohort === "patient-gapfill-v6c")).toHaveLength(profile.added);
      const occupiedStillIds = new Set<string>(), recentlyUsedStillIds: string[] = [];
      for (let index = 0; index < pool.length; index += 1) {
        const selected = selectNewPatientStillId("v6c-pools", `${profile.sexLabel}.${index}`, profile, { occupiedStillIds, recentlyUsedStillIds });
        expect(selected).toBeDefined(); expect(occupiedStillIds.has(selected!)).toBe(false);
        occupiedStillIds.add(selected!); recentlyUsedStillIds.push(selected!);
      }
      expect([...occupiedStillIds].sort()).toEqual(pool.map(entry => entry.stillId).sort());
      expect(selectNewPatientStillId("v6c-pools", "full", profile, { occupiedStillIds, recentlyUsedStillIds })).toBe(recentlyUsedStillIds[0]);
      const recent = recentlyUsedStillIds.at(-1)!; occupiedStillIds.delete(recent);
      expect(selectNewPatientStillId("v6c-pools", "free", profile, { occupiedStillIds, recentlyUsedStillIds })).toBe(recent);
      for (const entry of pool) expect(selectPatientStillId("saved-campaign", "frozen-patient", profile, entry.stillId)).toBe(entry.stillId);
    }
  });

'''.replace("ROWS", rows)
else:
    catalog = once(catalog, "expect(STAFF_CHARACTER_STILLS).toHaveLength(77);", "expect(STAFF_CHARACTER_STILLS).toHaveLength(91);")
    tests = '''  it("admits all fourteen manager-approved v6d staff only to their single assigned role", () => {
    const rolePools = [
      ["staff.imaging_technician", 5], ["staff.phlebotomist", 5],
      ["staff.laboratory_technician", 4], ["staff.surgeon", 4], ["staff.or_nurse", 4],
      ["staff.pharmacist", 4], ["staff.repair_person", 4],
    ] as const;
    const additions = STAFF_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "staff-gapfill-v6d");
    expect(additions).toHaveLength(14);
    const allRoles = [...PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.map(role => role.id), "staff.app", "staff.executive"];
    for (const [index, entry] of additions.entries()) {
      const assignedRole = rolePools[Math.floor(index / 2)]![0];
      expect(entry.stillId).toBe(`staff-gapfill-v6d.${String(index + 1).padStart(3, "0")}`);
      expect(entry.eligibleStaffRoleDefinitionIds).toEqual([assignedRole]);
      for (const role of allRoles) expect(staffStillEligibleEntries(role).includes(entry)).toBe(role === assignedRole);
      expect(patientStillEligibleEntries()).not.toContainEqual(entry);
    }
    for (const [role, size] of rolePools) {
      const pool = staffStillEligibleEntries(role);
      expect(pool).toHaveLength(size);
      expect(pool.filter(entry => entry.sourceCohort === "staff-gapfill-v6d")).toHaveLength(2);
    }
  });

  it("reaches every v6d role look without collisions and never displaces a compatible current employee", () => {
    for (const role of ["staff.imaging_technician", "staff.phlebotomist", "staff.laboratory_technician", "staff.surgeon", "staff.or_nurse", "staff.pharmacist", "staff.repair_person"]) {
      const pool = staffStillEligibleEntries(role), occupied = new Set<string>();
      for (let index = 0; index < pool.length; index += 1) {
        const selected = selectStaffStillId("v6d-hires", `${role}.${index}`, role, undefined, occupied);
        expect(selected).toBeDefined(); expect(occupied.has(selected!)).toBe(false); occupied.add(selected!);
      }
      expect([...occupied].sort()).toEqual(pool.map(entry => entry.stillId).sort());
      expect(selectStaffStillId("v6d-hires", "exhausted", role, undefined, occupied)).toBeUndefined();
      for (const entry of pool) {
        const otherCurrentOrDepartingIds = new Set(STAFF_CHARACTER_STILLS.filter(other => other.stillId !== entry.stillId).map(other => other.stillId));
        expect(selectStaffStillId("saved-campaign", "current-employee", role, entry.stillId, otherCurrentOrDepartingIds)).toBe(entry.stillId);
        const allOccupied = new Set([...otherCurrentOrDepartingIds, entry.stillId]);
        expect(selectStaffStillId("saved-campaign", "new-hire", role, undefined, allOccupied)).toBeUndefined();
      }
      const additions = pool.filter(entry => entry.sourceCohort === "staff-gapfill-v6d");
      const existingEmployees = new Set(pool.filter(entry => entry.sourceCohort !== "staff-gapfill-v6d").map(entry => entry.stillId));
      for (let index = 0; index < additions.length; index += 1) {
        const selected = selectStaffStillId("saved-campaign", `rehire.${index}`, role, undefined, existingEmployees)!;
        expect(additions.some(entry => entry.stillId === selected)).toBe(true); expect(existingEmployees.has(selected)).toBe(false); existingEmployees.add(selected);
      }
    }
  });

'''
marker = '  it("selects all twelve new radiologists without collisions and retains existing saved staff IDs", () => {'
catalog = once(catalog, marker, tests + marker)

registry = once(registry, f"identities: {prior}, cardinalPoses: {old_cardinals}, clipboardPoses: 30, assets: {old_assets}", f"identities: {after}, cardinalPoses: {new_cardinals}, clipboardPoses: 30, assets: {new_assets}")
registry = once(registry, f"expect(entries).toHaveLength({prior});", f"expect(entries).toHaveLength({after});")
registry = once(registry, f"expect(new Set(entries.map((entry) => entry.id)).size).toBe({prior});", f"expect(new Set(entries.map((entry) => entry.id)).size).toBe({after});")
registry = once(registry, f"expect(seatedAssets).toHaveLength({prior * 4});", f"expect(seatedAssets).toHaveLength({after * 4});")
approval_name = "v6cApproval" if patient else "v6dApproval"
registry = once(registry, 'import v6bApproval from "../../../../tools/character-mapping/patient-gapfill-v6b/owner-approval.json";', 'import v6bApproval from "../../../../tools/character-mapping/patient-gapfill-v6b/owner-approval.json";\n' + f'import {approval_name} from "../../../../tools/character-mapping/{batch}/owner-approval.json";')
if patient:
    registry = once(registry, '? "patient-gapfill-v6b"\n                        : "gs026-stills-v1";', '? "patient-gapfill-v6b"\n                        : entry.cohort === "patientGapfillV6c"\n                          ? "patient-gapfill-v6c"\n                          : "gs026-stills-v1";')
else:
    registry = once(registry, '? "patient-gapfill-v6c"\n                          : "gs026-stills-v1";', '? "patient-gapfill-v6c"\n                          : entry.cohort === "staffGapfillV6d"\n                            ? "staff-gapfill-v6d"\n                            : "gs026-stills-v1";')
cohort = "patientGapfillV6c" if patient else "staffGapfillV6d"
number = len(roster)
render_test = f'''  it("renders every accepted {batch} pose with its exact approved hash, URL and authored contact", () => {{
    expect({approval_name}).toMatchObject({{ status: "approved", approvedBy: "GamifySurgery manager (Claude Code)", authorizedBy: "owner" }});
    const entries = getAllCharacterStillEntries().filter(entry => entry.cohort === "{cohort}");
    const designs = {"PATIENT_CHARACTER_STILLS" if patient else "STAFF_CHARACTER_STILLS"}.filter(entry => entry.sourceCohort === "{batch}");
    expect(entries).toHaveLength({number}); expect(designs).toHaveLength({number});
    expect(entries.map(entry => entry.id)).toEqual(designs.map(entry => entry.stillId));
    const acceptedPoses = {approval_name}.acceptedPoses as Record<string, Record<string, string>>;
    const contacts = {approval_name}.acceptedContacts as Record<string, Record<string, number>>;
    const hashes: string[] = [];
    for (const entry of entries) {{
      const number = entry.id.split(".").at(-1)!;
      expect(entry.category).toBe("{"patient-or-general-population" if patient else "employee"}"); expect(entry.clipboard).toBeUndefined();
ROLE_CHECK
      for (const posture of ["stand", "sit"] as const) for (const direction of CHARACTER_STILL_DIRECTIONS) {{
        const asset = getCharacterStill(entry.id, posture, direction)!;
        expect(asset.sha256).toBe(acceptedPoses[number]![`${{posture}}-${{direction}}`]);
        expect(asset.anchors).toMatchObject({{ bodyAxisX: 80, floorY: 287 }});
        if (posture === "sit") expect(asset.anchors).toMatchObject({{ seatContactY: contacts[number]![direction], seatContactStatus: "owner-delegated-manager-approved-authored-contact" }});
        expect(resolveCharacterStillAssetUrl(asset, "/GamifySurgery/")).toBe(`/GamifySurgery/art/characters/{batch}/${{entry.id}}/${{posture}}-${{direction}}.png`);
        hashes.push(asset.sha256);
      }}
    }}
    expect(new Set(hashes).size).toBe({number * 8});
  }});

'''
role_check = '      expect(entry.role).toBeUndefined();' if patient else '      const design = designs.find(design => design.stillId === entry.id)!;\n      expect(entry.eligibleStaffRoleDefinitionIds).toEqual(design.eligibleStaffRoleDefinitionIds); expect(entry.role).toBe(design.eligibleStaffRoleDefinitionIds[0]);'
render_test = render_test.replace("ROLE_CHECK", role_check)
marker = '  it("registers the GS-033 batch with all 160 exact approved pose hashes and authored contacts", () => {'
registry = once(registry, marker, render_test + marker)
for path, text in [(catalog_path, catalog), (registry_path, registry)]:
    newline = "\r\n" if b"\r\n" in path.read_bytes() else "\n"
    # Existing lines stay exact; only normalize the newly inserted LF text to
    # the file's existing convention when it uses CRLF.
    if newline == "\r\n":
        text = text.replace("\r\n", "\n").replace("\n", "\r\n")
    path.write_bytes(text.encode("utf-8"))
print(json.dumps({"status": "PASS", "batch": batch, "testFilesUpdated": [path.relative_to(repo).as_posix() for path in [catalog_path, registry_path]], "addedTests": 3}))
