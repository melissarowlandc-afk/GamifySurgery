import { describe, expect, it, vi } from "vitest";
import { SupabaseCloudTransport } from "./supabaseTransport";

describe("campaign deletion RPC contract", () => {
  it("sends only protocol, campaign identity and the explicitly confirmed revision", async () => {
    const rpc = vi.fn(async () => ({ data: { campaignId: "campaign-a", deleted: true }, error: null }));
    const transport = new SupabaseCloudTransport({ rpc }, "account-a", async () => "account-a");
    await transport.deleteCampaign({ campaignId: "campaign-a", expectedRevision: "7" });
    expect(rpc).toHaveBeenCalledExactlyOnceWith("beta2_cloud_delete_campaign", { p_protocol: 3, p_campaign_id: "campaign-a", p_expected_revision: "7" });
  });
  it.each([{ campaignId: "different", deleted: true }, { campaignId: "campaign-a", deleted: false }, null])("rejects an unconfirmed or mismatched deletion acknowledgement", async data => {
    const transport = new SupabaseCloudTransport({ rpc: async () => ({ data, error: null }) }, "account-a", async () => "account-a");
    await expect(transport.deleteCampaign({ campaignId: "campaign-a", expectedRevision: "1" })).rejects.toMatchObject({ code: "corrupt" });
  });
  it.each([["55000", "Cloud campaign open on another device", "writer"], ["40001", "Cloud revision conflict", "revision"]])("maps %s deletion refusal to %s", async (code, message, state) => {
    const transport = new SupabaseCloudTransport({ rpc: async () => ({ data: null, error: { code, message } }) }, "account-a", async () => "account-a");
    await expect(transport.deleteCampaign({ campaignId: "campaign-a", expectedRevision: "1" })).rejects.toMatchObject({ code: state });
  });
  it("fences a switched account before sending or accepting deletion", async () => {
    let current = "account-b";
    const rpc = vi.fn(async () => { current = "account-b"; return { data: { campaignId: "campaign-a", deleted: true }, error: null }; });
    const transport = new SupabaseCloudTransport({ rpc }, "account-a", async () => current);
    await expect(transport.deleteCampaign({ campaignId: "campaign-a", expectedRevision: "1" })).rejects.toMatchObject({ code: "auth" }); expect(rpc).not.toHaveBeenCalled();
    current = "account-a";
    await expect(transport.deleteCampaign({ campaignId: "campaign-a", expectedRevision: "1" })).rejects.toMatchObject({ code: "auth" }); expect(rpc).toHaveBeenCalledOnce();
  });
});
