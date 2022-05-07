import services from './services';
import { ModalWindow } from '../../../../molecules/modal';

const Screen = () => {
  const { modal, setModal } = services();

  return (
    <>
      {modal !== '' && (
        <ModalWindow text={modal} counterClose={() => setModal('')} />
      )}
    </>
  );
};

export default Screen;
