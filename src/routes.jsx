import React from 'react'
import { Layout, practiceAreas } from './App.jsx'
import * as P from './pages.jsx'

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <P.Home /> },
      { path: 'about', element: <P.About /> },
      { path: 'practice', element: <P.Practice /> },
      {
        path: 'practice/:slug',
        element: <P.PracticeDetail />,
        getStaticPaths: () => practiceAreas.map(a => `/practice/${a.slug}`),
      },
      { path: 'team', element: <P.Team /> },
      { path: 'achievements', element: <P.Achievements /> },
      { path: 'articles', element: <P.Articles /> },
      { path: 'contact', element: <P.Contact /> },
      { path: '*', element: <P.NotFound /> },
    ],
  },
]
