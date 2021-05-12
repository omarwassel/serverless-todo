import * as AWS  from 'aws-sdk'


export class TodoS3Access {

    constructor(
     
      private readonly s3Bucket = process.env.TODO_S3_BUCKET,
      private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
    }
    async getPresignedUrlFromS3(todoId: String) :Promise<String> {
        const s3 = new AWS.S3({
            signatureVersion: 'v4' 
        })
        const presignedUrl = await s3.getSignedUrl('putObject', {
            Bucket: this.s3Bucket, 
            Key: todoId, 
            Expires:this.urlExpiration   
        })
        return presignedUrl
    }

    getS3BucketName() :String {
      return this.s3Bucket
    }
}