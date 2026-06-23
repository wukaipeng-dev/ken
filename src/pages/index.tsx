import React, { useEffect } from 'react';
import {translate} from '@docusaurus/Translate';

import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// import HomepageFeatures from '@site/src/components/HomepageFeatures';

import HomepageHeader from '../components/HomepageHeader';
import RecentPosts from '../components/RecentPosts';
// import Car from '../components/Car';
// import Project from '../components/Project';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={translate({id: 'homepage.title', message: 'Home', description: 'The home page title'})}
      description={translate({id: 'homepage.description', message: "Kaipeng's Knowledge Domain", description: 'The home page description'})}
    >
      <HomepageHeader />
      <main>
        {/* <Car /> */}
        <RecentPosts />
      </main>
    </Layout>
  );
}
