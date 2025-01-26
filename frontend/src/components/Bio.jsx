import Motto from './HeaderMotto.jsx';

function Bio({placement, isMobile}) {
	const prefix = placement;
	const pClass = `${prefix}__bio--description`;

	return (
		<article className={`${prefix}__bio--content`}>
			<h2 className={`${prefix}__bio--heading`}>cześć!</h2>
			<p className={pClass}>
				Cieszę się, że&nbsp;tu jesteś. Rozgość się u&nbsp;mnie, najlepiej z&nbsp;filiżanką
				aromatycznego naparu i&nbsp;zostań ze&nbsp;mną na&nbsp;dłużej.
			</p>
			<p className={pClass}>
				Nazywam się&nbsp;Ania, jestem certyfikowaną nauczycielką jogi w&nbsp;nurcie vinyasa
				oraz&nbsp;hatha. Moje zajęcia najczęściej prowadzę w&nbsp;stylu slow&nbsp;flow,
				czyli asany tworząc spójny układ, a&nbsp;ruch synchronizuje się z&nbsp;rytmem
				oddechu. Taki rodzaj jogi daje&nbsp;mi poczucie wolności i&nbsp;miękkości
				w&nbsp;ciele.
			</p>
			<p className={pClass}>
				W moim slow&nbsp;menu znajdziesz jogę dla firm, wydarzenia jednodniowe oraz
				slow&nbsp;wyjazdy, które ukoją i&nbsp;zregenerują Twój układ nerwowy przynosząc Ci
				ulgę na&nbsp;długi czas. Z&nbsp;uważnością dobieram miejsca i&nbsp;układam program
				sprawiając, że&nbsp;moje warsztaty to holistyczne podejście do zdrowszej
				i&nbsp;spokojniejszej Ciebie.
				<br />
				Do zobaczenia na macie!
			</p>
			<p className={`${prefix}__bio--signature`}>Anna Madejsza</p>
			{isMobile ? null : <Motto />}
		</article>
	);
}

export default Bio;
