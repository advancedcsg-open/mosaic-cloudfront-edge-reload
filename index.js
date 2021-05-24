const core = require('@actions/core')
const AWS = require('aws-sdk')
const cloudfront = new AWS.CloudFront()

function splitArn (arn) {
  const arnParts = arn.split(':')
  const version = arnParts.pop()
  const name = arnParts.join(':')
  return { name, version }
}

const getConfig = async (id) => {
  const params = {
    Id: id
  }
  return await cloudfront.getDistributionConfig(params).promise()
}

const updateCloudfront = async (id, tag, distributionConfig, lambdaARNDict) => {
  const updateConfigParams = {
    Id: id,
    IfMatch: tag
  }

  updateConfigParams.DistributionConfig = distributionConfig

  updateConfigParams.DistributionConfig.CacheBehaviors.Items.forEach(behavior => {
    if (behavior.LambdaFunctionAssociations.Quantity > 0) {
      behavior.LambdaFunctionAssociations.Items.forEach(assoc => {
        const { name, version } = splitArn(assoc.LambdaFunctionARN)
        if (name in lambdaARNDict && version !== lambdaARNDict[name]) {
          assoc.LambdaFunctionARN = `${name}:${lambdaARNDict[name]}`
        }
      })
    }
  })

  return await cloudfront
    .updateDistribution(updateConfigParams)
    .promise()
}

(async () => {
  try {
    const cloudfrontId = core.getInput('cloudfront-id')
    const lambdaARNsString = core.getInput('lambda-arns')
    const lambdaARNs = lambdaARNsString ? lambdaARNsString.split(',') : null
    if (lambdaARNs) {
      const lambdaARNDict = {}
      lambdaARNs.forEach((arn) => {
        const { name, version } = splitArn(arn)
        lambdaARNDict[name] = version
      })

      const config = await getConfig(cloudfrontId)
      const distributionConfig = config.DistributionConfig
      const Etag = config.ETag
      await updateCloudfront(cloudfrontId, Etag, distributionConfig, lambdaARNDict)
    } else {
      core.setFailed('No lambda ARNs provided')
    }
  } catch (error) {
    core.setFailed(error.message)
  }
})()
