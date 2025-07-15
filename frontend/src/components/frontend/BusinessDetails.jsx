function BusinessDetails({ data, leadingClass }) {
  const formattedPhone = data.phone
    .match(/.{1,3}/g) // splits into 3 digits sets because of flag g - finds all
    .join(' ');
  return (
    <div className={`${leadingClass}__company-details`}>
      <p className={`${leadingClass}__company-name`}>{data.name}</p>
      <p className={`${leadingClass}__company-location`}>{data.address}</p>
      <a
        className={`${leadingClass}__company-phone`}
        href={`tel:${data.phone}`}
        title={`Zadzwoń!`}
      >
        {formattedPhone}
      </a>
      <a
        className={`${leadingClass}__company-email`}
        href={`mailto:${data.mail}`}
        title={`Wyślij maila`}
      >
        {data.mail}
      </a>
      {data.nip && (
        <p className={`${leadingClass}__company-nip`}>{`NIP ${data.nip}`}</p>
      )}
    </div>
  );
}

export default BusinessDetails;
