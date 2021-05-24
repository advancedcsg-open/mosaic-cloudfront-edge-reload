# mosaic-cloudfront-edge-reload
Action to reload edge functions on a Cloudfront distribution

## Inputs

### `cloudfront-id`

**Required** Name of the report. Needs to consist of `digits (0-9)`, `letters(A-Z, a-z)`, separated by `-`.

### `lambda-arns`

**Required** Name of the stack, like dev or prod. Default `dev`.

## Example usage

```
uses: mosaic-cloudfront-edge-reload@v1.0
with:
    cloudfront-id: 'DA2131GFDG1231'
    lambda-arns: 'dev'
```
