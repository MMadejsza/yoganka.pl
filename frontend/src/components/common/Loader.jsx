function Loader({ label }) {
  return (
    <div className='loader-container'>
      <div className='loader'></div>
      {label && <p className='loader-container__label'>{label}</p>}
    </div>
  );
}

export default Loader;
