import { Actor } from 'apify';

await Actor.init();

try {
    const input = await Actor.getInput();

    const datasetId = String(input?.datasetId ?? '').trim();
    const instagramField = String(input?.instagramField ?? 'instagramUrl').trim() || 'instagramUrl';

    console.log(`Source Dataset: ${datasetId}`);
    console.log(`Instagram field: ${instagramField}`);

    if (!datasetId) {
        throw new Error('No source Dataset was selected.');
    }

    console.log('Opening source dataset...');
    const sourceDataset = await Actor.openDataset(datasetId);
    console.log('Source dataset opened. Reading items...');

    let total = 0;
    let kept = 0;
    let removed = 0;

    for await (const item of sourceDataset.iterateItems()) {
        total += 1;

        const raw = item?.[instagramField];
        const instagram = raw == null ? '' : String(raw).trim();

        if (instagram && instagram.toLowerCase() !== 'null') {
            await Actor.pushData(item);
            kept += 1;
        } else {
            removed += 1;
        }

        if (total % 100 === 0) {
            console.log(`Processed ${total}: kept ${kept}, removed ${removed}`);
        }
    }

    const summary = {
        sourceDatasetId: datasetId,
        instagramField,
        totalItems: total,
        keptItems: kept,
        removedItems: removed
    };

    await Actor.setValue('SUMMARY', summary, {
        contentType: 'application/json'
    });

    console.log(`Finished. Total: ${total}, kept: ${kept}, removed: ${removed}.`);
} catch (error) {
    console.error('Actor failed:', error);
    throw error;
} finally {
    await Actor.exit();
}