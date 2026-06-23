import React from 'react'
import clsx from 'clsx'
import { usePluginData } from '@docusaurus/useGlobalData'
import Link from '@docusaurus/Link'
import Translate, { translate } from '@docusaurus/Translate'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

import styles from './styles.module.scss'

interface Post {
  title: string
  link: string
  date: string
  type: 'blog' | 'docs'
}

function PostCard({
  icon,
  title,
  posts,
  emptyMessage,
  locale,
}: {
  icon: string
  title: React.ReactNode
  posts: Post[]
  emptyMessage: React.ReactNode
  locale: string
}) {
  return (
    <div className={styles.column}>
      <div className="card shadow--md" style={{ height: '100%', borderRadius: '16px', border: '1px solid var(--ifm-color-emphasis-200)', overflow: 'hidden' }}>
        <div className="card__header" style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)', backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '1.25rem' }}>
          <h3 className={styles.columnTitle}>
            <span className={styles.columnIcon}>{icon}</span> {title}
          </h3>
        </div>
        <div className="card__body" style={{ padding: '1.5rem' }}>
          {posts.length > 0 ? (
            <ul className={styles.postList}>
              {posts.map((post, index) => (
                <li key={index} className={styles.postItem}>
                  <Link to={post.link} className={styles.postLink}>
                    {post.title}
                  </Link>
                  <small className={styles.postDate}>
                    {new Date(post.date).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMessage}>{emptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RecentPosts(): React.ReactElement {
  const recentPostsData = usePluginData('recent-posts-plugin') as any
  const recentBlogs: Post[] = recentPostsData?.recentBlogs || []
  const recentDocs: Post[] = recentPostsData?.recentDocs || []
  const { i18n } = useDocusaurusContext()
  const locale = i18n.currentLocale

  return (
    <section className={clsx(styles.recentPosts)}>
      <div className="container">
        <p className={clsx('hero__title', styles.sectionTitle)}>
          <Translate id="recentPosts.sectionTitle">发现最新动态</Translate>
        </p>
        <div className={styles.columns}>
          <PostCard
            icon="📝"
            title={<Translate id="recentPosts.latestBlogs">最新文章</Translate>}
            posts={recentBlogs}
            emptyMessage={<Translate id="recentPosts.noBlogs">暂无最新文章</Translate>}
            locale={locale}
          />
          <PostCard
            icon="📚"
            title={<Translate id="recentPosts.latestDocs">最新文档</Translate>}
            posts={recentDocs}
            emptyMessage={<Translate id="recentPosts.noDocs">暂无最新文档</Translate>}
            locale={locale}
          />
        </div>
      </div>
    </section>
  )
}
