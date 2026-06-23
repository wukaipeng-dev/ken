import React from 'react'
import clsx from 'clsx'
import Translate from '@docusaurus/Translate'

import styles from './styles.module.scss'

export default function HomepageHeader(): React.ReactElement {
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className='container'>
        <p className='hero__title'>
          "<Translate id="homepage.quote.line1">你写的每一行代码</Translate>
        </p>
        <p className='hero__title'>
          <Translate id="homepage.quote.line2">都是你的名片</Translate>"
        </p>
      </div>
    </header>
  )
}
