import { Box, Button } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { CardList } from '../components/CardList';
import { Error } from '../components/Error';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { api } from '../services/api';


type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type Response = {
  data: Image[];
  after: string;
};

export default function Home(): JSX.Element {
  async function getPages({ pageParam = null }): Promise<Response> {
    const { data } = await api.get('/api/images', { params: { after: pageParam } });

    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', getPages, {
    getNextPageParam: lastPage => lastPage.after,
  });

  const formattedData = useMemo(() => {
    return data?.pages.map(page => page.data).flat();
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button bg="yellow.400" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
