import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import ModalTable from '../components/adminConsole/ModalTable';
import ViewFrame from '../components/adminConsole/ViewFrame.jsx';
import Section from '../components/Section.jsx';
import { useAuthStatus } from '../hooks/useAuthStatus.js';
import { fetchData, mutateOnCreate, queryClient } from '../utils/http.js';

function SchedulePage() {
  const navigate = useNavigate();
  const location = useLocation(); // fetch current path

  const modalMatch = !!useMatch('/grafik/:id');
  const [isModalOpen, setIsModalOpen] = useState(modalMatch);

  const { data: status } = useAuthStatus();

  const { data, isError, error } = useQuery({
    // as id for later caching received data to not send the same request again where location.pathname is key
    queryKey: ['data', location.pathname],
    // definition of the code sending the actual request- must be returning the promise
    queryFn: () => fetchData('/grafik'),
    // only when location.pathname is set extra beyond admin panel:
    // enabled: location.pathname.includes('grafik'),
    // stopping unnecessary requests when jumping tabs
    staleTime: 10000,
    // how long tada is cached (default 5 mins)
    // gcTime:30000
  });

  const {
    mutateAsync: book, //async to let it return promise for child viewSchedule and let serve the feedback there based on the result of it
    isError: isBookError,
    error: bookError,
    reset,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnCreate(status, formDataObj, `/api/customer/create-booking`),

    onSuccess: res => {
      if (res.isNewCustomer) {
        queryClient.invalidateQueries(['authStatus']);
      }
      queryClient.invalidateQueries(['data', location.pathname]);
    },
  });

  const background = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };
  const handleOpenModal = row => {
    const recordId = row.ID;
    setIsModalOpen(true);
    navigate(`${location.pathname}/${recordId}`, { state: { background } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset(); // resets mutation state and flags
    navigate(-1);
  };

  if (isError) {
    if (error.code == 401) {
      navigate('/login');
      console.log(error.message);
    } else {
      window.alert(error.info?.message || 'Failed to fetch');
    }
  }

  let table;

  if (data) {
    // console.clear();
    console.log(`✅ Data: `);
    console.log(data);

    let content = data.content.sort((a, b) => {
      const dateA = new Date(a.Data.split('.').reverse().join('-'));
      const dateB = new Date(b.Data.split('.').reverse().join('-'));
      return dateA - dateB;
    });
    const headers = data.totalHeaders; //.slice(1);

    table = (
      <ModalTable
        headers={headers}
        keys={headers}
        content={content}
        active={true}
        status={status}
        onOpen={handleOpenModal}
        onQuickAction={[{ symbol: 'shopping_bag_speed', method: book }]}
        // classModifier={classModifier}
      />
    );
  }
  let viewFrame;
  if (data && status) {
    viewFrame = (
      <ViewFrame
        modifier='schedule'
        visited={isModalOpen}
        onClose={handleCloseModal}
        bookingOps={{
          onBook: book,
          isError: isBookError,
          error: bookError,
        }}
        role={status.role}
      />
    );
  }

  return (
    <div className='admin-console'>
      <Section classy='admin-intro' header={`Wyjazdy | Wydarzenia | Online`} />
      {table}
      {isModalOpen && viewFrame}
    </div>
  );
}

export default SchedulePage;
