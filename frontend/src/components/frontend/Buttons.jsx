import { Link } from 'react-router-dom';
import { btnsMap } from '../../utils/utils';
import { protectWordBreaks } from '../../utils/validation.js';
import SymbolOrIcon from '../common/SymbolOrIcon';

function Buttons({ list }) {
  const modifier = '';
  const btnsList = list.map((btn, index) => {
    let formattedLink = btn.link;
    let internalLink = false;
    let title;
    const btnType = btn.action;

    if (
      ['mail', 'phone', 'whatsapp', 'schedule', 'scheduleRecord'].includes(
        btnType
      )
    ) {
      // common parts:
      formattedLink = `${btnsMap[btnType]?.linkPrefix}${
        btn.scheduleId ? btn.scheduleId : btn.link ?? ''
      }`;
      title = btnsMap[btnType].title;
      btn.text = btn.text ?? btnsMap[btnType].text;

      // just these two have extra prop
      if (['schedule', 'scheduleRecord'].includes(btnType)) internalLink = true;

      // some have icon and others have symbol
      if (['phone', 'whatsapp'].includes(btnType))
        btn.icon = btnsMap[btnType].content;
      else btn.symbol = btnsMap[btnType].content;

      // mail is the only one across the website having either symbol or icon depended on placement so in btns (here) it must be particular symbol
      if (btnType == 'mail') btn.symbol = 'mail';
    }

    const icon = (
      <SymbolOrIcon
        type={btn.icon ? 'ICON' : 'SYMBOL'}
        specifier={btn.icon ?? btn.symbol}
        extraClass={'icon--cta'}
      />
    );

    if (internalLink) {
      return (
        <Link
          key={index + title}
          to={formattedLink}
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          title={title}
          className={`btn${modifier ? ` btn--${modifier}` : ''} btn`}
        >
          {icon}
          {protectWordBreaks(btn.text)}
        </Link>
      );
    } else {
      return (
        <a
          key={index + title}
          target='_blank'
          href={formattedLink}
          title={title}
          className={`btn${modifier ? ` btn--${modifier}` : ''} btn`}
        >
          {icon}
          {protectWordBreaks(btn.text)}
        </a>
      );
    }
  });

  return btnsList;
}

export default Buttons;
