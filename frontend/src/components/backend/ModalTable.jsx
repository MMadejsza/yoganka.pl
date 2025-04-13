import { useLocation } from 'react-router-dom';
import { hasValidPassFn } from '../../utils/userCustomerUtils';

function ModalTable({
  headers,
  content,
  keys,
  active,
  classModifier,
  onOpen,
  onQuickAction,
  status,
  isAdminPage,
  adminActions,
  notToArchive = false,
}) {
  const today = new Date();
  const isLoggedIn =
      status?.isLoggedIn != undefined ? status.isLoggedIn : 'N/A',
    isCustomer = status?.role === 'CUSTOMER',
    isAdmin = status?.role === 'ADMIN';
  const location = useLocation();
  const isAdminView = location.pathname.includes('admin-console');
  const isUserPassesView = location.pathname.includes('grafik/karnety');
  console.log('ModalTable content', content);
  console.log('ModalTable headers', headers);
  console.log('ModalTable keys', keys);
  console.log('ModalTable status', status);

  const pickCustomerSymbol = (
    row,
    isArchived,
    symbol,
    hasValidPass,
    isUserPassesView
  ) => {
    if (isAdminPage && adminActions) {
      return symbol;
    } else if (isLoggedIn && (isCustomer || isAdmin)) {
      if (row.isUserGoing) return 'check';
      else if (row.full || isArchived) return 'block';
      else if (row.wasUserReserved) return 'restore';
      else if (hasValidPass && !isUserPassesView) return 'calendar_add_on';
      else return 'local_mall';
    }
    return 'lock_person';
  };

  const getSymbol = (row, isArchived, action) => {
    const hasValidPass =
      isAdminView || isUserPassesView ? true : hasValidPassFn(status, row);
    // console.log('hasValidPass', hasValidPass);
    const conditionalClass = `material-symbols-rounded nav__icon${
      row.isActionDisabled === true ? ' dimmed' : ''
    }${action.extraClass ? ` ${action.extraClass}` : ''}${
      !hasValidPass && !row.isUserGoing && !row.wasUserReserved ? ` black` : ''
    }`;

    return (
      <span className={conditionalClass}>
        {pickCustomerSymbol(
          row,
          isArchived,
          action.symbol,
          hasValidPass,
          isUserPassesView
        )}
      </span>
    );
  };

  // const pickCellSymbol = key => {
  //   switch (true) {
  //     case key.includes('Id'):
  //       return 'badge';
  //     case key == 'date':
  //       return 'event';
  //     case key == 'day':
  //       return 'calendar_view_day';
  //     case key == 'startTime':
  //       return 'access_time';
  //     case key == 'productType':
  //       return 'class';
  //     case key == 'productName':
  //       return 'self_improvement';
  //     case key == 'location':
  //       return 'location_on';

  //     default:
  //       break;
  //   }
  // };

  const formatValue = (value, keyClass) => {
    let val = value;
    if (value != undefined && typeof value == 'boolean') {
      val = (
        <span
          className={`material-symbols-rounded nav__icon nav__icon--${keyClass}`}
        >
          {value == true ? 'check' : 'close'}
        </span>
      );
    }
    if (value == undefined) {
      val = '';
    }
    return val;
  };

  const onRowBtnClick = (row, archived, method, e) => {
    const isUserGoing = row.isUserGoing != undefined ? row.isUserGoing : false;
    const isArchived = archived != undefined ? archived : 'N/A';
    const isAuthorized =
      status?.role != undefined ? isCustomer || isAdmin : 'N/A';
    const hasPass =
      isAdminView || isUserPassesView ? true : hasValidPassFn(status, row);
    // console.log('onRowBtnClick:', {
    //   isUserGoing: isUserGoing,
    //   isLoggedIn: isLoggedIn,
    //   isArchived,
    //   role: status?.role,
    //   isAuthorized,
    //   method: method,
    // });

    if (!isUserGoing && isLoggedIn && !isArchived && isAuthorized && hasPass) {
      e.stopPropagation();
      method({
        customerDetails: '',
        scheduleId: row.scheduleId,
        product: row.productName,
        status: 'Paid',
        amountPaid: row.price,
        amountDue: 0,
        paymentMethod: 'Credit Card',
        paymentStatus: 'Completed',
        customerId: row.customerId,
        rowId: row.rowId,
      });
    }
    return null;
  };

  return (
    <table
      className={`modal-table ${
        classModifier ? `modal-table--${classModifier}` : ''
      }`}
    >
      <thead className='modal-table__headers'>
        <tr>
          {headers?.map((header, index) => (
            <th className='modal-table__single-header' key={index}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.map((row, rowIndex) => {
          const isArchived =
            new Date(
              `${row.date?.split('.').reverse().join('-')}T${
                row.startTime ?? '00:00:00'
              }`
            ) < today;

          return (
            <tr
              className={`modal-table__cells ${active ? 'active' : ''}  ${
                classModifier ? `modal-table__cells--${classModifier}` : ''
              } ${
                !isAdminPage
                  ? row.isUserGoing && status?.isLoggedIn
                    ? 'booked'
                    : ''
                  : ''
              } ${
                !isAdminPage && !notToArchive
                  ? isArchived && !isAdminPage
                    ? 'archived'
                    : ''
                  : ''
              } ${row.full && !isAdminPage && 'full'}`}
              key={rowIndex}
              onClick={() => {
                if (active) return onOpen(row);
                return null;
              }}
            >
              {keys?.map((key, keyIndex) => {
                // console.log('🧩 RENDERING CELL');
                // console.log('🔑 key:', key);
                // console.log('📦 row:', row);
                // console.log('💥 value:', row[key]);
                let value = row[key];
                if (row[key] == 'date') {
                  value = new Date(row.date).toISOString().slice(0, 10);
                }
                if (key == '') {
                  value = (
                    <div className='action-btns'>
                      {onQuickAction?.map((action, index) => (
                        <button
                          key={index}
                          className={`form-action-btn symbol-only-btn symbol-only-btn--submit`}
                          onClick={e => {
                            onRowBtnClick(row, isArchived, action.method, e);
                          }}
                        >
                          {getSymbol(row, isArchived, action)}
                        </button>
                      ))}
                    </div>
                  );
                }
                const keyClass = key.includes('Id') ? 'rowId' : key;
                return (
                  <td
                    className={`modal-table__single-cell modal-table__single-cell--${keyClass} ${
                      classModifier
                        ? `modal-table__single-cell--${classModifier}`
                        : ''
                    }${key == 'Hasło (Szyfrowane)' ? 'hash' : ''}`}
                    key={keyIndex}
                  >
                    {formatValue(value, keyClass)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ModalTable;
