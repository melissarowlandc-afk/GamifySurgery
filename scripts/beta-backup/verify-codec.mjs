/** Owner-PC verification of opaque backup/export rows with the ACTUAL client
 * adapter and hydrator. No fetch, browser, game command or persistence write. */
export async function verifyCampaignCodec(bundle) {
  await import('../../tools/economy-audit/source-loader.mjs');
  const { SupabaseCloudTransport } = await import('../../apps/player/src/session/cloud/supabaseTransport.ts');
  const { loadCloudEvidenceCheckpoint } = await import('../../apps/player/src/session/cloud/codecEvidence.ts');
  const pack = row => ({ encoding: 'gzip', dataBase64: Buffer.from(row.content.slice(2), 'hex').toString('base64'),
    compressedBytes: (row.content.length - 2) / 2, compressedSha256: row.compressed_sha256,
    uncompressedBytes: row.uncompressed_bytes, uncompressedSha256: row.uncompressed_sha256 });
  const results = [];
  for (const snapshot of bundle.snapshots) {
    const prefix = bundle.pages.filter(p => p.first_record + p.record_count <= snapshot.evidence_high_water && BigInt(p.accepted_revision) <= BigInt(snapshot.revision));
    const payload = { revision: snapshot.revision, writerGeneration: bundle.campaign.writer_generation, acceptedAt: snapshot.accepted_at,
      snapshot: pack(snapshot), evidence: { header: pack(bundle.header), pages: prefix.map(p => ({ firstRecord: p.first_record, recordCount: p.record_count, content: pack(p) })) } };
    const client = { async rpc(name, args) {
      if (name !== 'beta2_cloud_load' || args.p_campaign_id !== bundle.campaign.campaign_id || args.p_revision !== snapshot.revision) throw new Error('Unexpected verification route');
      return { data: payload, error: null };
    } };
    const transport = new SupabaseCloudTransport(client, bundle.ownerId, async () => bundle.ownerId);
    const confirmed = await transport.load(bundle.campaign.campaign_id, snapshot.revision);
    const hydrated = await loadCloudEvidenceCheckpoint({ snapshot: confirmed.snapshot, evidence: confirmed.evidence,
      revision: confirmed.revision, expectedRevision: snapshot.revision, expectedCampaignId: bundle.campaign.campaign_id, expectedBaselineId: confirmed.baselineId });
    if (snapshot.revision === bundle.campaign.current_revision && (hydrated.campaign.name !== bundle.campaign.name || hydrated.campaign.status !== bundle.campaign.status)) throw new Error('Verified head summary differs');
    results.push({ revision: confirmed.revision, evidenceHighWater: confirmed.evidence.records.length });
  }
  return results;
}
