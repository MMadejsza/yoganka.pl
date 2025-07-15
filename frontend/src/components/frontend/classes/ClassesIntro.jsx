// import Section from '../Section.jsx';
// import StampedImg from '../imgsRelated/StampedImg.jsx';
// import img320 from '/imgs/about/480_about_profile.jpg';
// import img600 from '/imgs/about/768_about_profile.jpg';
// import cert320 from '/imgs/about/about_YA-Logo.png';
// import cert600 from '/imgs/about/about_ryt.png';
// import logoImg320 from '/imgs/logo/320_logo_14.png';
// import logoImg480 from '/imgs/logo/480_logo_14.png';
// const logoPaths = [
//   { path: logoImg320, size: '320w' },
//   { path: logoImg480, size: '480w' },
// ];
// const stampedImgPaths = [
//   { path: img320, size: '480w' },
//   { path: img600, size: '768w' },
// ];
// const stampedImgCertPaths = [
//   { path: cert320, alt: 'Logo federacji yogi' },
//   { path: cert600, alt: 'Autoryzowany nauczyciel jogi' },
// ];
// function ClassesIntro({ isMobile }) {
//   const modifier = 'classes-page';
//   const prefix = 'about';
//   const pClass = `${prefix}__bio--description`;
//   return (
//     <Section classy='about' header='Zajęcia jogi' modifier={modifier}>
//       <StampedImg
//         noStamp={true}
//         placement='about'
//         modifier={modifier}
//         imgPaths={stampedImgPaths}
//         certPaths={stampedImgCertPaths}
//         sizes='(max-width: 640px) 320px,(max-width: 1024px) 600px,320px'
//         alt='Yoganka - w pozycji na plaży'
//       />
//       <article
//         className={`${prefix}__bio--content ${
//           modifier ? `${prefix}__bio--content--${modifier}` : ''
//         }`}
//       >
//         <h1
//           className={`${prefix}__bio--heading ${
//             modifier ? `${prefix}__bio--heading--${modifier}` : ''
//           }`}
//         >
//           Jakiej jogi uczę
//         </h1>
//         <p className={pClass}>
//           Prowadzę zajęcia w&nbsp;duchu vinyasa&nbsp;yoga. Nie&nbsp;mniej
//           na&nbsp;przestrzeni doświadczenia, odkrywania co mi&nbsp;służy
//           najbardziej, wykształciłam jej własny styl. Stawiam
//           na&nbsp;wzmacnianie oraz&nbsp;rozciąganie, dzięki czemu kompleksowo
//           dbasz o&nbsp;ciało. Stosuję również techniki
//         </p>
//       </article>
//     </Section>
//   );
// }

// export default ClassesIntro;
