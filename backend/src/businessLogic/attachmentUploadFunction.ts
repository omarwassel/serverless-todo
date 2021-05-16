import{TodoS3Access}from '../dataLayer/todoS3Access'

const todoS3Access = new TodoS3Access()

export function getPresignedUrl(todoId: string): String {
  return todoS3Access.getPresignedUrlFromS3(todoId)
}
