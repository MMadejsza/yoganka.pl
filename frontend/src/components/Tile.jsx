import ImgDynamic from 'ImgDynamic.jsx';
function Tile({data}) {
	return (
		<div className='tile'>
			<ImgDynamic
				classy={`tile__img`}
				srcSet={`
                    ${data.imgPath}/320_${data.fileName}_0.jpg 320w,
					${data.imgPath}/480_${data.fileName}_0.jpg 480w,
                    `}
				sizes={`
                    (max-width: 640px) 320px,
                    (max-width: 768px) 480px,
                    480px
                    `}
				src={`${data.imgPath}/480_${data.fileName}_0.jpg`}
			/>
			<img
				className='tile__img'
				srcset='
                imgs/offer/regular/individual_and_group/front/320_group_0.jpg 320w,
                imgs/offer/regular/individual_and_group/front/480_group_0.jpg 480w
            '
				sizes='
            (max-width: 640px) 320px,
            (max-width: 768px) 480px,
            480px'
				src='imgs/offer/regular/individual_and_group/front/480_group_0.jpg'
				loading='lazy'
			/>
			<h3 className='tile__title'>Grupowe i&nbsp;Indywidualne</h3>
			<a
				href='#footer__socials'
				className='tile__btn tile__btn--general-contact'>
				Skontaktuj się
			</a>
		</div>
	);
}

export default Tile;
