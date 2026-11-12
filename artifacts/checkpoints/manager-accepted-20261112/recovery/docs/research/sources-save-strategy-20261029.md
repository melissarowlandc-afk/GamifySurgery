# Save-strategy source register — 2026-10-29

Companion: [Findings and recommendation](save-strategy-20261029.md). All external sources below were accessed **2026-10-29** using read-only web research. Publication dates are distinguished from access dates; **n.d.** means the retrieved page did not establish a publication year. A live branch or reference page is an observation at access time, not a permanently pinned version.

This register contains bibliographic metadata and original assessments, not source excerpts or a copied corpus. Unless a more specific license is stated, reuse permission was **not established**: use is limited here to factual verification, independent summaries and links. Platform documentation describes that platform, not Safari behavior. No source establishes the cause of the owner's live freeze. There are no new clinical claims in these documents.

## Games

### SS01 — Project Hospital: autosave timing and pause

- **Citation / year:** jirka_oxymoron, Oxymoron Games. “Patches, Hotfixes, and News,” Project Hospital 1.2.21996, Patch 34, developer post, December 9, **2020**, in the official Steam discussion thread.
- **URL:** [Developer patch record](https://steamcommunity.com/app/868360/discussions/0/2261313417704798219/?ctp=2).
- **Access:** 2026-10-29. **Type:** first-party release notes / developer forum post.
- **Use / reliability:** Direct evidence of saves at two in-game shift boundaries and a visible pause notification. Historical version evidence; not proof of current defaults, cloud timing, or an acceptable PWA stall duration.
- **Reuse:** Copyrighted publisher/developer material; factual summary and link only.

### SS02 — Project Hospital: rotating autosaves

- **Citation / year:** Oxymoron Games. “Project Hospital — Patch 7,” version 1.0.14611, November 23, **2018**, official Steam announcements archive.
- **URL:** [Official announcements containing Patch 7](https://store.steampowered.com/news/posts/?appids=868360&enddate=1544545485&feed=steam_community_announcements).
- **Access:** 2026-10-29. **Type:** first-party patch notes.
- **Use / reliability:** Historical evidence of alternating autosave files. Does not establish current retention or conflict behavior.
- **Reuse:** Copyrighted; factual summary and link only.

### SS03 — Two Point Hospital: device save files

- **Citation / year:** SEGA Support. “Save Location,” updated February 19, **2019**.
- **URL:** [SEGA save-location support](https://support.sega.com/hc/en-gb/articles/360000315538-Save-Location).
- **Access:** 2026-10-29. **Type:** official publisher support.
- **Use / reliability:** Establishes local save directories on desktop operating systems. A directory named Cloud does not establish upload cadence or implementation. No sufficiently strong first-party cadence evidence was recovered in this research.
- **Reuse:** Copyrighted; metadata and factual summary only.

### SS04 — Factorio: asynchronous saving and remaining freezes

- **Citation / year:** Klonan and raiguard, Wube Software. “Friday Facts #408 — Statistics improvements, Linux adventures,” April 26, **2024**, subsection on asynchronous saving.
- **URL:** [Wube engineering article](https://www.factorio.com/blog/post/fff-408).
- **Access:** 2026-10-29. **Type:** first-party studio engineering blog.
- **Use / reliability:** Strong architectural explanation of platform-specific background saving and its memory/troubleshooting trade-offs. Not evidence that this mechanism exists in browsers, or that current Factorio releases retain all historical limitations.
- **Reuse:** Copyrighted; independently summarized, no code or prose reproduced.

### SS05 — Factorio: server save cadence

- **Citation / year:** Wube Software. `factorio-data/server-settings.example.json`, master branch, **n.d.**, retrieved current branch.
- **URL:** [Official example server settings](https://github.com/wube/factorio-data/blob/master/server-settings.example.json).
- **Access:** 2026-10-29. **Type:** first-party published source/configuration.
- **Use / reliability:** Direct evidence of a ten-minute example server interval and five rotating server slots. These are server example values, not a claim about every single-player build. Read through the website; no Git operation was used.
- **Reuse:** Repository license not checked; settings facts and link only, no copied implementation.

### SS06 — Stardew Valley: mobile save layers

- **Citation / year:** Stardew Valley Wiki contributors. “Mobile Saves,” **n.d.**, living manual on the game's wiki domain.
- **URL:** [Mobile Saves](https://wiki.stardewvalley.net/Mobile_Saves).
- **Access:** 2026-10-29. **Type:** game-hosted community documentation.
- **Use / reliability:** Useful documented gameplay behavior: overnight standard save, mobile emergency save, manual backup and previous-save recovery. Lower authority than a studio engineering description; platform/version differences remain. Native mobile behavior cannot establish a WebKit execution guarantee.
- **Reuse:** Page-specific license not verified; no wiki wording or illustrations copied.

### SS07 — OpenTTD: current save controls

- **Citation / year:** OpenTTD contributors. “GUISettings Struct Reference,” generated source documentation, **2026**, displayed source build `20260917-master-gec444f7315`.
- **URL:** [GUISettings reference](https://docs.openttd.org/source/d6/d4b/structGUISettings).
- **Access:** 2026-10-29. **Type:** project-owned generated source reference.
- **Use / reliability:** Current evidence of configurable autosave interval, retention, exit/disconnect options and threaded saves. Field existence does not prove a default or that all serialization is off-thread. The archived monthly-autosave wiki was not treated as current defaults.
- **Reuse:** Underlying repository/documentation license not independently checked; facts and link only.

### SS08 — Cities: Skylines: manual save convention

- **Citation / year:** Colossal Order / Paradox Interactive. *Cities: Skylines User Manual*, Pause Menu, printed pages 10–11, **n.d.** (original-game manual).
- **URL:** [Publisher-distributed manual](https://cdn.akamai.steamstatic.com/steam/apps/255710/manuals/CitiesSkylines-UserManual_EN.pdf).
- **Access:** 2026-10-29. **Type:** first-party game manual hosted with the Steam product.
- **Use / reliability:** Evidence for pausing to reach a manual save panel and named saves. Not evidence for Cities: Skylines II defaults, cloud intervals, or save performance.
- **Reuse:** Copyrighted manual; saving behavior independently summarized; no pages, tables or images stored.

### SS09 — Trimps: distinct local and cloud schedules

- **Citation / year:** Zach Hood / GreenSatellite and Trimps contributors. `Trimps.github.io/main.js`, master branch, **n.d.**; file carries a 2019 copyright notice. Relevant functions: `autoSave`, `save`, `playFabSaveCheckCallback`, `saveToPlayFabCallback`.
- **URL:** [Official source](https://github.com/Trimps/Trimps.github.io/blob/master/main.js); [readable raw source](https://raw.githubusercontent.com/Trimps/Trimps.github.io/refs/heads/master/main.js).
- **Access:** 2026-10-29. **Type:** first-party browser-game implementation.
- **Use / reliability:** Direct static-code evidence of local scheduling, conditional cloud throttling, backup status and conflict prompting. No game was executed; runtime versions/settings/hosting can differ. This is a concrete comparison, not a recommended storage implementation to copy.
- **Reuse:** File declares GPL-3.0-or-later. No code copied into these documents or the game.

### SS10 — Melvor Idle: offline client and local saves

- **Citation / year:** Melvor Idle publisher/development team. “Offline Client Public Beta now available on Steam & Mobile,” **n.d.**
- **URL:** [Official client announcement and FAQ](https://news.melvoridle.com/offline-client-public-beta-now-available-on-steam-mobile/).
- **Access:** 2026-10-29. **Type:** first-party product announcement / support FAQ.
- **Use / reliability:** Establishes local resources/data by default and internet-dependent cloud functions in the described beta. Does not document local/cloud timer values. Dates inferred from search indexing were not used as publication dates.
- **Reuse:** Copyrighted; brief factual synthesis and link only.

### SS11 — Melvor Idle 2: automatic cloud backup and export

- **Citation / year:** Malcs, Melvor Idle. “Melvor Idle 2: A RuneScape Adventure releases 17 November 2026 into Steam Early Access (+ Next Fest Roundup),” **2026**.
- **URL:** [Official sequel announcement](https://news.melvoridle.com/melvor-idle-2-a-runescape-adventure-releases-17-november-2026-into-steam-early-access-next-fest-roundup/).
- **Access:** 2026-10-29. **Type:** first-party product announcement.
- **Use / reliability:** Describes automatic cloud saving and a manual local save-string backup for the demo/sequel. Does not supply sync cadence or performance measurements. Kept distinct from original Melvor Idle behavior.
- **Reuse:** Copyrighted; factual summary and link only.

### SS12 — Tiny Tower: explicit backup enrollment and device transfer

- **Citation / year:** NimbleBit Support. “Cloud Backup, Syncing and Restoring a Lost Tower FAQ,” modified February 25, **2025**.
- **URL:** [Official Tiny Tower FAQ](https://support.nimblebit.com/support/solutions/articles/150000013061-cloud-backup-syncing-and-restoring-a-lost-tower-faq).
- **Access:** 2026-10-29. **Type:** first-party mobile management-game support.
- **Use / reliability:** Establishes cloud registration, secondary-device confirmation and recovery workflow. Does not disclose background upload timer, conflict algorithm or CPU costs; no such details were inferred.
- **Reuse:** Copyrighted; factual summary and link only.

## Platform save systems

### SS13 — Apple GameKit / iCloud saved games

- **Citation / year:** Apple Developer Documentation. “Saving the player's game data to an iCloud account,” **n.d.**
- **URL:** [GameKit saved-game guidance](https://developer.apple.com/documentation/gamekit/saving-the-player-s-game-data-to-an-icloud-account).
- **Access:** 2026-10-29. **Type:** official native platform documentation.
- **Use / reliability:** Explains developer-chosen saves, size reduction, iCloud requirements and conflicting-file handling. The research tool exposed indexed documentation content; the direct HTML route was a JavaScript shell and its Markdown link was unsupported by the tool. No exact autosave interval is specified. Not a browser API.
- **Reuse:** Apple copyrighted documentation; independent factual summary only.

### SS14 — Google Play Games cloud-save concepts

- **Citation / year:** Google / Android Developers. “Cloud save,” Saved Games concepts, **n.d.**, living platform guidance.
- **URL:** [Cloud save and offline support](https://developer.android.com/games/pgs/savedgames).
- **Access:** 2026-10-29. **Type:** official platform documentation; older developers.google.com URL redirects here.
- **Use / reliability:** Documents offline local read/write, later asynchronous synchronization, cross-device loading and conflict policy. Gives reasonable-frequency guidance, not a universal timer. Native service behavior cannot be assumed for Supabase or a PWA.
- **Reuse:** Google developer content-license terms apply; no code reproduced.

### SS15 — Google Play Games conflict implementation

- **Citation / year:** Google / Android Developers. “Saved games for Android games,” updated October 6, **2026**, conflict-handling section.
- **URL:** [Android saved-games integration](https://developer.android.com/games/pgs/android/saved-games).
- **Access:** 2026-10-29. **Type:** official SDK implementation guidance.
- **Use / reliability:** Confirms access to competing versions and developer choice/merge/user-choice strategies. Example most-recent selection is not a general correctness guarantee for campaign histories.
- **Reuse:** Google developer content-license terms apply; examples not copied.

### SS16 — Steam Cloud and Dynamic Cloud Sync

- **Citation / year:** Valve. “Steam Cloud,” Steamworks Documentation, **n.d.**, living documentation, including Notes and Best Practices and Dynamic Cloud Sync.
- **URL:** [Steam Cloud](https://partner.steamgames.com/doc/features/cloud).
- **Access:** 2026-10-29. **Type:** official developer platform documentation.
- **Use / reliability:** Authoritative for ordinary session-boundary synchronization, optional suspend/resume integration and splitting frequently/infrequently changed files. Steam's client can operate beyond a game's lifecycle; Safari cannot inherit that guarantee.
- **Reuse:** Copyrighted developer documentation; short original summary only.

### SS17 — Xbox Game Saves synchronization

- **Citation / year:** Microsoft. “Understanding the Game Saves sync flow,” Microsoft Game Development Kit, GDK 2604 view, updated January 26, **2026**.
- **URL:** [Game Saves sync flow](https://learn.microsoft.com/en-us/gaming/gdk/docs/features/common/game-save/game-saves-syncing?view=gdk-2604).
- **Access:** 2026-10-29. **Type:** official public developer documentation.
- **Use / reliability:** Distinguishes local gameplay writes, periodic cloud synchronization, session-end synchronization and offline/lock handling. API/platform-specific behavior, including its thirty-minute policy, is not a PWA recommendation or a universal console rule.
- **Reuse:** Documentation license not separately verified; factual summary only.

### SS18 — PlayStation cloud-save synchronization

- **Citation / year:** Sony Interactive Entertainment. “PlayStation Plus cloud storage for PS5 consoles,” **n.d.**
- **URL:** [Official PS5 cloud-save support](https://www.playstation.com/en-us/support/subscriptions/ps5-ps-plus-cloud-storage/).
- **Access:** 2026-10-29. **Type:** official consumer platform guidance.
- **Use / reliability:** Documents automatic sync at close/rest mode with required settings, and PS4/PS5 differences. Does not expose proprietary console developer requirements or title-specific local-save cadence.
- **Reuse:** Copyrighted support content; factual summary and link only.

### SS19 — Nintendo Switch Save Data Cloud

- **Citation / year:** Nintendo. “Save Data Cloud,” Nintendo Switch Online Support, **n.d.**
- **URL:** [Official backup guidance](https://support.nintendo.com/my/nso/services/savedata-backup/index.html).
- **Access:** 2026-10-29. **Type:** official consumer platform guidance.
- **Use / reliability:** Describes manual/automatic backups, sleep/exit opportunities and situations when backup does not run. Not all games support it. Not a guarantee of background execution for web apps.
- **Reuse:** Copyrighted; brief factual synthesis only.

## Browser lifecycle, storage and performance

### SS20 — Mobile lifecycle model

- **Citation / year:** Chrome for Developers. “Page Lifecycle API,” **n.d.**, living guidance.
- **URL:** [Page lifecycle guidance](https://developer.chrome.com/docs/web-platform/page-lifecycle-api).
- **Access:** 2026-10-29. **Type:** browser-vendor engineering documentation.
- **Use / reliability:** Describes hidden as a key persistence opportunity and freezing/discarding without a guaranteed final callback. Its freeze/resume mechanisms are Chromium guidance; their existence is not proof of iOS WebKit support.
- **Reuse:** Google documentation terms; original summary, no sample code.

### SS21 — Visibility-change event

- **Citation / year:** MDN contributors. “Document: visibilitychange event,” **n.d.**
- **URL:** [visibilitychange reference](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event).
- **Access:** 2026-10-29. **Type:** maintained web API reference.
- **Use / reliability:** Supports treating hidden as the normal session-end opportunity. A recommended signal is not an execution-completion or crash-delivery guarantee.
- **Reuse:** MDN documentation attribution/license terms apply; paraphrase and source attribution only.

### SS22 — Pagehide and beforeunload limitations

- **Citation / year:** MDN contributors. “Window: pagehide event” and “Window: beforeunload event,” **n.d.**
- **URLs:** [pagehide](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event); [beforeunload](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event).
- **Access:** 2026-10-29. **Type:** maintained API references.
- **Use / reliability:** Explicit mobile delivery limitations; pagehide is compatible with back/forward caching. These pages support lifecycle caveats, not a measured failure rate on the owner's iPhone.
- **Reuse:** MDN documentation terms; no copied examples.

### SS23 — WebKit lifecycle bug history

- **Citation / year:** WebKit Bugzilla participants. Bug 199854, “Safari on iOS doesn't fire any events when the tab/app is closed,” opened **2019**.
- **URL:** [WebKit issue 199854](https://bugs.webkit.org/show_bug.cgi?id=199854).
- **Access:** 2026-10-29. **Type:** primary browser issue/reproduction discussion.
- **Use / reliability:** Historical evidence of delivery hazards. A report and later discussion are not proof that every current iOS version has the original bug. Used only to reinforce device testing and avoiding final-event dependence.
- **Reuse:** Issue text not reproduced; factual summary only.

### SS24 — WebKit storage quotas and persistence

- **Citation / year:** Sihui Liu, WebKit. “Updates to Storage Policy,” August 10, **2023**.
- **URL:** [WebKit storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/).
- **Access:** 2026-10-29. **Type:** first-party browser implementation policy.
- **Use / reliability:** Primary authority for Safari 17+ quota categories, standalone-app treatment, eviction, estimate/persist APIs. Upper limits and heuristics are not guaranteed free space or permanent retention; separate API caps still matter.
- **Reuse:** Copyrighted blog; independently summarized, no tables copied.

### SS25 — Home Screen apps and ITP inactivity

- **Citation / year:** John Wilander, WebKit. “Full Third-Party Cookie Blocking and More,” March 24, **2020**, storage and Home Screen sections.
- **URL:** [WebKit ITP storage explanation](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/).
- **Access:** 2026-10-29. **Type:** browser-vendor policy explanation.
- **Use / reliability:** Distinguishes Safari-use inactivity accounting from installed-app use. Historical ITP policy is not a promise against low-storage eviction, user deletion or app removal.
- **Reuse:** Copyrighted blog; factual summary only.

### SS26 — Web Storage synchronization and API caps

- **Citation / year:** MDN contributors. “Web Storage API” and “Storage quotas and eviction criteria,” **n.d.**
- **URLs:** [Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API); [quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).
- **Access:** 2026-10-29. **Type:** maintained API reference and storage guide.
- **Use / reliability:** Supports synchronous localStorage cost, origin separation and separate Web Storage limits. Quota estimates and general limits require actual-device error handling.
- **Reuse:** MDN attribution/license terms; original summaries only.

### SS27 — IndexedDB performance and incremental records

- **Citation / year:** Philip Walton, Google. “Best practices for persisting application state with IndexedDB,” web.dev, June 8, **2017**.
- **URL:** [IndexedDB state-persistence guidance](https://web.dev/articles/indexeddb-best-practices-app-state).
- **Access:** 2026-10-29. **Type:** browser-engineering article.
- **Use / reliability:** Explains why asynchronous storage APIs can still incur serialization costs and recommends writing changed records. Old implementation examples are not current Safari benchmarks.
- **Reuse:** Page states CC BY 4.0 for content and Apache 2.0 for samples; author/title/link supplied. No samples copied and summaries are original.

### SS28 — Structured serialization in games

- **Citation / year:** Andrew Sutherland, Mozilla DOM Team. “Browser Storage,” W3C Workshop on Web Games slides, **2018**.
- **URL:** [Workshop presentation](https://www.w3.org/2018/12/games-workshop/slides/13-storage.pdf).
- **Access:** 2026-10-29. **Type:** primary browser-engineer conference presentation.
- **Use / reliability:** Explains synchronous structured serialization for messaging/IDB and inexpensive Blob handles. Historical quota slides were not used as current Safari policy.
- **Reuse:** Slide license not checked; no slides/figures/text reproduced.

### SS29 — Transferable buffers

- **Citation / year:** MDN contributors. “Transferable objects,” **n.d.**
- **URL:** [Transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects).
- **Access:** 2026-10-29. **Type:** web platform API reference.
- **Use / reliability:** Explains ArrayBuffer ownership transfer and detachment. It does not make conversion of an existing large object to bytes free.
- **Reuse:** MDN documentation terms; original explanation, no code copied.

### SS30 — OPFS in WebKit

- **Citation / year:** Sihui Liu, WebKit. “The File System API with Origin Private File System,” February 14, **2022**, subsequently updated browser-support text.
- **URL:** [WebKit OPFS explanation](https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/).
- **Access:** 2026-10-29. **Type:** browser-vendor implementation article.
- **Use / reliability:** Establishes private origin storage and worker-only synchronous access handles. Historical method-availability details must be checked against supported iOS versions before adoption; not a current head-to-head IDB benchmark.
- **Reuse:** Copyrighted; architecture facts only, no examples reproduced.

### SS31 — Idle scheduling

- **Citation / year:** MDN contributors. “Window: requestIdleCallback() method,” **n.d.**
- **URL:** [requestIdleCallback reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).
- **Access:** 2026-10-29. **Type:** maintained API reference.
- **Use / reliability:** Availability varies; timeout can force execution during busy periods. Scheduling does not split a synchronous JSON operation or guarantee a pre-termination flush.
- **Reuse:** MDN documentation terms; no samples copied.

### SS32 — Beacon delivery and acknowledgement

- **Citation / year:** MDN contributors. “Navigator: sendBeacon() method,” **n.d.**
- **URL:** [Beacon reference](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon).
- **Access:** 2026-10-29. **Type:** maintained API reference.
- **Use / reliability:** Small queued POST semantics, queue-size limit, and lack of response access. Queue acceptance is different from an acknowledged campaign revision.
- **Reuse:** MDN documentation terms; independently summarized.

### SS33 — Keepalive size limit

- **Citation / year:** WHATWG contributors. *Fetch Living Standard*, updated October 19, **2026**, HTTP-network-or-cache fetch keepalive body budget.
- **URL:** [Fetch standard](https://fetch.spec.whatwg.org/#http-network-or-cache-fetch).
- **Access:** 2026-10-29. **Type:** primary web standard.
- **Use / reliability:** Establishes aggregate in-flight keepalive body budget. This is distinct from the newer fetchLater quotas; the latter were not used to infer PWA support.
- **Reuse:** Standard license not independently checked; short original technical summary only.

### SS34 — Local-first architecture

- **Citation / year:** Martin Kleppmann, Adam Wiggins, Peter van Hardenberg and Mark McGranaghan. “Local-first software: You own your data, in spite of the cloud.” *Onward! 2019*, October **2019**, pp. 154–178. DOI: **10.1145/3359591.3359737**; author-hosted essay April 2019.
- **URL:** [Author-hosted paper/essay](https://www.inkandswitch.com/essay/local-first/).
- **Access:** 2026-10-29. **Type:** research paper and engineering essay, Ink & Switch / ACM proceedings.
- **Use / reliability:** Supports separating local availability from optional synchronization. Does not validate a campaign conflict algorithm or require a CRDT. This report's architecture and numeric targets are its own proposals.
- **Reuse:** Author-hosted text; license not independently verified; no figures or prose copied.

### SS35 — Profiling a real iPhone web app

- **Citation / year:** Brian Burg, Devin Rousso, Joseph Pecoraro and Timothy Hatcher, WebKit. “Enabling Web Inspector,” **2020**, updated March 19, **2025** by Razvan Caliman.
- **URL:** [Remote inspection setup](https://webkit.org/web-inspector/enabling-web-inspector/).
- **Access:** 2026-10-29. **Type:** official browser developer-tool documentation.
- **Use / reliability:** Documents macOS Safari inspection of an iOS device, including Home Screen websites. Describes the supported route, not availability of a Mac or device access in this milestone.
- **Reuse:** Copyrighted; brief original setup summary only.

### SS36 — Timelines and memory profiling

- **Citation / year:** Brian Burg, Devin Rousso, Joseph Pecoraro and Timothy Hatcher, WebKit. “Timelines Tab,” September 8, **2020**, updated June 2, **2022** by Devin Rousso.
- **URL:** [Timelines reference](https://webkit.org/web-inspector/timelines-tab/).
- **Access:** 2026-10-29. **Type:** official profiling-tool documentation.
- **Use / reliability:** Supports JavaScript, CPU, rendering, allocation and network correlation. Some recording modes perturb performance; instrumented results need an uninstrumented comparison.
- **Reuse:** Copyrighted; factual synthesis only.

### SS37 — Long-task measurement availability

- **Citation / year:** MDN contributors. “PerformanceLongTaskTiming,” **n.d.**
- **URL:** [Long-task API reference](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming).
- **Access:** 2026-10-29. **Type:** maintained API reference.
- **Use / reliability:** Defines the 50 ms measurement category and marks limited availability. Feature detection is necessary; missing entries cannot prove a Safari session had no long tasks.
- **Reuse:** MDN documentation terms; original summary only.

## Repository evidence and research limits

### REPO01 — Current implementation

- **Citation / year:** GamifySurgery contributors. Player session, cloud coordinator/codec/storage, diagnostics, feedback and game-domain implementation, working-tree snapshot, **2026**.
- **Location:** Repository-relative file:line references and selected SHA-256 prefixes are in the companion audit. No remote URL is assigned to uncommitted/concurrently edited files.
- **Access:** 2026-10-29. **Type:** direct read-only source inspection.
- **Use / reliability:** Strong evidence of reachable code and size-dependent work; not a device CPU profile or proof that the inspected bytes match every installed release.
- **Reuse:** Owner-provided project source; no implementation was copied from third parties or changed in this milestone.

### REPO02 — Prior measurements and incident history

- **Citation / year:** GamifySurgery manager/worker records. `docs/execplans/flag-freeze-20261028.md`, especially lines 2637–2698 and 2948–3050; `docs/handoffs/CURRENT_THREAD_HANDOFF.md`, **2026**.
- **Location:** [Freeze investigation record](../execplans/flag-freeze-20261028.md); [current handoff](../handoffs/CURRENT_THREAD_HANDOFF.md).
- **Access:** 2026-10-29. **Type:** internal engineering evidence / handoff.
- **Use / reliability:** Existing controlled reproductions, benchmark limitations and manager-reported release acceptance. This research did not rerun tests, verify deployment, read tester saves or inspect the live database. Historic line references inside that plan may describe older source versions.
- **Reuse:** Internal project records; summarized with provenance.

## Exclusions and uncertainty

Searches also surfaced user forums, third-party walkthroughs and copied PDF mirrors. They were not used to establish technical defaults or causality. Cookie Clicker's static page did not expose its save behavior and its script could not be read with the research tool; Melvor's wiki and main game endpoint were inaccessible. No exact cadence was inferred from those failures. The accessible Trimps source supplied a stronger browser-game example. No proprietary manuals, clinical corpora, paywalled snippets, recalled questions, private account payloads or external write endpoints were used.

The evidence supports patterns and constraints, not an industry-wide optimum. Published game settings describe particular products/versions. Recommendations, rollout cohort sizes and acceptance budgets in the companion are proposed engineering choices, not quoted platform requirements.
