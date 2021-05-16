import * as AWS  from 'aws-sdk'
import * as S3 from 'aws-sdk/clients/s3'

export class TodoS3Access {

    constructor(
      private readonly s3Client: S3 = new AWS.S3({ signatureVersion: 'v4' }),
      private readonly s3Bucket = process.env.TODO_S3_BUCKET,
      private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
    }
    
    getPresignedUrlFromS3(todoId: String) : String {
        
        const presignedUrl =  this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3Bucket, 
            Key: todoId, 
            Expires:parseInt(this.urlExpiration)  
        })
        return presignedUrl
    }

   
}