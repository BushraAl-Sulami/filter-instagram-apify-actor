import { Actor } from 'apify';

await Actor.init();

try {
    const input = await Actor.getInput();

    const datasetId = String(input?.datasetId ?? '').trim();
    const instagramField = String(input?.instagramField ?? 'instagramUrl').trim() || 'instagramUrl';

    if (!datasetId) {
        throw new Error('Missing required input: datasetId');
    }

    const sourceDataset = await Actor.openDataset(datasetId);

    let kept = 0;
    let removed = 0;
    let total = 0;

    for await (const item of sourceDataset.iterateItems()) {
        total += 1;

        const value = item?.[instagramField];

        const hasInstagram =
            value !== null &&
            value !== undefined &&
            String(value).trim().length > 0 &&
            String(value).trim().toLowerCase() !== 'null';

        if (hasInstagram) {
            await Actor.pushData(item);
            kept += 1;
        } else {
            removed += 1;
        }
    }

    await Actor.setValue('SUMMARY', {
        sourceDatasetId: datasetId,
        instagramField,
        totalItems: total,
        keptItems: kept,
        removedItems: removed
    }, { contentType: 'application/json' });

    console.log(`Finished. Total: ${total}, kept: ${kept}, removed: ${removed}.`);
} finally {
    await Actor.exit();
}