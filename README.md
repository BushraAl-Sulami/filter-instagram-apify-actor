# Filter Dataset - Instagram Only

This Apify Actor reads an existing Apify Dataset and writes only records that have a non-empty Instagram URL into the Actor's default output dataset.

## Default field

The Actor expects:

`instagramUrl`

A record is kept when that field contains a non-empty value.

Examples that are removed:
- `null`
- `""`
- missing field
- whitespace-only value

Examples that are kept:
- `https://www.instagram.com/example/`
- `https://instagram.com/example`

## Input

- `datasetId` — required. The source Apify Dataset ID.
- `instagramField` — optional. Defaults to `instagramUrl`.

## Output

The Actor's default Dataset contains the complete original record for every matching restaurant. Rows without Instagram are not copied.

## Run locally

```bash
npm install
npm start
```

Set the Apify Actor input through the Apify Console when running the Actor.

## GitHub → Apify

Import this repository into Apify as an Actor. Apify will build the Docker image using `Dockerfile` and use `.actor/actor.json` and `.actor/input_schema.json` for the Actor definition.
