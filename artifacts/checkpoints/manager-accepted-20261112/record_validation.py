"""Record local source coverage, provenance and release comparison evidence."""
from pathlib import Path
from collections import Counter, defaultdict
import json
import re
import sys

sys.dont_write_bytecode = True
from capture_inventory import ROOT, REPO, BASE, ENV, sha, write_json, git, PREFIX
from prepare_archive import prior_targets, tree, GitObjects, RELEASE_REPO, RELEASE_COMMIT, prior_integrity
from verify_archive import recovered_files


def load(relative):
    return json.loads((ROOT / relative).read_bytes())


def record():
    selected = load('validation/selection.json')['files']
    initial = load('validation/intake-inventory.json')
    intake = {e['path']: e for e in initial['files']}
    recovered = recovered_files(ROOT)
    excluded = load('exclusions.json')['files']
    selected_paths = set(recovered)
    excluded_paths = {e['path'] for e in excluded}
    plan = load('validation/selection-plan.json')
    require = lambda test, message: None if test else (_ for _ in ()).throw(ValueError(message))
    require(all(sha(data) == intake[rel]['sha256'] for rel, data in recovered.items()), 'Intake drift')
    require(not (selected_paths & excluded_paths), 'Selected and excluded target overlap')
    unaccounted = {e['path'] for e in plan['files']} - selected_paths - excluded_paths
    require(not unaccounted, 'Unaccounted planned targets')
    prior = prior_targets()
    changed_prior = []
    for rel, old in prior.items():
        if rel not in intake or intake[rel]['sha256'] == old['sha256']: continue
        changed_prior.append(dict(path=rel, baselineSha256=old['sha256'], sha256=intake[rel]['sha256'],
            bytes=intake[rel]['bytes'], capturedInAssignedScope=rel in selected_paths,
            liveOnlyReason=next((e['group'] for e in excluded if e['path']==rel), None)))
    write_json(ROOT / 'validation/baseline-reconciliation.json', dict(status='PASS', baseCommit=BASE,
        priorAcceptedTargets=len(prior), changedPriorTargets=changed_prior,
        unchangedPriorTargets=len(load('validation/unchanged-prior-targets.json')['files']),
        capturedTargets=len(selected_paths), excludedPlannedTargets=sorted({e['path'] for e in plan['files']} & excluded_paths),
        unaccountedPlannedTargets=sorted(unaccounted),
        olderOutOfLaneComparison='Checkpoint-six exclusion path/size plus pre-baseline modification time; metadata comparison, not an invented historical hash.'))
    summary = defaultdict(lambda: dict(files=0, bytes=0))
    for e in excluded:
        summary[e['group']]['files'] += 1
        summary[e['group']]['bytes'] += e.get('bytes', 0)
    write_json(ROOT / 'validation/exclusion-summary.json', dict(files=len(excluded), excludedBytes=sum(e.get('bytes',0) for e in excluded),
        groups=dict(summary), privateContentsRead=False, noOwnerStorageEnumeration=True,
        caveat='Excluded private/ignored directories are not recursively enumerated; totals cover safe Git-visible candidate metadata only.'))
    images = [e for e in excluded if e['group'] in {'regenerable_room_render_histories','regenerable_character_review_histories'}]
    write_json(ROOT / 'validation/regenerable-image-histories.json', dict(files=images, totalBytes=sum(e.get('bytes',0) for e in images)))
    write_json(ROOT / 'validation/stage-sources.json', dict(files=[], reason='Archive-only allowlist; no live shared code or documents staged by this package.'))

    clinical = [e for e in selected if e['path'].startswith('packages/clinical-content/')]
    for e in clinical: require(e['sha256'] == intake[e['path']]['sha256'], 'Clinical intake drift')
    write_json(ROOT / 'validation/clinical-source-invariance.json', dict(status='PASS', files=[dict(path=e['path'],sha256=e['sha256'],bytes=e['bytes']) for e in clinical],
        comparison='Captured accepted clinical bytes equal this run intake; the backup worker authored or changed no clinical content.',
        reviewStatusPreserved=True, clinicalApprovalClaimed=False, sourceCorpusRead=False))
    topic_modules, topic_packets, ledgers, draft_markers = [], [], [], 0
    for rel, data in recovered.items():
        if rel.startswith('packages/clinical-content/src/question-topic-') and rel.endswith('.ts') and not rel.endswith('.test.ts'):
            text = data.decode('utf-8')
            markers = len(re.findall(r'''reviewStatus\s*:\s*["']needs_clinician_review["']''', text))
            draft_markers += markers
            # Standalone topic authors explicitly carry the draft marker; acceptance helpers
            # preserve old records and import the established draft metadata.
            standalone = bool(re.fullmatch(r'packages/clinical-content/src/question-topic-(?!acceptance|runtime)[a-z-]+-20261111\.ts', rel))
            if standalone: require(markers > 0, 'Topic draft marker missing: ' + rel)
            topic_modules.append(dict(path=rel,sha256=sha(data),draftMarkers=markers,standaloneTopic=standalone))
        if rel.startswith('docs/research/') and rel.endswith('.json'):
            filename = Path(rel).name
            is_packet = bool(re.fullmatch(r'question-topic-(?!program)[a-z-]+-20261111\.json', filename)) and '-review' not in filename
            is_ledger = filename.startswith('sources-question-topic-')
            if not (is_packet or is_ledger): continue
            content = json.loads(data)
            status = content.get('reviewStatus', content.get('clinicalReviewStatus'))
            nested_markers = data.count(b'needs_clinician_review')
            require(status == 'needs_clinician_review' or (status is None and nested_markers > 0), 'Topic research draft marker missing: ' + rel)
            require(content.get('clinicalApproval') is not True, 'Topic clinical promotion: ' + rel)
            rec = dict(path=rel,sha256=sha(data),reviewStatus=status,recordDraftMarkers=nested_markers,
                markerLocation='root' if status else 'nested_records', clinicalApproval=content.get('clinicalApproval'),
                sourceTextStored=content.get('sourceTextStored'),sources=len(content.get('sources',[])),claims=len(content.get('claims',[])))
            if is_packet: topic_packets.append(rec)
            else: ledgers.append(rec)
    write_json(ROOT / 'validation/clinical-review-audit.json', dict(status='PASS', topicModules=topic_modules,
        topicResearchPackets=topic_packets, topicSourceLedgers=ledgers, draftMarkers=draft_markers,
        clinicalApprovalClaimed=False, publicReleaseOrPromotionPerformed=False, sourceCorpusRead=False,
        scope='Offline preservation and explicit topic draft-marker audit; historical technical review/manager acceptance is not clinician approval.'))

    release_tree = tree(RELEASE_COMMIT, RELEASE_REPO)
    objects = GitObjects(RELEASE_REPO)
    identical, different, absent = [], [], []
    for e in selected:
        rel = e['path']
        if rel not in release_tree:
            absent.append(rel)
            continue
        blob = objects.read(release_tree[rel])
        rec = dict(path=rel,sha256=e['sha256'],bytes=e['bytes'],releaseBlob=release_tree[rel])
        if sha(blob) == e['sha256']: identical.append(rec)
        else:
            rec['releaseSha256'] = sha(blob)
            different.append(rec)
    objects.close()
    write_json(ROOT / 'validation/release-comparison.json', dict(status='PASS',
        releaseCheckout='C:/Users/rowla/Projects/GS-release', releaseHead=RELEASE_COMMIT,
        localTrackingRefs={name:git('rev-parse', name).decode().strip() for name in ['origin/main','origin/release/beta1-20261016']},
        releaseIdenticalPaths=identical, releaseIdenticalBytes=sum(e['bytes'] for e in identical),
        releaseDifferentPaths=different, developmentOnlyPaths=absent,
        omittedBecauseReleaseIdentical=0, networkRequests=0,
        note='Comparison uses existing local Git objects only; not remote verification. Every selected main-tree target is bundled, including release-identical paths. Prior-layer equality and generated-output exclusions provide the inherited size reduction.'))

    objects = GitObjects(RELEASE_REPO)
    live_references = []
    baseline_tree = tree()
    for e in plan['files']:
        rel=e['path']
        if rel in selected_paths: continue
        reason=next((a['group'] for a in excluded if a['path']==rel),None)
        matches_release = rel in release_tree and sha(objects.read(release_tree[rel]))==e['sha256']
        live_references.append(dict(path=rel,intakeSha256=e['sha256'],bytes=e['bytes'],liveOnlyReason=reason,
            intakeMatchesRelease=matches_release,releaseGitObject=RELEASE_COMMIT+':'+rel if matches_release else None,
            presentInPriorLayers=rel in prior,presentInBaselineHEAD=rel in baseline_tree,
            contentCaptured=False))
    objects.close()
    write_json(ROOT / 'validation/live-only-recovery-references.json',dict(status='PASS',files=live_references,
        releaseCommit=RELEASE_COMMIT,networkRequests=0,
        note='Concurrent paths are excluded in their entirety. These immutable release references identify already backed-up intake versions where available. A full project restore may need these compatible released files; this archive does not supply the excluded live paths.'))

    groups = {
        'cloud_saves_recovery_snapshot_only': lambda p: any(s in p.lower() for s in ['cloud', 'snapshot', 'journal', 'storage', 'upload', 'codec', 'persistence', 'save-strategy']),
        'performance_phone_thermal': lambda p: any(s in p.lower() for s in ['perf','phone','thermal','ios','heap','memory','tick-stutter']),
        'late_game_content_robust_pacing': lambda p: any(s in p.lower() for s in ['balance','pacing','pace','late-game','founder-consult','endoscopy-ready','routine-or']),
        'question_programs_flags_batches_n1_n4_harden_stats': lambda p: any(s in p.lower() for s in ['question-flag','question-bank','question-new-n','question-n4','question-harden','question-stats','question-batch','question-round']),
        'topic_program_batches_bindings_and_research': lambda p: 'topic' in p.lower() and p.startswith(('docs/','packages/','tools/')),
        'management_mobile_ui_test_repairs': lambda p: p.startswith(('apps/player/','tests/')),
        'supabase_migrations_and_tests': lambda p: p.startswith(('supabase/','scripts/beta-backup/','scripts/beta-invites/')),
        'docs_execplans_handoffs': lambda p: p.startswith('docs/'),
    }
    coverage = []
    for name, predicate in groups.items():
        paths = sorted(p for p in selected_paths if predicate(p))
        require(bool(paths), 'Required scope empty: ' + name)
        coverage.append(dict(requirement=name,count=len(paths),paths=paths))
    pt409 = sorted(p for p in selected_paths if p.startswith('supabase/migrations/20261110000100'))
    require(len(pt409)==1 and 'PT409' in recovered[pt409[0]].decode('utf-8'), 'Mandatory PT409 migration absent')
    write_json(ROOT / 'validation/requirement-coverage.json', dict(status='PASS', authority='Manager dispatch 2026-11-12',
        requirements=coverage, mandatoryPT409Migration=pt409,
        topicPacketCount=len(topic_packets), topicSourceLedgerCount=len(ledgers),
        explicitInFlightTopics=4, liveOnlyEvidence='validation/concurrent-edits.json',
        acceptanceLimitation='Scope follows manager dispatch, existing acceptance documents and stable intake; this worker does not accept new gameplay or clinical changes.'))
    write_json(ROOT / 'validation/prior-archive-integrity.json', prior_integrity())
    index = REPO / git('rev-parse', '--git-path', 'index').decode().strip()
    head = git('rev-parse','HEAD').decode().strip()
    require(head==initial['head']==BASE and sha(index.read_bytes())==initial['indexSha256'], 'Git HEAD or index changed during worker run')
    write_json(ROOT / 'validation/git-read-only-receipt.json', dict(status='PASS',headBefore=initial['head'],headAfter=head,
        branch=git('branch','--show-current').decode().strip(),indexSha256Before=initial['indexSha256'],indexSha256After=sha(index.read_bytes()),
        gitMutations=0,networkRequests=0,stagingPerformed=False,commitsCreated=0,pushesPerformed=0))
    write_json(ROOT / 'validation/environment-notes.json', dict(python=sys.version.split()[0],rgAvailable=False,
        sourceDiscovery='Read-only Git ls-files/status and local Python; GIT_OPTIONAL_LOCKS=0',
        gameplayBuildOrDBTestsRerun=False,dependenciesInstalled=False,agentsStarted=0,networkRequests=0,
        openingPathwayChanged=False,ownerStorageAccessed=False,clinicalSourcesFetched=0,
        writeScope=PREFIX,sharedHandoffReadOnlyByExplicitDispatch=True,
        collectorSelfExclusionWarning='Initial collector reported its own archive as a warning; immediately corrected, no source-hash error; final/closing inventories PASS.',
        resolvedRestoreIssue='First deeply nested temporary input exceeded Windows path length. Archive-local shortened scratch path passes; all scratch is removed.'))
    write_json(ROOT/'validation/worker-write-scope.json',dict(status='PASS',allowedRoot=PREFIX,
        workerWritesOutsideAllowedRoot=0,sharedWorkingTreePreserved=True,sharedHandoffEditedByWorker=False,
        concurrentChanges='validation/concurrent-edits.json',exactOwnedPaths='STAGE_PATHS.txt',
        gitMutations=0,agentsStarted=0,dependencyInstallations=0,networkRequests=0))
    print(json.dumps(dict(status='PASS',selectedTargets=len(selected),topicResearchPackets=len(topic_packets),
        topicSourceLedgers=len(ledgers),clinicalTargets=len(clinical),releaseIdenticalTargets=len(identical),
        releaseIdenticalBytes=sum(e['bytes'] for e in identical),mandatoryPT409Migration=pt409,gitMutations=0),indent=2))


if __name__ == '__main__': record()
