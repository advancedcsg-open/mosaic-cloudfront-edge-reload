# mosaic-cloudfront-edge-reload-action
Action to reload edge functions on a Cloudfront distribution

## Inputs

### `cloudfront-id`

**Required** 'Id of the cloudfront distribution that should be updated.'

### `lambda-arns`

**Required** 'Arns of the lambdas, separated by commas, should include the version, Example format: {arn}:{version},{arn}:{version}.'

## Prerequisites
- Requires AWS credentials to update Cloudfront distribution and read Edge Lambda functions, including the enablement of replication on functions.

## Example usage

```
uses: mosaic-cloudfront-edge-reload-action@v1.0
with:
    cloudfront-id: '{cloudfront-id}'
    lambda-arns: 'arn:aws:lambda:{region}:{account-id}:function:{function-name}:{version},arn:aws:lambda:{region}:{account-id}:function:{function-name}:{version}'
```
