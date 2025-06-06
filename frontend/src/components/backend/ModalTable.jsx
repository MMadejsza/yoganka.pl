import { useLocation } from 'react-router-dom';
import {
  formatValue,
  getSymbol,
  onRowBtnClick,
} from '../../utils/cardsAndTableUtils.jsx';
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
  const isLoggedIn = status?.isLoggedIn === true,
    isCustomer = status?.role === 'CUSTOMER',
    isAdmin = status?.role === 'ADMIN';
  const location = useLocation();
  const isAdminView = location.pathname.includes('admin-console');
  const isAccountView = location.pathname.includes('/konto');
  const isUserPassesView = location.pathname.includes('grafik/karnety');
  console.log('ModalTable content', content);
  console.log('ModalTable headers', headers);
  console.log('ModalTable keys', keys);
  console.log('ModalTable status', status);

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
          const hasValidPass =
            isAdminView || isUserPassesView
              ? true
              : hasValidPassFn(status, row);
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
                            onRowBtnClick(
                              row,
                              isArchived,
                              action.method,
                              status,
                              isAdminView,
                              isUserPassesView,
                              isAccountView,
                              isCustomer,
                              isAdmin,
                              e
                            );
                          }}
                        >
                          {getSymbol(
                            row,
                            hasValidPass,
                            isArchived,
                            action,
                            isUserPassesView,
                            isAdminPage,
                            adminActions,
                            isLoggedIn,
                            isCustomer,
                            isAdmin
                          )}
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
