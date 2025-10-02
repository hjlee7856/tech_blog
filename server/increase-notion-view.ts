/**
 * 게시글 조회수 증가 API 호출 함수
 * @param pageId - 조회수를 증가시킬 Notion page id
 * @returns 성공 여부(boolean)
 */
interface IncreaseViewResponse {
  success?: boolean
}

export async function increaseNotionView(pageId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/increase-post-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_id: pageId })
    })

    if (!res.ok) {
      // 405, 400 등 에러 응답 처리
      return false
    }

    const data = (await res.json()) as IncreaseViewResponse
    return data?.success === true
  } catch {
    // 네트워크 등 예외 상황 처리
    return false
  }
}
