import { useQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import FeedbackBox from '../../components/backend/FeedbackBox.jsx';
import LegalDocument from '../../components/backend/LegalDocument.jsx';
import TabsList from '../../components/backend/TabsList.jsx';
import Loader from '../../components/common/Loader.jsx';
import { useFeedback } from '../../hooks/useFeedback.js';
import { fetchItem } from '../../utils/http.js';
import { assignPageCSSModifier } from '../../utils/utils.jsx';

const menuSet = [
  {
    name: 'Regulamin',
    symbol: 'contract_edit',
    link: '/polityka-firmy/regulamin',
  },
  {
    name: 'RODO',
    symbol: 'copyright',
    link: '/polityka-firmy/rodo',
  },
];

function TOSPage() {
  const location = useLocation();
  const accountTab = location.pathname;
  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  const [isChosenContent, setIsChosenContent] = useState(accountTab);
  const query = accountTab.includes('rodo') ? '/get-gdpr' : '/get-tos';
  const isGdprSubpage = isChosenContent.includes('rodo');

  useEffect(() => {
    setIsChosenContent(accountTab);
  }, [accountTab]);

  useEffect(() => assignPageCSSModifier('doc-type'), []);

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };

  const {
    data: latestLegalDoc,
    isLoading: isLegalDocLoading,
    isError: isLegalDocError,
    error: LegalDocError,
  } = useQuery({
    queryKey: ['legal', query],
    queryFn: async ({ signal }) => {
      const wrapper = await fetchItem(query, { signal });
      return wrapper.content; //  return only the nested content object
    },
    keepPreviousData: true,
    ...cacheConfig,
    onError: err => {
      updateFeedback(err);
    },
  });

  if (isLegalDocLoading) {
    return <Loader label={'Ładowanie Regulaminu'} />;
  }

  if (isLegalDocError || feedback.status === -1) {
    return (
      <FeedbackBox
        onCloseFeedback={resetFeedback}
        status={feedback.status}
        isPending={isLegalDocLoading}
        isError={isLegalDocError}
        error={LegalDocError}
        successMsg={feedback.message}
        warnings={feedback.warnings}
      />
    );
  }
  // Loading component based on url
  const wrap = element => (
    <Suspense fallback={<Loader label={'Ładowanie'} />}>{element}</Suspense>
  );

  let userTabs, content;
  userTabs = (
    <TabsList
      menuSet={menuSet}
      onClick={setIsChosenContent}
      shouldSwitchState={true}
    />
  );

  content = wrap(
    <LegalDocument
      title={isGdprSubpage ? 'RODO' : 'Regulamin'}
      doc={latestLegalDoc}
    />
  );

  return (
    <>
      <Helmet>
        <html lang='pl' />
        <title>
          {isGdprSubpage
            ? 'Polityka Prywatności (RODO) – Yoganka'
            : 'Regulamin – Yoganka'}
        </title>
        <meta
          name='description'
          content={
            isGdprSubpage
              ? 'Dowiedz się, jak Yoganka przetwarza dane osobowe zgodnie z RODO.'
              : 'Poznaj zasady korzystania z serwisu Yoganka – pełen regulamin dostępny online.'
          }
        />
        <link
          rel='canonical'
          href={
            isGdprSubpage
              ? 'https://yoganka.pl/polityka-firmy/rodo'
              : 'https://yoganka.pl/polityka-firmy/regulamin'
          }
        />
        <meta name='robots' content='index, follow' />
        <meta property='og:type' content='article' />
        <meta property='og:image' content='/favicon_io/apple-touch-icon.png' />
      </Helmet>
      <header className='docs-header'>
        <h2 className='section__header'>Witaj w Yogance!</h2>
        <article className='camps-intro__welcome-desc b2b-intro'>
          Niniejsze dokumenty określają zasady korzystania z naszego serwisu
          oraz przetwarzania danych.
        </article>
        {userTabs}
      </header>
      <main className='doc'>
        {latestLegalDoc ? (
          content
        ) : (
          <div className='modal-table__no-table-note dimmed'>
            Brak wersji {isGdprSubpage ? 'RODO' : 'Regulaminu'}
          </div>
        )}
      </main>
    </>
  );
}

export default TOSPage;
