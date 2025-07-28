import { Link } from 'react-router-dom';
import SymbolOrIcon from '../common/SymbolOrIcon';

function Buttons({ list }) {
  const modifier = '';
  const btnsList = list.map((btn, index) => {
    const isIconOrSymbol = btn.icon || btn.symbol;
    let formattedLink;
    let internalLink = false;

    switch (btn.action) {
      case 'mail':
        formattedLink = `mailto:${btn.link}`;
        btn.symbol = 'mail';
        btn.text = 'wyślij maila';
        break;
      case 'phone':
        formattedLink = `tel:${btn.link}`;
        btn.symbol = 'phone';
        btn.text = 'zadzwoń';
        break;
      case 'whatsapp':
        formattedLink = `https://wa.me/${btn.link}`;
        btn.icon = 'fa-brands fa-whatsapp';
        btn.text = 'whatsapp';
        break;
      case 'schedule':
        internalLink = true;
        btn.symbol = 'calendar_month';
        formattedLink = `/grafik`;
        break;
      case 'scheduleRecord':
        internalLink = true;
        btn.symbol = 'event';
        formattedLink = `/grafik/${btn.scheduleId}`;
        break;

      default:
        formattedLink = btn.link;
        break;
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
          key={index + btn.title}
          to={formattedLink}
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          title={btn.title}
          className={`btn${modifier ? ` btn--${modifier}` : ''} btn`}
        >
          {icon}
          {btn.text}
        </Link>
      );
      // } else if (isNotMobile && btn.symbol == 'phone') {
      //   return null;
    } else {
      return (
        <a
          key={index + btn.title}
          target='_blank'
          href={formattedLink}
          title={btn.title}
          className={`btn${modifier ? ` btn--${modifier}` : ''} btn`}
        >
          {icon}
          {btn.text}
        </a>
      );
    }
  });

  return btnsList;
}

export default Buttons;
