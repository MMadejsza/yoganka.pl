import { useLocation } from 'react-router-dom';
import {
  formatValue,
  getSymbol,
  onRowBtnClick,
} from '../../utils/cardsAndTableUtils.jsx';
import { hasValidPassFn } from '../../utils/userCustomerUtils';
import SymbolOrIcon from '../common/SymbolOrIcon.jsx';

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
  forLegalDocuments,
}) {
  const today = new Date();
  const isLoggedIn = status?.isLoggedIn === true,
    isCustomer = status?.user?.role === 'CUSTOMER',
    isAdmin = status?.user?.role === 'ADMIN';
  const location = useLocation();
  const isAdminView = location.pathname.includes('admin-console');
  const isAccountView = location.pathname.includes('/konto');
  const isUserPassesView = location.pathname.includes('grafik/karnety');
  console.log('ModalTable content', content);
  console.log('ModalTable headers', headers);
  console.log('ModalTable keys', keys);
  console.log('ModalTable status', status);

  const formattedHeaders = headers?.map((header, index) => {
    let content = header;
    if (typeof header == 'object') {
      if (header.type == 'symbol') {
        content = <SymbolOrIcon specifier={header.symbol} />;
      }
    }

    return (
      <th className='modal-table__single-header' key={index}>
        {content}
      </th>
    );
  });

  return (
    <table
      className={`modal-table ${
        classModifier ? `modal-table--${classModifier}` : ''
      }`}
    >
      <thead className='modal-table__headers'>
        <tr>{formattedHeaders}</tr>
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
                      {onQuickAction?.map((action, index) => {
                        const deducedSymbol = getSymbol(
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
                        );

                        if (row.isVerified && action.symbol === 'sync_lock') {
                          return; //don't allow activation link if already verified
                        }

                        // avoid not logic action - frontend validation
                        if (row.bookingId) {
                          if (row.attendance && action.symbol == 'person_add')
                            return;
                          if (
                            !row.attendance &&
                            action.symbol == 'person_remove'
                          )
                            return;
                          if (
                            new Date(
                              `${row.ScheduleRecord.date}T${row.ScheduleRecord.startTime}`
                            ) < new Date()
                          )
                            return;
                        }

                        return (
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
                            {deducedSymbol}
                          </button>
                        );
                      })}
                    </div>
                  );
                }
                if (forLegalDocuments) {
                  if (key == 'content') {
                    value = (
                      <div className='cell-content-wrapper'>{row.content}</div>
                    );
                  }
                  if (key.includes('Id')) {
                    value = (
                      <div className='cell-content-wrapper--id'>
                        {row.rowId}
                      </div>
                    );
                  }
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
