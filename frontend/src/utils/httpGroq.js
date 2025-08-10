//#region GROQ UTILS
const aboutImgGroQ = `{
  ...,
  image {
    ...,
    mainImage {
      ...,
      asset->{
        _id,
        _ref,
        url,
        originalFilename
      }
    },
    stamp1 {
      asset->{
        _id,
        _ref,
        url,
        originalFilename
      }
    },
    stamp2 {
      asset->{
        _id,
        _ref,
        url,
        originalFilename
      }
    }
  }
}`;
const introImgGroQ = `{
  ...,
  backgroundImage {
    asset->{
      _id,
      url,
      originalFilename
    }
  }
}`;
const logosImgGroQ = `{
  fullLogo {
    img {
      asset->{
        _id,
        url,
        originalFilename
      }
    },
    title
  },
  justBody {
    img {
      asset->{
        _id,
        url,
        originalFilename
      }
    },
    imgActive {
      asset->{
        _id,
        url,
        originalFilename
      }
    },
    title
  },
  justSign {
    img {
      asset->{
        _id,
        url,
        originalFilename
      }
    },
    title
  }
}`;
const tileImgGroQ = `{
  ...,
  mainImage {
    asset->{
      _id,
      url,
      originalFilename
    }
  },
  front {
    ...,
    btnsContent[]{
      ...,
      qrImage {
        asset->{
          _id,
          url,
          originalFilename
        }
      }
    }
  },
  modal {
    ...,
    gallery[]{
      asset->{
        _id,
        url,
        originalFilename
      }
    }
  }
}`;
const pastGalleryImgsGroQ = `{
  ...,
  gallery[] {
    asset->{
      _id,
      url,
      originalFilename
    }
  }
}`;
//#endregion GROQ UTILS
//#region GROQ COMMON QUERIES
export const logosGroQ = `*[_type == "logotypes"][0]${logosImgGroQ}`;
export const navsGroQ = `*[_type == "navs"]`;
export const campGroQ = `*[_type == "camp"]${tileImgGroQ}`;
export const classGroQ = `*[_type == "class"]${tileImgGroQ}`;
export const eventGroQ = `*[_type == "event"]${tileImgGroQ}`;
export const footerBusinessDataGroQ = `*[_type == "footerBusinessData"][0]`;
export const footerSocialsGroQ = `*[_type == "social"]{
  ...,
  qrImage {
    asset->{
      _id,
      url,
      originalFilename
    }
  }
}`;

//#endregion COMMON QUERIES
//#region GROQ HOME QUERIES
export const homeSeoGroQ = `*[_type == "homeSeo"][0]`;
export const homeIntroGroQ = `*[_type == "intro"][0]{
  ...,
  bcgImage {
    asset->{
      _id,
      url,
      originalFilename
    }
  }
}`;
export const aboutGroQ = `*[_type == "about"][0]${aboutImgGroQ}`;
export const homeOfferGroQ = `*[_type == "offer"][0]`;
export const reviewsGroQ = `*[_type == "review"][0]`;
export const certificatesGroQ = `*[_type == "certificates"][0]`;
export const partnersGroQ = `*[_type == "partners"][0]{
  ...,
  list[] {
    ...,
    logo {
      asset->{
        _id,
        url,
        originalFilename
      }
    }
  }
}`;
//#endregion HOME QUERIES
//#region GROQ CAMPS QUERIES
export const campsSeoGroQ = `*[_type == "campsSeo"][0]`;
export const campsIntroGroQ = `*[_type == "campsIntro"][0]${introImgGroQ}`;
export const campsOfferGroQ = `*[_type == "campsOffer"][0]`;
export const campsBenefitsGroQ = `*[_type == "benefits"][0]`;
export const campsPastPhotosGroQ = `*[_type == "campsPhotos"][0]${pastGalleryImgsGroQ}`;
//#endregion CAMPS QUERIES
//#region GROQ EVENTS QUERIES
export const eventsSeoGroQ = `*[_type == "eventsSeo"][0]`;
export const eventsIntroGroQ = `*[_type == "eventsIntro"][0]${introImgGroQ}`;
export const eventsOfferGroQ = `*[_type == "eventsOffer"][0]`;
export const eventsPastPhotosGroQ = `*[_type == "eventsPhotos"][0]${pastGalleryImgsGroQ}`;
//#endregion EVENTS QUERIES
//#region GROQ SCHEDULE QUERIES
export const scheduleSeoGroQ = `*[_type == "scheduleSeo"][0]`;
export const scheduleIntroGroQ = `*[_type == "scheduleIntro"][0]`;
//#endregion SCHEDULE QUERIES
//#region GROQ B2B QUERIES
export const b2bSeoGroQ = `*[_type == "b2bSeo"][0]`;
export const b2bIntroGroQ = `*[_type == "b2bIntro"][0]${introImgGroQ}`;
export const b2bBenefitsGroQ = `*[_type == "b2bBenefits"][0]`;
export const b2bOfferTypesGroQ = `*[_type == "b2bOfferTypes"][0]`;
export const b2bOfferGroQ = `*[_type == "b2bOffer"][0]{...,list[]${tileImgGroQ}}`;
export const b2bPriceListGroQ = `*[_type == "b2bPriceListAndCooperation"][0]`;
//#endregion B2B QUERIES
export const tosSeoGroQ = `*[_type == "tosSeo"][0]`;
