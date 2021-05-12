import{TodoS3Access}from '../dataLayer/todoS3Access'

const todoS3Access = new TodoS3Access()

export async function getPresignedUrl(todoId: string): Promise<String> {
  return todoS3Access.getPresignedUrlFromS3(todoId)
}
