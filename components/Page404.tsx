import type * as types from '@/lib/types'

import { NotionPageMeta } from './NotionPageMeta'
import styles from './styles.module.css'

export function Page404({ site, pageId, error }: types.PageProps) {
  const title = site?.name || 'Notion Page Not Found'

  return (
    <>
      <NotionPageMeta title={title} />

      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Notion Page Not Found</h1>

          {error ? (
            <p>{error.message}</p>
          ) : (
            pageId && (
              <p>
                Make sure that Notion page &quot;{pageId}&quot; is publicly
                accessible.
              </p>
            )
          )}

          <img
            src='/404.png'
            alt='404 Not Found'
            className={styles.errorImage}
          />
        </main>
      </div>
    </>
  )
}
